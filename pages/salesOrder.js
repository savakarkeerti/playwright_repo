export class SalesOrder {
    constructor(page) {
        this.page = page;
        this.createSalesOrderLink = page.getByRole('link', { name: /Create Sales Order|Create SalesOrder/i }).first();
        this.createSalesOrderButton = page.getByRole('button', { name: /Create Sales Order|Create SalesOrder/i }).first();
        this.headerText = page.getByText(/Creating New Sales Order|Sales Order Information/i).first();
        this.subjectField = page.locator("input[name='subject'], input[name='salesorder_no'], input[name='subject']").first();
        this.accountField = page.locator("input[name='account_id_display'], input[name='account_name']").first();
        this.saveButton = page.getByRole('button', { name: /Save/i }).first();
    }

    async openCreate() {
        if (await this.createSalesOrderLink.count()) {
            await this.createSalesOrderLink.click();
        } else {
            await this.createSalesOrderButton.click();
        }
        await this.headerText.waitFor({ state: 'visible' });
    }

    async createSalesOrder(order) {
        await this.openCreate();
        await this.subjectField.fill(order.subject);
        await this.accountField.fill(order.account);
        await this.saveButton.click();
        await this.page.waitForTimeout(3000);
    }
}
