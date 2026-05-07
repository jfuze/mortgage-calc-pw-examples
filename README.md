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

You _may need to_ copy `.env.example` to `.env` and provide the value for `VERCEL_AUTOMATION_BYPASS_SECRET`. The value is not uploaded to this project to avoid storing it in plain text.

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

## Tests will fail

4 tests will fail due to the app deviating from the acceptance criteria. These are:
- State field shows all 50 states + DC
- Interest rate message hides when rate is modified
- Interest rate has 3 decimal places
- Prompt is displayed when custom rate will be overridden
