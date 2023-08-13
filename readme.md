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