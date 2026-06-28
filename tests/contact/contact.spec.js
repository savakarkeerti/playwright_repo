import { test, expect } from "@playwright/test";
import contactData from "../../testdata/contactData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { Contact } from '../../pages/contact.js';

test('Create contact using POM', async ({ browser }) => {
    test.slow();
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, contact } = contactData;

    const loginPage = new Login(page);
    const contactPage = new Contact(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl);
    await contactPage.createContact(contact);

    const contactVisible = await contactPage.isCreated(contact.firstName);
    expect(contactVisible, 'Created contact should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.waitForTimeout(3000);
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });

    await context.close();
});

test.only('Create contact POM only', async ({ browser }) => {
    test.slow();
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, contact } = contactData;

    const loginPage = new Login(page);
    const contactPage = new Contact(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl);
    await contactPage.createContact(contact);

    const contactVisible = await contactPage.isCreated(contact.firstName);
    expect(contactVisible, 'Created contact should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.waitForTimeout(3000);
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });

    await context.close();
});
