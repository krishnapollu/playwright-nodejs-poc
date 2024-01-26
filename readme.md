# **playwright-nodejs-poc** 

A sample project to run cross browser tests using Playwright.
Page Object Model deisgn pattern
Uses SwagLabs demo app for test execution

## Clone the project
`` git clone https://github.com/krishnapollu/playwright-nodejs-poc.git ``

## Install project
`` npm install ``

## Run tests
- headless
`` npx playwright tests ``
- headed
`` npx playwright tests --headed ``

## Reports

#### Default Playwright Reports
- `` npx playwright show-report ``

Playwright Reports can be viewed [here](https://krishnapollu.github.io/playwright-nodejs-poc/)

#### Allure Integration

Install allure reportet for playwright
- `` npm i -D @playwright/test allure-playwright `` 

Update playwright.config.js
```js
reporter: [
    ['html'], 
    ['allure-playwright', {
      detail: true,
      suiteTitle: false,
    }]
  ],
```

Reporting Util
```js
exports.ReportUtil = class ReportUtil {

    constructor(page, testInfo){
        this.page = page;
        this.testInfo = testInfo;
    }
    async takeScreenshot(){
        await this.testInfo.attach("login success", {
            body: await this.page.screenshot(),
            contentType: "image/png",
          });
    }
};
```

Add attachment from code
```js
this.ru = new ReportUtil(this.page, this.testInfo);
...
await this.ru.takeScreenshot();
```

Generate and View Allure report
- `` allure serve ``


## Accessibility Tests

An important Playwright feature which enables you to run Accessibility Tests on your web page and validate the violations.
In this project, I run the accessibility test and attach the report as JSON, instead of failing the test upfront if any violations are present.

#### Fixture
```js
// fixtures/myAccFixture.js

//from playwright documentation

exports.test = base.test.extend({
  makeAxeBuilder: async ({ page }, use, testInfo) => {
    const makeAxeBuilder = () => new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#commonly-reused-element-with-known-issue');
    await use(makeAxeBuilder);
  }
});
exports.expect = base.expect;
```

#### In Reporting Util
```js
//attach the accessibility results as JSON in playwright-report

async attach(accessibilityScanResults, testInfo) {
        await testInfo.attach('accessibility-scan-results', {
            body: JSON.stringify(accessibilityScanResults, null, 2),
            contentType: 'application/json'
          });
    }
```
#### Usage
```js
// import the fixture and reporting util
const { test, expect } = require('../../fixtures/myAccFixture');
const { ReportUtil } = require('../utils/reporting-utils');
...
test('Accessibility Test', async ({ page, makeAxeBuilder }, testInfo) => {
    let ru = new ReportUtil(page, testInfo);
    let accessibilityScanResults = {};
...
    accessibilityScanResults = await makeAxeBuilder().analyze(); // runs the accessibility test on current page context
    ru.attach(accessibilityScanResults, testInfo); // attaches the results as JSON in report
```

## API Tests
Playwright lets you write API tests as easily as below
```js
test('GET Users', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/3`);
        expect(response.status()).toBe(200);
    })
```

## Custom Logging
I have integrated Winston node module to implement logging.

#### Logger Util
```js
createLogger({
    transports: [
        new transports.Console({
            level: 'info',
           ...
        }),
        new transports.File({
            filename: 'logs/winston.log', 
            level: 'info',
            maxsize: 5242880,
            ... 
        })
    ]
})

```

#### Usage
```js
import { Logger } from '../utils/Logger';
...
let logger;
...
test.beforeEach( async ({page}, testInfo) => { // instantiate inside the hook
        logger = Logger(testInfo.project.name);
    });
