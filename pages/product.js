export class Product {
    constructor(page) {
        this.page = page;
        this.createProductLink = page.getByRole('link', { name: 'Create Product...' });
        this.headerText = page.getByText('Creating New Product');
        this.nameField = page.locator('//input[@name="productname"]');
        this.saveButton = page.getByRole('button', { name: ' Save ' }).first();
        this.infoHeader = page.locator("//span[contains(text(),'Product Information')]");
        this.nameLabel = page.locator('[id="mouseArea_Product Name"]');
    }

    async openCreate() {
        await this.createProductLink.click();
        await this.headerText.waitFor({ state: 'visible' });
    }

    async createProduct(product) {
        await this.openCreate();
        await this.nameField.fill(product.name);
        await this.saveButton.click();
        await this.page.waitForTimeout(3000);
        await this.infoHeader.waitFor({ state: 'visible' });
    }

    async isCreated(name) {
        return await this.nameLabel.filter({ hasText: name }).isVisible();
    }
}
