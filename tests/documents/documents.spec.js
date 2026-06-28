import { test, expect } from "@playwright/test";
import documentsData from "../../testdata/documentsData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { Document } from '../../pages/documents.js';

test('Edit document manual', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, editUrl, credentials, document } = documentsData;

    await page.goto(loginUrl);
    await page.locator("//input[@name='user_name']").fill(credentials.username);
    await page.locator("//input[@name='user_password']").fill(credentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('//a[@class="hdrLink"]').waitFor({ state: 'visible' });

    await page.goto(editUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/module=Documents&action=EditView/);
    await expect(page.locator('text=Documents').first()).toBeVisible();
    const titleField = page.locator("input[name='notes_title'], input[name='title']").first();
    if (await titleField.count()) {
        await titleField.fill(document.title);
    }
    const saveButton = page.getByRole('button', { name: /Save/i }).first();
    if (await saveButton.count()) {
        await saveButton.click();
    }
    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });
    await context.close();
});

test.only('Edit document POM only', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, editUrl, credentials, document } = documentsData;

    const loginPage = new Login(page);
    const documentPage = new Document(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(editUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/module=Documents&action=EditView/);
    await documentPage.editDocument(document);
    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });
    await context.close();
});
