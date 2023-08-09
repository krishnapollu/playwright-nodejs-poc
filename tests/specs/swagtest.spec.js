import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageobjects/login.page';
import { HomePage } from '../pageobjects/home.page';
import { CartPage } from '../pageobjects/cart.page';
import { CheckoutPage } from '../pageobjects/checkout.page';
import { ProductPage } from '../pageobjects/product.page';

test('TC01 - Sort Products ', async ({ page }, testInfo) => {

    const loginPage = new LoginPage(page, testInfo);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const chkoutPage = new CheckoutPage(page);
    const productPage = new ProductPage(page);

    await loginPage.invoke();
    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
    await homePage.sortItems('Price (low to high)');
    await homePage.verifyLowest('$7.99');
    await homePage.logout();

});

test('TC02 - Select one Product and then remove', async ({ page }, testInfo) => {

    const loginPage = new LoginPage(page, testInfo);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const chkoutPage = new CheckoutPage(page);
    const productPage = new ProductPage(page);

    await loginPage.invoke();
    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
    await homePage.selectItem('Sauce Labs Bolt T-Shirt');
    await productPage.addToCart();
    await productPage.goBack();
    await homePage.gotoCart();
    await cartPage.verifyItemPresent('Sauce Labs Bolt T-Shirt');
    await cartPage.removeFromCart('Sauce Labs Bolt T-Shirt');
    await homePage.logout();

});

test('TC03 - Select multiple Product and then remove', async ({ page }, testInfo) => {

    const loginPage = new LoginPage(page, testInfo);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const chkoutPage = new CheckoutPage(page);
    const productPage = new ProductPage(page);

    await loginPage.invoke();
    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
   
    //select product 1 and add it to cart
    await homePage.selectItem('Sauce Labs Bolt T-Shirt');
    await productPage.addToCart();
    await productPage.goBack();

    //select product 2 and add it to cart
    await homePage.selectItem('Sauce Labs Fleece Jacket');
    await productPage.addToCart();
    await productPage.goBack();

    await homePage.gotoCart();
    //verify products present in cart
    await cartPage.verifyItemPresent('Sauce Labs Bolt T-Shirt');
    await cartPage.verifyItemPresent('Sauce Labs Fleece Jacket');
    //remove items from cart
    await cartPage.removeFromCart('Sauce Labs Bolt T-Shirt');
    await cartPage.removeFromCart('Sauce Labs Fleece Jacket');
    await homePage.logout();

});

test('TC04 - Checkout Cancel Flow', async ({ page }, testInfo) => {

    const loginPage = new LoginPage(page, testInfo);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const chkoutPage = new CheckoutPage(page);
    const productPage = new ProductPage(page);

    await loginPage.invoke();
    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
   
    //select product 1 and add it to cart
    await homePage.selectItem('Sauce Labs Bolt T-Shirt');
    await productPage.addToCart();
    await productPage.goBack();

    await homePage.gotoCart();
    //verify products present in cart
    await cartPage.verifyItemPresent('Sauce Labs Bolt T-Shirt');
    await cartPage.checkOut();
    await chkoutPage.cancelCheckOut();
    await cartPage.removeFromCart('Sauce Labs Bolt T-Shirt');
    await homePage.logout();

});

test('TC05 - Single Product Checkout Flow', async ({ page }, testInfo) => {

    const loginPage = new LoginPage(page, testInfo);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const chkoutPage = new CheckoutPage(page);
    const productPage = new ProductPage(page);

    await loginPage.invoke();
    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
   
    //select product 1 and add it to cart
    await homePage.selectItem('Sauce Labs Bolt T-Shirt');
    await productPage.addToCart();
    await productPage.goBack();

    await homePage.gotoCart();
    //verify products present in cart
    await cartPage.verifyItemPresent('Sauce Labs Bolt T-Shirt');
    await cartPage.checkOut();
    await chkoutPage.fillCheckOutInfo('firstname', 'lastname', '12345');
    await cartPage.verifyPaymentInfo();
    await cartPage.clickFinish();
    await homePage.logout();

});