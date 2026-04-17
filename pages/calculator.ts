import { type Locator, type Page } from "@playwright/test";

export type PurchaseFormValues = {
	homeValue: string;
	downPayment: string;
	term: string;
	state: string;
	rate?: string;
};

// !!! These are SUPER brittle, some elements don't have an ID or anything
// unique about them, some can only really be derived by current DOM position.
// I'd also want to avoid getting purely by text. We'd want to fix these in the app.
const divDownPayment = (page: Page) =>
	page.locator("label", { hasText: /down payment/i }).locator("..");
export const inputDownPayment = (page: Page) => divDownPayment(page).locator("input");
export const spanPrefilledRate = (page: Page) => page.getByText(/prefilled from/i);
export const spanLoadingRate = (page: Page) => page.getByText(/loading interest rate/i);
export const resultMonthlyPayment = (page: Page) => page.getByText("Total Monthly Payment");
export const errorMissingInterestRate = (page: Page) => page.getByText("Interest rate is required");
async function parseDollar(locator: Locator): Promise<number> {
	const text = await locator.locator("+ *").innerText();
	return parseFloat(text.replace(/[$,]/g, ""));
}
// ---

export const inputHomeValue = (page: Page) => page.getByLabel(/home value/i);
export const selectLoanTerm = (page: Page) => page.getByLabel(/loan term/i);
export const selectState = (page: Page) => page.getByLabel(/state/i);
export const inputInterestRate = (page: Page) => page.getByLabel(/interest rate/i);
export const inputCurrentRate = (page: Page) => page.getByLabel(/current.*rate/i);
export const inputNewRate = (page: Page) => page.getByLabel(/new.*rate/i);
export const toggleLoanType = (page: Page, type: "purchase" | "refinance") =>
	page.getByRole("button", { name: type });
export const btnCalculate = (page: Page) => page.getByRole("button", { name: "calculate" });

export async function goto(page: Page) {
	await page.goto("/");
}

export const getMonthlyPayment = (page: Page) => parseDollar(resultMonthlyPayment(page));

/*
  The following interfaces and how we manage test data are definitely an MVP.
  I like to provide sensible defaults, but would also like a test data generator, etc.
  and how exactly this should be called is up for debate (not to mention where
  the function itself should live).
 */

export async function fillPurchaseForm(page: Page, values: PurchaseFormValues) {
	await inputHomeValue(page).fill(values.homeValue);
	await inputDownPayment(page).fill(values.downPayment);
	await selectLoanTerm(page).selectOption(values.term);
	await selectState(page).selectOption({ label: values.state });
	await spanPrefilledRate(page).waitFor();
	if (values.rate) {
		await inputInterestRate(page).fill(values.rate);
	}
}
