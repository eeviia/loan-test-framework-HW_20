import {Locator, Page, expect} from "@playwright/test";
import {SuccessPage} from "./success-page";

export class LoanPage {
    readonly page: Page;
    readonly monthlyPaymentField: Locator
    readonly applyField: Locator
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly continueButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.monthlyPaymentField = page.getByTestId('ib-small-loan-calculator-field-monthlyPayment')
        this.applyField = page.getByTestId('id-small-loan-calculator-field-apply')
        this.usernameInput = page.getByTestId('login-popup-username-input')
        this.passwordInput = page.getByTestId('login-popup-password-input')
        this.continueButton = page.getByTestId('login-popup-continue-button')
    }

    async mockLoanCalcResponse(amountValue: string, status: number = 200, amount: number, period: number) {
        const amountResponse = {
            paymentAmountMonthly: amountValue
        };

        // intercept the route only for specific query parameters (default values)
        await this.page.route(`**/api/loan-calc?amount=${amount}&period=${period}`, async route => {
            await route.fulfill({
                status: status,
                json: amountResponse
            }).catch(error => {
                console.log(error);
            });
        });
    }

    async navigate(url: string) {
        console.log('Navigating to', url);
        await this.page.goto(url);
    }

    async getMonthlyPaymentText(): Promise<string | null> {
        console.log('Getting monthly payment text');
        await expect(this.monthlyPaymentField).toBeVisible({timeout: 10000});
        const textContentElement = await this.monthlyPaymentField.textContent()
        console.log(`getMonthlyPaymentText ${textContentElement}`);
        return textContentElement?.replace('€', '').trim() ?? ''
    }

    async clickApplyButton() {
        console.log('Clicking Apply Button...');
        await this.applyField.click();
    }

    async loginInPopup(username: string, password: string): Promise<SuccessPage> {
        console.log('Login In', username, password);
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.continueButton.click();

        return new SuccessPage(this.page);
    }

    async getImagesCount(): Promise<number> {
        return await this.page.locator('[data-testid^=id-image-element-button-image-]').count()
    }

    async assertApplyFieldToBeInViewPort(i: number) {
        const count = i + 1
        await this.page.getByTestId(`id-image-element-button-image-${count}`).click();
        await expect(this.applyField).toBeInViewport()
    }
}