require('dotenv').config();
const { ReportUtil } = require('../utils/reporting-utils');

exports.LoginPage = class Login {

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.ru = new ReportUtil(this.page, this.testInfo);
    }

    async invoke() {
        await this.page.goto(process.env.APP_URL);
    }

    async doLogin(user, pwd) {

        await this.page.locator('#user-name').fill(user);
        await this.page.locator('#password').fill(pwd);
        await this.page.locator('#login-button').click();
        await this.ru.takeScreenshot();
    }
};