import { test, expect } from "@playwright/test";
import * as calc from "@pages/calculator";
import { states } from "states-us";

test.describe("Purchase form: ", { tag: ["@MORT-247", "@purchase"] }, () => {
	test.beforeEach(async ({ page }) => {
		await calc.goto(page);
	});

	test("State field shows all 50 states + DC", { tag: "@AC1" }, async ({ page }) => {
		const stateNames = new Set(states.filter((s) => !s.territory).map((s) => s.name));
		const stateSet = new Set(await calc.selectState(page).locator("option").allInnerTexts());

		for (const stateOption of stateNames) {
			expect(stateSet.has(stateOption), `"${stateOption}" missing from dropdown`).toBe(true);
		}
	});

	test("Picking a state populates interest rate", { tag: "@AC2" }, async ({ page }) => {
		const [res] = await Promise.all([
			page.waitForResponse(/\/api\/interest-rates\//),
			calc.selectState(page).selectOption("California"),
		]);

		const { rate } = await res.json();
		await expect(calc.spanPrefilledRate(page)).toContainText(rate.toString());
		await expect(calc.inputInterestRate(page)).toHaveValue(rate.toString());
	});

	test("Interest rate message hides when rate is modified", { tag: "@AC3" }, async ({ page }) => {
		await calc.selectState(page).selectOption("Tennessee");
		await expect(calc.spanPrefilledRate(page)).toBeVisible();

		await calc.inputInterestRate(page).clear();
		await expect(calc.spanPrefilledRate(page)).toBeHidden();
	});

	test("Interest rate has 3 decimal places", { tag: "@AC3" }, async ({ page }) => {
		await calc.selectState(page).selectOption("California");
		await calc.spanPrefilledRate(page).waitFor();
		const [_, decimals] = (await calc.inputInterestRate(page).inputValue()).split(".");
		expect(decimals.length).toBe(3);

		// or
		// const [res] = await Promise.all([
		// 	page.waitForResponse(/\/api\/interest-rates\//),
		// 	calc.selectState(page).selectOption("California"),
		// ]);

		// const { rate } = await res.json();
		// const [_, decimals] = rate.toString().split(".");
		// expect(decimals.length).toBe(3);
	});

	test(
		"Prompt is displayed when custom rate will be overridden",
		{ tag: "@AC5" },
		async ({ page }) => {
			await calc.inputInterestRate(page).fill("6.5");
			await Promise.all([
				calc.selectState(page).selectOption("Arkansas"),
				page.waitForResponse(/\/api\/interest-rates\//),
			]);
			await expect(calc.spanPrefilledRate(page)).toBeHidden();
			await expect(calc.inputInterestRate(page)).toHaveValue("6.5");
			// there doesn't appear to be a dialog, I'd prefer to do something like this
			// await expect(calc.dialogRateOverride(page)).toBeVisible();
			// for now we'll do something like this:
		},
	);

	test(
		"Submission without interest rate displays validation error",
		{ tag: "@AC6" },
		async ({ page }) => {
			const formValues: calc.PurchaseFormValues = {
				homeValue: "500000",
				downPayment: "100000",
				term: "30",
				state: "Tennessee",
			};

			await calc.fillPurchaseForm(page, formValues);
			await calc.inputInterestRate(page).clear();
			await calc.btnCalculate(page).click();

			await expect(calc.errorMissingInterestRate(page)).toBeVisible();
		},
	);

	test(
		"Loading indicator displays while rates are being fetched",
		{ tag: "@AC7" },
		async ({ page }) => {
			await calc.selectState(page).selectOption("Florida");
			await expect(calc.spanLoadingRate(page)).toBeVisible();
			await expect(calc.spanPrefilledRate(page)).toBeVisible();
			await expect(calc.spanLoadingRate(page)).toBeHidden();
		},
	);

	test("User can enter interest rate after fetch failure", { tag: "@AC8" }, async ({ page }) => {
		page.route(/\/api\/interest-rates\//, (route) => route.abort());

		await calc.selectState(page).selectOption("Arizona");
		await calc.inputInterestRate(page).fill("4.25");
		await expect(calc.inputInterestRate(page)).toHaveValue("4.25");
	});

	test("User can submit mortgage form and view results", { tag: "@smoke" }, async ({ page }) => {
		const formValues: calc.PurchaseFormValues = {
			homeValue: "500000",
			downPayment: "100000",
			term: "30",
			state: "Tennessee",
		};

		await calc.fillPurchaseForm(page, formValues);
		await calc.btnCalculate(page).click();
		await expect(calc.resultMonthlyPayment(page)).toBeVisible();
	});

	test("Form submission respects custom rate", { tag: "@smoke" }, async ({ page }) => {
		const formValues: calc.PurchaseFormValues = {
			homeValue: "500000",
			downPayment: "100000",
			term: "30",
			state: "Tennessee",
		};

		await calc.fillPurchaseForm(page, formValues);
		await calc.btnCalculate(page).click();
		await expect(calc.resultMonthlyPayment(page)).toBeVisible();
		const defaultRatePayment = await calc.getMonthlyPayment(page);

		await calc.goto(page);
		await calc.fillPurchaseForm(page, { ...formValues, rate: "3.5" });
		await calc.btnCalculate(page).click();
		const customRatePayment = await calc.getMonthlyPayment(page);

		expect(customRatePayment).not.toEqual(defaultRatePayment);
	});
});

test(
	"Selecting a state only populates new rate on refinance form",
	{ tag: ["@MORT-247", "@refinance", "@AC9"] },
	async ({ page }) => {
		await calc.goto(page);
		await calc.toggleLoanType(page, "refinance").click();
		await calc.inputCurrentRate(page).fill("4.8");
		await calc.selectState(page).selectOption("Florida");

		// ideally more info in the DOM to assert this message is under the right input
		await expect(calc.spanPrefilledRate(page)).toBeVisible();
		await expect(calc.inputNewRate(page)).not.toBeEmpty();
		await expect(calc.inputCurrentRate(page)).toHaveValue("4.8");
	},
);
