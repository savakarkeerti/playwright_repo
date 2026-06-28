export class Login {
    constructor(page) {
        this.page = page;
        this.username = page.locator("//input[@name='user_name']");
        this.password = page.locator("//input[@name='user_password']");
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.homeLink = page.locator("//a[@class='hdrLink']");
    }

    async signIn(url, username, password) {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        await this.username.waitFor({ state: 'visible', timeout: 10000 });
        await this.username.fill(username);
        await this.password.waitFor({ state: 'visible', timeout: 10000 });
        await this.password.fill(password);
        await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.loginButton.click();
        await this.homeLink.waitFor({ state: 'visible', timeout: 20000 });
    }
}
 