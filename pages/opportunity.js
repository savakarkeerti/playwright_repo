import { dropdown } from "../utils/dropdwon.js";
import { window } from '../utils/widnowhandle.js'

export class Opportunity {
    constructor(page) {
        this.page = page;
        this.mainTan=page.getByText('Opportunities').first();
        this.createOpportunityLink = page.getByRole('link', { name: 'Create Opportunity...' }).first();
        this.headerText = page.getByText('Creating New Opportunity');
        this.nameField = page.locator('//input[@name="potentialname"]');
        this.accountSelectButton = page.locator("(//img[@title='Select'])[1]");
        this.leadSourceSelect = page.locator('//select[@name="leadsource"]');
        this.closeDateButton = page.locator("//img[@id='jscal_trigger_closingdate']");
        this.stageSelect = page.locator('//select[@name="sales_stage"]');
        this.descriptionField = page.locator('//textarea').first();
        this.saveButton = page.getByRole('button', { name: ' Save ' }).first();
        this.infoHeader = page.locator("//span[contains(text(),'Opportunity Information')]");
        this.nameLabel = page.locator('[id="mouseArea_Opportunity Name"]');
    }

    async openCreate() {
        await this.mainTan.click();
        await this.createOpportunityLink.waitFor({state:'visible'})
        await this.createOpportunityLink.click();
        await this.headerText.waitFor({ state: 'visible' });
    }

    async createOpportunity(opportunity) {
        await this.openCreate();
        await this.nameField.fill(opportunity.name);

        const popupWindow = await window(this.page, async () => {
            await this.accountSelectButton.click();
        });
        await popupWindow.getByText(opportunity.accountName).click();


        // const [popup] = await Promise.all([
        //     this.page.waitForEvent('popup'),
        //     this.accountSelectButton.click()
        // ]);
        // await popup.getByText(opportunity.accountName).click();
        // await this.page.waitForTimeout(1000);
        

        await dropdown(this.leadSourceSelect, { label: opportunity.leadSource });
        await this.closeDateButton.click();
        await this.page.locator(`//td[text()='${opportunity.closingDate}']`).click();
        await dropdown(this.stageSelect, { label: opportunity.salesStage });
        await this.descriptionField.fill(opportunity.description);
        await this.saveButton.waitFor({ state: 'visible' });
        await this.saveButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.infoHeader.waitFor({ state: 'visible' });
    }

    async isCreated(name) {
        return await this.nameLabel.filter({ hasText: name }).isVisible();
    }
}
