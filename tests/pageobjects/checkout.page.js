const { expect } = require("@playwright/test");

exports.CheckoutPage = class Checkout {

    constructor(page) {
        this.page = page;
    }

    async fillCheckOutInfo(fname, lname, zip){

        await this.page.locator('#first-name').fill(fname);
        await this.page.locator('#last-name').fill(lname);
        await this.page.locator('#postal-code').fill(zip);
        await this.page.locator('//input[@value="CONTINUE"]').click();
    }

    async cancelCheckOut(){
        await this.page.locator('//a[contains(.,"CANCEL")]').click();
    }
};