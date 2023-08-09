const { expect } = require("@playwright/test");

exports.HomePage = class Home {

    constructor(page) {
        this.page = page;
    }

    async selectItem(str) {
        await this.page.locator('//div[@class="inventory_item_name" and contains(.,"'+str+'")]').click();
    }

    async sortItems(order){
        await this.page.locator('.product_sort_container').selectOption(order);
    }

    async gotoCart(){
        await this.page.locator('//div[@id="shopping_cart_container"]/a').click();
    }
    
    async logout(){
       await this.page.locator('//button[contains(.,"Open Menu")]').click();
       await this.page.locator('#logout_sidebar_link').click();
    }

    async verifyLowest(amount){
        await expect(this.page.locator('(//div[@class="inventory_item_price"])[1]')).toHaveText(amount);
    }
} 