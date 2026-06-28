import { test, expect } from "@playwright/test";
import invoiceData from "../../testdata/invoiceData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { Invoice } from '../../pages/invoice.js';

test('Create invoice manual', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, invoice } = invoiceData;

    await page.goto(loginUrl);
    await page.locator("//input[@name='user_name']").fill(credentials.username);
    await page.locator("//input[@name='user_password']").fill(credentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('//a[@class="hdrLink"]').waitFor({ state: 'visible' });
    await page.goto(moduleUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/module=Invoice&action=index/);
    const createInvoice = page.getByRole('link', { name: /Create Invoice/i }).first();
    if (await createInvoice.count()) {
        await createInvoice.click();
    } else {
        await page.getByRole('button', { name: /Create Invoice/i }).first().click();
    }
    await page.waitForTimeout(2000);
    await page.getByText('Creating New Invoice').waitFor({ state: 'visible' });
    const subject = page.locator("input[name='subject'], input[name='invoice_no']").first();
    if (await subject.count()) {
        await subject.fill(invoice.subject);
    }
    const account = page.locator("input[name='account_id_display'], input[name='account_name']").first();
    if (await account.count()) {
        await account.fill(invoice.account);
    }
    const saveButton = page.getByRole('button', { name: /Save/i }).first();
    if (await saveButton.count()) {
        await saveButton.click();
    }
    await page.waitForTimeout(3000);
    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });
    await context.close();
});

test.only('Create invoice POM only', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, invoice } = invoiceData;

    const loginPage = new Login(page);
    const invoicePage = new Invoice(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl);
    await invoicePage.createInvoice(invoice);

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });
    await context.close();
});
