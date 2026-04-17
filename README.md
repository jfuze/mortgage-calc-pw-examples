## Setup & usage

### Prerequisites

- **Node.js 18+** - download from [nodejs.org](https://nodejs.org)
- **pnpm 10+**

To check if you already have them, run this in your terminal:

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

### Use one of the following to run the tests

```bash
pnpm test                 # all tests
pnpm test:repeatedly      # all tests, 3× each. I 403'd myself when this repeat value was higher
pnpm test --grep '@AC1'   # run by any tag, change the value how you want like @purchase or @smoke
```

### Viewing reports

This project is using the `line` reporter by default which will print results to the terminal but it's also generating the .html version. To view the HTML report, run:

```bash
pnpm exec playwright show-report
```

## Considerations

I would write many of these tests at a lower level than Playwright. I've created them here because it was fast to demonstrate how I'd approach doing so upon request.

## Test plan

Available in [google docs](https://docs.google.com/document/d/1vKAB6cpOf6F_vwSL8qV2jcF2k5u8NQFGMfAmFzkm02Y/edit?usp=sharing)

## AI Usage Disclosure

- I used AI to rubber duck setup instructions for a fresh environment
- I used AI tab completions as jumping off points occasionally since it picked up on what I intended to do based on the comments, locator names, and test names I'd created
