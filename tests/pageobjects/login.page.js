require('dotenv').config();
const { ReportUtil } = require('../utils/reporting-utils');
import { Logger } from '../utils/Logger';

exports.LoginPage = class Login {

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.ru = new ReportUtil(this.page, this.testInfo);
        this.logger = Logger(testInfo.project.name);
    }

    async invoke() {
        this.logger.info(`Invoking URL ${process.env.APP_URL} ...`);
        await this.page.goto(process.env.APP_URL);
    }

    async doLogin(user, pwd) {

        this.logger.info(`Logging in...`)
        await this.page.locator('#user-name').fill(user);
        await this.page.locator('#password').fill(pwd);
        await this.page.locator('#login-button').click();
        this.logger.info(`Taking screenshot...`)
        await this.ru.takeScreenshot();
    }
};