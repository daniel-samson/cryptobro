# Cryptobro Frontend

A Nuxt 3 Vue.js application for the Cryptobro cryptocurrency price tracker. This frontend communicates with the Laravel backend API to display cryptocurrency prices in real-time.

## Project Structure

```
front-end/
├── app/
│   ├── components/    # Reusable Vue components
│   ├── composables/   # Vue 3 composables for logic reuse
│   ├── layouts/       # Layout components
│   ├── pages/         # Page components (auto-routed)
│   └── utils/         # Utility functions
├── public/            # Static assets
├── nuxt.config.ts     # Nuxt configuration
├── app.vue            # Root app component
└── tsconfig.json      # TypeScript configuration
```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Setup

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the `front-end` directory:

```env
# Backend API configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The application will automatically reload when you make changes to the code.

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## TypeScript Checking

Check TypeScript types:

```bash
npm run type-check
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Testing

Run tests with Vitest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Structure:**
- `tests/unit/` - Unit tests for composables and utilities
- `tests/components/` - Component tests for Vue components

**Test Coverage:**
- `useCoinGecko` composable - API integration tests
- `HomePage` component - UI rendering and interaction tests

## Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Data**: Fetches cryptocurrency prices from the backend API
- **Vue 3 Composition API**: Modern Vue.js development patterns
- **TypeScript Support**: Full TypeScript support for type safety
- **Nuxt 3**: Latest Nuxt framework with built-in features

## Continuous Integration

The project uses GitHub Actions for automated testing and quality checks.

**Workflow:** `.github/workflows/frontend-ci.yml`
- Runs on push to `main`, `develop`, and `feature/**` branches
- Only triggers on changes to `front-end/` directory
- Tests on Node.js 18.x and 20.x
- Includes:
  - Unit and component tests
  - TypeScript type checking
  - Code linting
  - Security vulnerability audit
  - Production build verification

**Status Check:**
All CI checks must pass before merging to main.

## Integration with Backend

The frontend communicates with the Laravel backend API:

- **API Base URL**: `http://localhost:8000/api` (configurable via environment variable)
- **Endpoints**:
  - `GET /v1/coins` - Fetch all cryptocurrencies
  - `GET /v1/coins/{id}` - Fetch a specific cryptocurrency

## Documentation

- [Nuxt Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
