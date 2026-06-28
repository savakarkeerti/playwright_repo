import { dropdown } from "../utils/dropdwon.js";

export class Lead {
    constructor(page) {
        this.page = page;
        this.leadsTab = page.locator("//a[text()='Leads']").first();
        this.createLeadLink = page.getByRole('link', { name: 'Create Lead...' }).first();
        this.salutationSelect = page.locator('//select[@name="salutationtype"]');
        this.firstName = page.locator('//input[@name="firstname"]');
        this.lastName = page.locator('//input[@name="lastname"]');
        this.company = page.locator('//input[@name="company"]');
        this.saveButton = page.getByRole('button', { name: ' Save ' }).first();
        this.infoHeader = page.locator("//span[contains(text(),'Lead Information')]");
        this.nameLabel = page.locator('[id="mouseArea_First Name"]');
    }

    async openCreate() {
        await this.leadsTab.waitFor({ state: 'visible', timeout: 10000 });
        await this.leadsTab.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.createLeadLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.createLeadLink.click();
        await this.page.getByText('Creating New Lead').waitFor({ state: 'visible', timeout: 15000 });
    }

    async createLead(lead) {
        await this.openCreate();
        await this.salutationSelect.waitFor({ state: 'visible', timeout: 10000 });
        await dropdown(this.salutationSelect, { label: lead.salutation });
        await this.firstName.waitFor({ state: 'visible', timeout: 10000 });
        await this.firstName.fill(lead.firstName);
        await this.lastName.waitFor({ state: 'visible', timeout: 10000 });
        await this.lastName.fill(lead.lastName);
        await this.company.waitFor({ state: 'visible', timeout: 10000 });
        await this.company.fill(lead.company);
        await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveButton.click();
        await this.infoHeader.waitFor({ state: 'visible', timeout: 30000 }); // Need update with text 
    }

    async isCreated(firstName) {
        return await this.nameLabel.filter({ hasText: firstName }).isVisible();
    }
}
