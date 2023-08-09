require('dotenv').config();

exports.LoginPage = class Login {

    constructor(page) {
        this.page = page;
    }

    async invoke() {
        await this.page.goto(process.env.APP_URL);
    }

    async doLogin(user, pwd) {

        await this.page.locator('#user-name').fill(user);
        await this.page.locator('#password').fill(pwd);
        await this.page.locator('#login-button').click();

    }
};