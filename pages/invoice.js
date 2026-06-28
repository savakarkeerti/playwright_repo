export class Invoice {
    constructor(page) {
        this.page = page;
        this.createInvoiceLink = page.getByRole('link', { name: /Create Invoice/i }).first();
        this.createInvoiceButton = page.getByRole('button', { name: /Create Invoice/i }).first();
        this.subjectField = page.locator("input[name='subject'], input[name='invoice_no']").first();
        this.accountField = page.locator("input[name='account_id_display'], input[name='account_name']").first();
        this.saveButton = page.getByRole('button', { name: /Save/i }).first();
        this.headerText = page.getByText('Creating New Invoice');
    }

    async openCreate() {
        if (await this.createInvoiceLink.count()) {
            await this.createInvoiceLink.click();
        } else {
            await this.createInvoiceButton.click();
        }
        await this.headerText.waitFor({ state: 'visible' });
    }

    async createInvoice(invoice) {
        await this.openCreate();
        await this.subjectField.fill(invoice.subject);
        await this.accountField.fill(invoice.account);
        await this.saveButton.click();
        await this.page.waitForTimeout(3000);
    }
}
