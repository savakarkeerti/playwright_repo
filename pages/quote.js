import { dropdown } from "../utils/dropdwon.js";
import { window } from "../utils/widnowhandle.js";

export class Quote {
    constructor(page) {
        this.page = page;
        this.headerText = page.getByText(/Quote|Quotes/i).first();
        this.subjectField = page.locator("input[name='subject'], input[name='title'], input[name='quote_no']").first();
        this.contactSelectButton = page.locator("(//img[@title='Select'])[2]");
        this.accountSelectButton = page.locator("(//img[@title='Select'])[3]");
        this.productSelectButton = page.locator("//img[@title='Products']");
        this.stageSelect = page.locator('//select[@name="quotestage"]');
        this.descriptionField = page.locator('textarea').first();
        this.descriptionField2 = page.locator('textarea').nth(1);
        this.quantityField = page.locator('//input[@id="qty1"]');
        this.saveButton = page.getByRole('button', { name: /Save/i }).first();
        this.subjectLabel = page.locator('[id="mouseArea_Subject"]');
    }

    async openEdit() {
        await this.headerText.waitFor({ state: 'visible' });
    }

    async editQuote(quote) {
        await this.openEdit();
        await this.subjectField.fill(quote.subject);

        const contactPopup = await window(this.page, async () => {
            await this.contactSelectButton.click();
        });
        await contactPopup.getByText(quote.contactName).first().click();
        await this.page.waitForTimeout(1000);

        const accountPopup = await window(this.page, async () => {
            await this.accountSelectButton.click();
        });
        await accountPopup.getByText(quote.accountName).click();
        await this.page.waitForTimeout(1000);

        const productPopup = await window(this.page, async () => {
            await this.productSelectButton.click();
        });
        await productPopup.getByText(quote.productName).click();
        await this.page.waitForTimeout(1000);

        await dropdown(this.stageSelect, { label: quote.stage });
        await this.descriptionField.fill(quote.description);
        await this.descriptionField2.fill(quote.description);
        await this.page.waitForTimeout(2000);
        await this.quantityField.fill(quote.qty);
        await this.saveButton.click();
    }

    async isCreated(subject) {
        return await this.subjectLabel.filter({ hasText: subject }).isVisible();
    }
}
