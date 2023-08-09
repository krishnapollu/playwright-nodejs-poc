const { expect } = require("@playwright/test");

exports.ProductPage = class Product {

    constructor(page) {
        this.page = page;
    }

    async addToCart(){
        await this.page.locator('//button[contains(.,"ADD TO CART")]').click();
    }

    async goBack(){
        await this.page.locator('//button[@class="inventory_details_back_button"]').click();
    }
};
    