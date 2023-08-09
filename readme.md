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
`` npx playwright show-report ``

#### Allure Integration

Install allure reportet for playwright
`` npm i -D @playwright/test allure-playwright `` 

Update playwright.config.js
```
reporter: [
    ['html'], 
    ['allure-playwright', {
      detail: true,
      suiteTitle: false,
    }]
  ],
```

Reporting Util
```
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
```
this.ru = new ReportUtil(this.page, this.testInfo);
...
await this.ru.takeScreenshot();
```

Generate and View Allure report
`` allure serve ``
