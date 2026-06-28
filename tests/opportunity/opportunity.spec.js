
import { test, expect } from "@playwright/test";
import opportunityData from "../../testdata/opportunityData.json" assert { type: 'json' };
import { Login } from '../../pages/login.js';
import { Opportunity } from '../../pages/opportunity.js';

test('Create opportunity using POM', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, opportunity } = opportunityData;

    const loginPage = new Login(page);
    const opportunityPage = new Opportunity(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
    await page.goto(moduleUrl);
    await opportunityPage.createOpportunity(opportunity);

    const oppVisible = await opportunityPage.isCreated(opportunity.name);
    expect(oppVisible, 'Created opportunity should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').waitFor({state:"visible"})
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });

    await context.close();
});

test.only('Create opportunity POM only', async ({ browser }) => {
    test.slow()
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, moduleUrl, credentials, opportunity } = opportunityData;

    const loginPage = new Login(page);
    const opportunityPage = new Opportunity(page);

    await loginPage.signIn(loginUrl, credentials.username, credentials.password);
   // await page.goto(moduleUrl);
    await opportunityPage.createOpportunity(opportunity);

    const oppVisible = await opportunityPage.isCreated(opportunity.name);
    expect(oppVisible, 'Created opportunity should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});

    await context.close();
});
