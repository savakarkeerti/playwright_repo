
import { test, expect } from "@playwright/test";
import productData from "../../testdata/productData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { Product } from '../../pages/product.js';

test('Create product using POM', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, product } = productData;

    const loginPage = new Login(page);
    const productPage = new Product(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl);
    await productPage.createProduct(product);

    const productVisible = await productPage.isCreated(product.name);
    expect(productVisible, 'Created product should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.waitForTimeout(3000);
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });

    await context.close();
});
