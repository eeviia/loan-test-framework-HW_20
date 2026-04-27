import {expect, Locator, Page} from "@playwright/test";

export class SuccessPage {
    private readonly continueButton: Locator
    private readonly successButton: Locator

    constructor(page: Page) {
        this.continueButton = page.getByTestId('final-page-continue-button')
        this.successButton = page.getByTestId('final-page-success-ok-button')
    }

    async confirmFinalSteps() {
        console.log('Confirm Final Steps...');
        await expect(this.continueButton).toBeVisible({ timeout: 5000 });
        await this.continueButton.click();
        await expect(this.successButton).toBeVisible();
        await this.successButton.click();
    }
}