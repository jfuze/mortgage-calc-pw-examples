## Setup & usage

### Prerequisites

- **Node.js 18+** - download from [nodejs.org](https://nodejs.org)
- **pnpm 10+**


To check if you already have `node` and `pnpm`, run this in your terminal:

```bash
node --version
pnpm --version
```

If pnpm is missing:

```bash
npm install -g pnpm
```

### Install project dependencies

```bash
pnpm install
pnpm exec playwright install
```

You _may need to_ copy `.env.example` to `.env` and provide the value for `VERCEL_AUTOMATION_BYPASS_SECRET`. The value is not uploaded to this project to avoid storing it in plain text. You will need to retrieve the value from the assignment or an internal team member. **I did not encounter issues with the value missing**

### Use one of the following to run the tests

```bash
pnpm test                 # all tests
pnpm test:repeatedly      # all tests, 3× each. I 403'd myself when this repeat value was higher
pnpm test --grep '@AC1'   # run by any tag, change the value how you want like @purchase or @smoke
```

### Viewing reports

This project is using the `line` reporter by default which will print results to the terminal but it's also generating the .html version. To view the HTML report after running the tests, run:

```bash
pnpm exec playwright show-report
```

## Automated test coverage

This project currently covers more than the google doc test plan. The only exception is the interest rate input bounds testing (0.010% to 15%) which is not currently automated.

## Tests will fail

4 tests will fail due to the app deviating from the acceptance criteria. These are:
- State field shows all 50 states + DC
- Interest rate message hides when rate is modified
- Interest rate has 3 decimal places
- Prompt is displayed when custom rate will be overridden

## Considerations

While I would suggest having automated coverage for many of these tests, I would write a lot of them at a lower level than Playwright. I've created them here because it was fast to demonstrate how I'd approach doing so upon request and the assignment specified "black box" testing. Realistically, I'd check/coordinate with dev to see what's covered already at an integration/unit level.

There are many tests here that do not have corresponding tests in the written test plan. Writing the tests here was faster, and I was trying to comply to the 2-3 hour constraint in the assignment.

This project does not currently:
- go deep into page-object (classes, inheritance, etc.)
- have a coherent structure for tests/pages (nor does it have the quantity to justify it)
- use fixtures
- use constants
- have a mechanism for retrieving secrets
- handle auth, email/sms, etc

A real framework would likely require considerations on all of these fronts. I've left comments on some immediate changes I'd want to make or alternate approaches throughout the files. Again, I omitted much of that here to respect the time constraints.

## Test plan

Available in [google docs](https://docs.google.com/document/d/1vKAB6cpOf6F_vwSL8qV2jcF2k5u8NQFGMfAmFzkm02Y/edit?usp=sharing)

## AI Usage Disclosure

- I used AI to rubber duck setup instructions for a fresh environment
- I used AI tab completions as jumping off points occasionally since it picked up on what I intended to do based on the comments, locator names, and test names I'd created
