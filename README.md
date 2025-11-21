<div align="center">
  <a href="https://github.com/daniel-samson/cryptobro">
    <img src="design/cryptobro-logo-v1.svg" alt="Logo" width="328" height="88">
  </a>
  <p>
    <strong>A web application that displays information about the latest cryptocurrency prices.</strong>
  </p>
</div>

## Project Status

[![Backend CI](https://github.com/daniel-samson/cryptobro/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/daniel-samson/cryptobro/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/daniel-samson/cryptobro/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/daniel-samson/cryptobro/actions/workflows/frontend-ci.yml)

## Structure

This is as mono repo comprised of a front-end and a backend application.

### Front-end Application

The front end application is a [Nuxt](https://nuxt.com) application. Which communicates to the backend application via its REST API.

#### Features

- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn Vue](https://www.shadcn-vue.com)


### Backend application

The backend application is a stock [Laravel](https://laravel.com) application. It provides a REST API to the front-end applition. It uses [coingecko](https://docs.coingecko.com/v3.0.1/reference/endpoint-overview) api to provide the latest cryptocurrency prices.

## Getting Started

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ (for Vite asset compilation)
- SQLite (included with most PHP installations)

### Running the Backend

1. **Install dependencies:**
   ```bash
   cd backend
   composer install
   ```

2. **Set up environment configuration:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

   **CoinGecko API Configuration:**

   The backend uses the CoinGecko API to fetch cryptocurrency prices. By default, it uses the free tier:

   ```env
   COINGECKO_ENDPOINT=https://api.coingecko.com/api/v3/
   COINGECKO_API_KEY=
   ```

   To use the CoinGecko Pro API with higher rate limits:

   1. Sign up for a [CoinGecko Pro Account](https://www.coingecko.com/en/api)
   2. Get your API key from the dashboard
   3. Update your `.env` file:
      ```env
      COINGECKO_ENDPOINT=https://pro-api.coingecko.com/api/v3/
      COINGECKO_API_KEY=your_actual_api_key_here
      ```

3. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

4. **Start the development server:**
   ```bash
   composer run dev
   ```

   This command runs concurrently:
   - PHP development server on `http://localhost:8000`
   - Laravel queue worker
   - Application logs via Pail
   - Vite asset compiler

   All processes run with color-coded output. Press `Ctrl+C` to stop.

   Alternatively, run each service separately:
   ```bash
   # Terminal 1: PHP server
   php artisan serve

   # Terminal 2: Queue listener (optional for development)
   php artisan queue:listen --tries=1

   # Terminal 3: Logs (optional)
   php artisan pail

   # Terminal 4: Asset compilation
   npm run dev
   ```

5. **Access the application:**
   - Backend API: `http://localhost:8000/api/v1/...`
   - Welcome page: `http://localhost:8000/`

### Running Tests

Run all tests:
```bash
composer run test
```

Run specific test suite:
```bash
php artisan test tests/Unit      # Unit tests only
php artisan test tests/Feature   # Feature tests only
php artisan test --filter=TestName  # Specific test
```

### Code Quality

Format code with Laravel Pint:
```bash
./vendor/bin/pint
```

Check formatting without making changes:
```bash
./vendor/bin/pint --test
```

### Running the Frontend

The frontend is a Nuxt 3 application built with Vue 3, shadcn/vue components, and Tailwind CSS.

#### Prerequisites

- Node.js 18+
- npm or yarn

#### Setup

1. **Install dependencies:**
   ```bash
   cd front-end
   npm install
   ```

2. **Set up environment configuration:**
   ```bash
   cp .env.example .env
   ```

   The frontend expects the backend API at:
   ```env
   NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

   Update this if your backend is running on a different host/port.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

#### Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Type checking
npm run type-check
```

#### Building for Production

```bash
npm run build
```

This creates an optimized build in the `.output/` directory. To run the production build locally:

```bash
npm run preview
```

For production deployments, use the Node.js server directly:
```bash
node .output/server/index.mjs
```

#### Testing

The frontend uses Vitest with Vue Test Utils for unit testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# View test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Test files are located in `tests/` directory with the following structure:
- `tests/unit/` - Component and composable unit tests
- `tests/unit/composables/` - API integration tests

#### Project Structure

```
front-end/
├── components/          # Vue components
│   └── ui/             # shadcn/vue UI components
├── pages/              # Nuxt pages (auto-routed)
├── app/
│   ├── composables/    # Reusable Vue composables
│   ├── utils/          # Utility functions
│   └── app.vue         # Root app component
├── assets/
│   └── css/            # Global styles and Tailwind directives
├── tests/              # Test files (unit tests)
├── nuxt.config.ts      # Nuxt configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── vitest.config.ts    # Vitest configuration
├── tsconfig.json       # TypeScript configuration
└── .env.example        # Environment variables template
```

#### API Integration

The frontend communicates with the backend via composables. The `useCoinGecko` composable provides methods for fetching cryptocurrency data:

```typescript
import { useCoinGecko } from '@/app/composables/useCoinGecko'

export default defineComponent({
  setup() {
    const { getCoins, getCoinById } = useCoinGecko()

    const coins = ref([])

    onMounted(async () => {
      try {
        coins.value = await getCoins()
      } catch (error) {
        console.error('Failed to fetch coins:', error)
      }
    })

    return { coins }
  }
})
```

The API base URL is configured via the `NUXT_PUBLIC_API_BASE_URL` environment variable and can be changed without rebuilding.

#### Component System

The frontend uses [shadcn/vue](https://www.shadcn-vue.com) components built on [Radix Vue](https://www.radix-vue.com) primitives:

- **UI Components**: Card, Button, Input, Select, Dialog, etc.
- **Accessible**: Built on WCAG 2.1 Level AA standards
- **Customizable**: Styled with Tailwind CSS and CSS variables
- **Type-Safe**: Full TypeScript support with class-variance-authority (CVA)

All components are auto-imported and available in pages and layouts without explicit imports.

#### Styling

The frontend uses [Tailwind CSS](https://tailwindcss.com) for styling with custom CSS variables for theming:

- **Dark Mode**: Built-in with CSS variable system
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Custom Theme**: Modify colors in `assets/css/globals.css`

To customize the theme, edit the CSS variables in the `globals.css` file:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.6% 11.2%;
    /* ... more variables */
  }
}
```

#### Browser Support

The frontend supports:
- Safari 12.1+
- iOS 12+
- Modern Chrome, Firefox, Edge

See `.browserslistrc` for detailed browser targeting configuration.
