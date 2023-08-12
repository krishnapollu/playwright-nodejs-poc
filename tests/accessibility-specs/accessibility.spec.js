const { test, expect } = require('../../fixtures/myFixture');
import { LoginPage } from '../pageobjects/login.page';
import { HomePage } from '../pageobjects/home.page';
import { CartPage } from '../pageobjects/cart.page';
import { CheckoutPage } from '../pageobjects/checkout.page';
import { ProductPage } from '../pageobjects/product.page';
const { ReportUtil } = require('../utils/reporting-utils');

test('Accessibility Test', async ({ page, makeAxeBuilder }, testInfo) => {

    const loginPage = new LoginPage(page, testInfo);
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const chkoutPage = new CheckoutPage(page);
    const productPage = new ProductPage(page);
    let ru = new ReportUtil(page, testInfo);
    let accessibilityScanResults = {};

    await loginPage.invoke();
    // accessibility test - Login Page
    accessibilityScanResults = await makeAxeBuilder().analyze();
    ru.attach(accessibilityScanResults, testInfo);

    await loginPage.doLogin(process.env.USER_ID, process.env.USER_PWD);
    // accessibility test - Home Page
    accessibilityScanResults = await makeAxeBuilder().analyze();
    ru.attach(accessibilityScanResults, testInfo);

    homePage.selectItem('Sauce Labs Bolt T-Shirt');
    // accessibility test - Product Page
    accessibilityScanResults = await makeAxeBuilder().analyze();
    ru.attach(accessibilityScanResults, testInfo);
    productPage.addToCart();

    await homePage.gotoCart();
    // accessibility test - Cart Page
    accessibilityScanResults = await makeAxeBuilder().analyze();
    ru.attach(accessibilityScanResults, testInfo);

    await homePage.logout();

});