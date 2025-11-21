design/cryptobro-logo-v1.svg
<div align="center">
  <a href="https://github.com/daniel-samson/cryptobro">
    <img src="design/cryptobro-logo-v1.svg" alt="Logo" width="328" height="88">
  </a>
</div>

A web application that displays information about the latest cryptocurrency prices.

## Structure

This is as mono repo, comprised of a front-end and backend applications.

### Front-end Application

The front end application is a Nuxt application. Which communicates to the backend application via its REST API.

#### Features

- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn Vue](https://www.shadcn-vue.com)


### Backend application

The backend application is stock laravel application. It provides a REST API to the front-end applition. It uses [coingecko](https://docs.coingecko.com/v3.0.1/reference/endpoint-overview) api to provide the latest cryptocurrency prices.

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
