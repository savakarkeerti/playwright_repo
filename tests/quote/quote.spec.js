import { test, expect } from "@playwright/test";
import quoteData from "../../testdata/quoteData.json" assert { type: 'json' };

test('Quote EditView automation', async ({ browser }) => {
    test.slow();
    const context = await browser.newContext();
    const page = await context.newPage();
    const { loginUrl, editUrl, credentials, quote } = quoteData;

    await page.goto(loginUrl);
    await page.locator("//input[@name='user_name']").fill(credentials.username);
    await page.locator("//input[@name='user_password']").fill(credentials.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.locator('//a[@class="hdrLink"]').waitFor({ state: 'visible' });

    await page.goto(editUrl);
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/module=Quotes.*action=EditView/);

    await expect(page.locator('body')).toContainText(/Quote|Quotes/i, { timeout: 60000 });

    const subjectField = page.locator("input[name='subject'], input[name='title'], input[name='quote_no']").first();
    if (await subjectField.count()) {
        await subjectField.fill(quote.subject);
    }

    const [popup1] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator("(//img[@title='Select'])[2]").click()
    ]);
    await popup1.getByText(quote.contactName).first().click();
    await page.waitForTimeout(1000);

    const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator("(//img[@title='Select'])[3]").click()
    ]);
    await popup.getByText(quote.accountName).click();
    await page.waitForTimeout(1000);

    const [popup2] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator("//img[@title='Products']").click()
    ]);
    await popup2.getByText(quote.productName).click();
    await page.waitForTimeout(1000);

    await page.locator('//select[@name="quotestage"]').selectOption({ label: quote.stage });
    await page.locator('textarea').first().fill(quote.description);
    await page.locator('textarea').nth(1).fill(quote.description);
    await page.waitForTimeout(2000);
    await page.locator('//input[@id="qty1"]').fill(quote.qty);

    const saveButton = page.getByRole('button', { name: /Save/i }).first();
    if (await saveButton.count()) {
        await saveButton.click();
    }

    const subjectVisible = await page.locator('[id="mouseArea_Subject"]', { hasText: quote.subject }).isVisible();
    console.log(subjectVisible + ' Quote subject displayed');
    expect(subjectVisible, 'Created quote should be visible').toBeTruthy();

    await page.locator("(//td[@valign='bottom']/img)[1]").hover();
    await page.getByText('Sign Out').click();
    await page.locator("//input[@name='user_name']").waitFor({ state: 'visible' });

    await context.close();
});
