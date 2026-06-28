import { test, expect } from "@playwright/test";
import organizationData from "../../testdata/organizationData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { Organization } from '../../pages/organization.js';


test('Create organization manual', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, organization } = organizationData;

    await page.goto(loginUrl);
    await page.locator("//input[@name='user_name']").fill(credentials.username);
    await page.locator("//input[@name='user_password']").fill(credentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('//a[@class="hdrLink"]').waitFor({ state: 'visible' });

    const homeElement = await page.locator('//a[@class="hdrLink"]').isVisible();
    expect(homeElement, 'Home link should be visible after login').toBeTruthy();

    await page.goto(moduleUrl);
    await page.getByRole('link', { name: 'Create Organization...' }).click();
    await page.getByText('Creating New Organization').waitFor({ state: 'visible' });

    await page.locator("//input[@name='accountname']").fill(organization.name);
    await page.locator('//select[@name="industry"]').selectOption({ label: organization.industry });
    await page.getByRole('button', { name: ' Save ' }).first().click();
    await page.waitForTimeout(3000);
    await page.locator("//span[contains(text(),'Organization Information')]").first().waitFor({ state: 'visible' });

    const orgVisible = await page.locator('[id="mouseArea_Organization Name"]', { hasText: organization.name }).isVisible();
    expect(orgVisible, 'Created organization should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.waitForTimeout(3000);
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });
    await context.close();
});

test.only('Create organization POM only', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, organization } = organizationData;

    const loginPage = new Login(page);
    const organizationPage = new Organization(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await organizationPage.createOrganisation(organization.name, organization.industry);

    const orgVisible = await organizationPage.isCreated(organization.name);
    expect(orgVisible, 'Created organization should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
    await context.close();
}, { timeout: 60000 });