...
test('TC01', async ({ page }) => {
        logger.info('Printing Browser Console logs: ');
```

#### Output
```
2023-08-12T19:49:29.343Z [chromium] info: Printing Browser Console logs: 
```

## Microsoft Playwright Testing
Playwright tests can now be run on remote browsers in your Azure Microsoft Playwright Testing workspace. (This is currently in preview)

#### Pre Requisites
- An active Azure Subscription (If you dont, create a free account before you begin)
- An Azure Microsoft Playwright Testing workspace. ( This can also be created prior to the next step by logging into your Azure account. Home > Playwright Tests > Create Workspace )

#### Configure
- Navigate to [Playwright Portal](https://playwright.microsoft.com/)
- Login with your Microsoft account
- Create a workspace (if not already created)
- Follow the steps shown in the workspace landing page to create ``PLAYWRIGHT_SERVICE_ACCESS_TOKEN`` and ``PLAYWRIGHT_SERVICE_URL``
- If you dont see it, you can create the same from Settings page.
- Store the ``PLAYWRIGHT_SERVICE_ACCESS_TOKEN`` and ``PLAYWRIGHT_SERVICE_URL`` in your repository Secrets
- Create ``playwright.service.config.ts`` file in your repository and copy the below contents to it.
  ```ts
            /*
        * This file enables Playwright client to connect to remote browsers.
        * It should be placed in the same directory as playwright.config.ts.
        */
        
        import { defineConfig } from '@playwright/test';
        import config from './playwright.config';
        import dotenv from 'dotenv';
        
        // Define environment on the dev box in .env file:
        //  .env:
        //    PLAYWRIGHT_SERVICE_ACCESS_TOKEN=XXX
        //    PLAYWRIGHT_SERVICE_URL=XXX
        
        // Define environment in your GitHub workflow spec.
        //  env:
        //    PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
        //    PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
        //    PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }}
        
        dotenv.config();
        
        // Name the test run if it's not named yet.
        process.env.PLAYWRIGHT_SERVICE_RUN_ID = process.env.PLAYWRIGHT_SERVICE_RUN_ID || new Date().toISOString();
        
        // Can be 'linux' or 'windows'.
        const os = process.env.PLAYWRIGHT_SERVICE_OS || 'linux';
        
        export default defineConfig(config, {
          // Define more generous timeout for the service operation if necessary.
          // timeout: 60000,
          // expect: {
          //   timeout: 10000,
          // },
          workers: 20,
        
          // Enable screenshot testing and configure directory with expectations.
          // https://learn.microsoft.com/azure/playwright-testing/how-to-configure-visual-comparisons
          ignoreSnapshots: false,
          snapshotPathTemplate: `{testDir}/__screenshots__/{testFilePath}/${os}/{arg}{ext}`,
          
          use: {
            // Specify the service endpoint.
            connectOptions: {
              wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}?cap=${JSON.stringify({
                // Can be 'linux' or 'windows'.
                os,
                runId: process.env.PLAYWRIGHT_SERVICE_RUN_ID
              })}`,
              timeout: 30000,
              headers: {
                'x-mpt-access-key': process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN!
              },
              // Allow service to access the localhost.
              exposeNetwork: '<loopback>'
            }
          },
          // Tenmp workaround for config merge bug in OSS https://github.com/microsoft/playwright/pull/28224
          projects: config.projects? config.projects : [{}]
        });
  ```
  
- Update your workflow yaml as below
  ```yml
    env:
          # Access token and regional endpoint for Microsoft Playwright Testing
          PLAYWRIGHT_SERVICE_ACCESS_TOKEN: ${{ secrets.PLAYWRIGHT_SERVICE_ACCESS_TOKEN }}
          PLAYWRIGHT_SERVICE_URL: ${{ secrets.PLAYWRIGHT_SERVICE_URL }}
          PLAYWRIGHT_SERVICE_RUN_ID: ${{ github.run_id }}-${{ github.run_attempt }}-${{ github.sha }}
      - name: Run Playwright tests
        run: npx playwright test --config=playwright.service.config.ts --workers=20 
  ```
The next tine your workflow is triggered, the tests will be run on your Azure Microsoft Playwright Testing workspace. Once the execution is complete, you will be able to see the test execution metadata in your workspace Home page.

#### Triggering tests from codespaces / local machine
You can alternatively trigger the tests from your working terminal as well. Follow the below steps:
```shell
export PLAYWRIGHT_SERVICE_ACCESS_TOKEN = <YOUR_PLAYWRIGHT_SERVICE_ACCESS_TOKEN>
export PLAYWRIGHT_SERVICE_URL = <YOUR_PLAYWRIGHT_SERVICE_URL>
npx playwright test --config=playwright.service.config.ts --workers=20
```
Once the execution is complete, you will be able to see the test execution metadata in your workspace Home page.

- More documentation available at [Playwright-Testing](https://learn.microsoft.com/en-in/azure/playwright-testing/)
