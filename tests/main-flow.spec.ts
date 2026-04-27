import {test, expect} from '@playwright/test';
import {LoanPage} from "../pages/loan-page";
import {SuccessPage} from "../pages/success-page";


test.describe('Loan main flow tests', async () => {
    const serviceURL = 'http://localhost:3000';
    const amountValue: string = '22.3'

    let loanHomePage: LoanPage;

    test.beforeEach(async ({page}) => {

        loanHomePage = new LoanPage(page)

        await loanHomePage.mockLoanCalcResponse(amountValue, 200,500, 12);

        await loanHomePage.navigate(serviceURL);

    })

    test('expect monthly payment value to be amount value', async () => {
        const textContentElement = await loanHomePage.getMonthlyPaymentText()

        expect(textContentElement).toBe(amountValue);
    })

    test('should allow user to login and submit loan application via popup', async () => {
        await loanHomePage.clickApplyButton();

        const successPage: SuccessPage = await loanHomePage.loginInPopup("test", "test")

        await successPage.confirmFinalSteps()
    });

    test('assert apply field to be in view port after clicking image elements', async () => {
        const count = await loanHomePage.getImagesCount()
        console.log(count)
        for(let i = 0; i < count; i++) {
            await loanHomePage.assertApplyFieldToBeInViewPort(i)
        }
    })
})



