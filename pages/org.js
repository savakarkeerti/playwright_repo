import { randomNumber } from "../utils/random.js";
import {dropdown} from '../utils/dropdwon.js'

export class Organization {
    constructor(page) {
        this.page = page;
        this.createOrganisationButton = page.getByRole('link', { name: 'Create Organization...' }).first();
        this.nameField = page.locator('//input[@name="accountname"]');
        this.industrySelect = page.locator('//select[@name="industry"]');
        this.saveButton = page.getByRole('button', { name: ' Save ' }).first();
        this.infoHeader = page.locator("//span[contains(text(),'Organization Information')]").first();
        this.nameLabel = page.locator('[id="mouseArea_Organization Name"]');
    }

    async createOrganisation(name, industry) {
        const random_val = randomNumber();

        await this.createOrganisationButton.waitFor({ state: 'visible', timeout: 20000 });
        await this.createOrganisationButton.click();
        await this.page.getByText('Creating New Organization').waitFor({ state: 'visible', timeout: 20000 });

        await this.nameField.waitFor({ state: 'visible', timeout: 15000 });
        await this.nameField.fill(`${name}${random_val}`);

        if (industry) {
            await this.industrySelect.waitFor({ state: 'visible', timeout: 15000 });
            //await this.industrySelect.selectOption({ label: industry });
            await dropdown(this.industrySelect,industry )
        }

        await this.saveButton.waitFor({ state: 'visible', timeout: 15000 });
        await this.saveButton.click();

        await this.page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
        await this.infoHeader.waitFor({ state: 'visible', timeout: 30000 });
    }

    async isCreated(name) {
        return await this.nameLabel.filter({ hasText: name }).isVisible();
    }
}

