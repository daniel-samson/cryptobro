# CryptoBro Angular Frontend

A modern cryptocurrency price tracking application built with Angular 21, Zard UI components, and Tailwind CSS.

## Features

- **Display Top Cryptocurrencies**: View the top 10 cryptocurrencies by market cap with real-time prices
- **Detailed Coin Information**: Browse detailed market data including 24h high/low, market cap, and trading volume
- **Search Functionality**: Search cryptocurrencies by name or symbol with debounced input
- **Responsive Design**: Mobile-first design with Tailwind CSS for all screen sizes
- **Type-Safe**: Full TypeScript support with strict type checking
- **Tested**: Unit tests with Vitest for services and components

## Technology Stack

- **Framework**: Angular 21 (Standalone Components)
- **UI Component Library**: Zard UI (@ngzard/ui)
- **Styling**: Tailwind CSS + PostCSS
- **Testing**: Vitest + Testing Library
- **HTTP Client**: Angular HttpClient with RxJS Observables
- **Routing**: Angular Router with lazy loading support

## Project Structure

```
src/
├── app/
│   ├── models/           # TypeScript interfaces and data models
│   │   └── coin.model.ts
│   ├── services/         # API and business logic services
│   │   ├── coin-gecko.service.ts
│   │   └── coin-gecko.service.spec.ts
│   ├── pages/            # Routed page components
│   │   ├── home.component.ts
│   │   ├── coin-detail.component.ts
│   │   └── search.component.ts
│   ├── app.ts            # Root application component
│   ├── app.routes.ts     # Route configuration
│   ├── app.config.ts     # Application configuration
│   └── app.spec.ts       # App tests
├── index.html
├── main.ts
└── styles.css            # Global Tailwind styles
```

## Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 21+ (optional, can use `npm run ng`)

### Installation

```bash
cd front-end-ng
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your backend API URL:

```
VITE_API_BASE_URL=http://localhost:8000
```

## Development

### Start Development Server

```bash
npm run start
```

The application will be available at `http://localhost:4200/`

### Run Tests

```bash
# Run tests once
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Watch Mode (Development Build)

```bash
npm run watch
```

## API Integration

The application communicates with the Laravel backend API:

### Endpoints

- `GET /v1/coins/markets` - Get top 10 cryptocurrencies
- `GET /v1/coins/:symbol` - Get coin details by symbol
- `GET /v1/coins/search?q=:query` - Search coins

### Service: CoinGeckoService

Located in `src/app/services/coin-gecko.service.ts`

Methods:
- `getCoins()` - Fetch top cryptocurrencies
- `getCoinBySymbol(symbol)` - Get coin details
- `getCoinById(id)` - Get coin by ID
- `searchCoins(query)` - Search cryptocurrencies

## Components

### HomeComponent (`pages/home.component.ts`)
Displays a grid of top 10 cryptocurrencies with prices and links to detail pages.

### CoinDetailComponent (`pages/coin-detail.component.ts`)
Shows detailed information about a specific cryptocurrency including market data and description.

### SearchComponent (`pages/search.component.ts`)
Provides a search interface with debounced input for finding cryptocurrencies.

## Styling

This project uses Tailwind CSS for utility-first styling. Global styles are defined in `src/styles.css`.

### Tailwind Configuration
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

To customize Tailwind, edit `tailwind.config.js`.

## Linting and Formatting

Format code using Prettier:

```bash
npm run format  # (if configured)
```

## Additional Commands

- `npm run ng` - Run Angular CLI commands
- `npm run build` - Production build
- `npm run watch` - Watch mode build
- `npm test` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

## Contributing

When adding new features:

1. Create services in `src/app/services/`
2. Define models in `src/app/models/`
3. Create page components in `src/app/pages/`
4. Add routes in `src/app/app.routes.ts`
5. Write tests alongside your code (`.spec.ts` files)

## Resources

- [Angular Documentation](https://angular.dev)
- [Zard UI Documentation](https://zardui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vitest Documentation](https://vitest.dev)
