export class Document {
    constructor(page) {
        this.page = page;
        this.titleField = page.locator("input[name='notes_title'], input[name='title']").first();
        this.saveButton = page.getByRole('button', { name: /Save/i }).first();
    }

    async editDocument(document) {
        await this.titleField.fill(document.title);
        await this.saveButton.click();
    }
}
