import { test, expect } from "@playwright/test";
import salesOrderData from "../../testdata/salesOrderData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { SalesOrder } from '../../pages/salesOrder.js';

test('Create sales order using POM', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, salesOrder } = salesOrderData;

    const loginPage = new Login(page);
    const salesOrderPage = new SalesOrder(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl);
    await salesOrderPage.createSalesOrder(salesOrder);

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });

    await context.close();
});
