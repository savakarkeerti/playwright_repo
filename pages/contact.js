import { dropdown } from "../utils/dropdwon.js";
import { window } from "../utils/widnowhandle.js";

export class Contact {
    constructor(page) {
        this.page = page;
        this.createContactLink = page.getByRole('link', { name: 'Create Contact...' });
        this.headerText = page.getByText('Creating New Contact');
        this.salutationSelect = page.locator('//select[@name="salutationtype"]');
        this.firstName = page.locator('//input[@name="firstname"]');
        this.lastName = page.locator('//input[@name="lastname"]');
        this.accountSelectButton = page.locator("(//img[@title='Select'])[1]");
        this.fileUploadButton = page.getByRole('button', { name: 'Choose File' });
        this.saveButton = page.getByRole('button', { name: ' Save ' }).first();
        this.infoHeader = page.locator("//span[contains(text(),'Contact Information')]");
        this.nameLabel = page.locator('[id="mouseArea_First Name"]');
    }

    async openCreate() {
        await this.createContactLink.click();
        await this.headerText.waitFor({ state: 'visible' });
    }

    async createContact(contact) {
        await this.openCreate();
        await dropdown(this.salutationSelect, { label: contact.salutation });
        await this.firstName.fill(contact.firstName);
        await this.lastName.fill(contact.lastName);

        const popup = await window(this.page, async () => {
            await this.accountSelectButton.click();
        });
        await popup.getByText(contact.accountName).click();
        await this.page.waitForTimeout(2000);

        await this.fileUploadButton.setInputFiles(contact.filePath);
        await this.saveButton.click();
        await this.page.waitForTimeout(3000);
        await this.infoHeader.waitFor({ state: 'visible' });
    }

    async isCreated(firstName) {
        return await this.nameLabel.filter({ hasText: firstName }).isVisible();
    }
}
