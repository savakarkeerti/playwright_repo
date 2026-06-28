import { test, expect } from "@playwright/test";
import leadsData from "../../testdata/leadsData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { Lead } from '../../pages/leads.js';

test('Create lead manual', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, lead } = leadsData;

    await page.goto(loginUrl);
    await page.locator("//input[@name='user_name']").fill(credentials.username);
    await page.locator("//input[@name='user_password']").fill(credentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('//a[@class="hdrLink"]').waitFor({ state: 'visible' });

    const homeElement = await page.locator('//a[@class="hdrLink"]').isVisible();
    expect(homeElement, 'Home link should be visible after login').toBeTruthy();

    await page.goto(moduleUrl);
    await page.locator("//a[text()='Leads']").first().click();
    await page.locator('//a[@class="hdrLink"]').waitFor({ state: 'visible' });
    await page.getByRole('link', { name: 'Create Lead...' }).first().click();
    await page.getByText('Creating New Lead').waitFor({ state: 'visible' });
    await page.locator('//select[@name="salutationtype"]').selectOption({ label: lead.salutation });
    await page.locator('//input[@name="firstname"]').fill(lead.firstName);
    await page.locator('//input[@name="lastname"]').fill(lead.lastName);
    await page.locator('//input[@name="company"]').fill(lead.company);
    await page.getByRole('button', { name: ' Save ' }).first().click();
    await page.waitForTimeout(2000);
    await page.locator("//span[contains(text(),'Lead Information')]").waitFor({ state: 'visible' });
    const leadVisible = await page.locator('[id="mouseArea_First Name"]', { hasText: lead.firstName }).isVisible();
    expect(leadVisible, 'Created lead should be visible').toBeTruthy();
    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.waitForTimeout(2000);
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });
    await context.close();
});

test.only('Create lead POM only', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, lead } = leadsData;

    const loginPage = new Login(page);
    const leadPage = new Lead(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl);
    await leadPage.createLead(lead);

    const leadVisible = await leadPage.isCreated(lead.firstName);
    expect(leadVisible, 'Created lead should be visible').toBeTruthy();
    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.waitForTimeout(2000);
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });
    await context.close();
});
