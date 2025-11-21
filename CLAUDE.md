# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cryptobro** is a monorepo cryptocurrency price tracking application with:
- **Backend**: Laravel 12 REST API that fetches cryptocurrency prices from the CoinGecko API
- **Frontend**: Nuxt application (not yet implemented) that will communicate with the backend

Current branch: `feature/#5-setup-frontend` - setting up the Nuxt frontend.

## Frontend Architecture

### Technology Stack
- **Framework**: Nuxt 3 (Vue.js 3)
- **UI Components**: shadcn/vue with Radix Vue primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Testing**: Vitest + Vue Test Utils
- **Build Tool**: Vite
- **Type Safety**: TypeScript

### Directory Structure
- `pages/` - Page components (auto-routed)
- `components/ui/` - shadcn/vue components (Button, Card, etc.)
- `app/composables/` - Vue 3 composables for API and logic reuse
- `app/utils/` - Utility functions (cn, buttonVariants, etc.)
- `assets/css/` - Global styles and Tailwind configuration
- `public/` - Static assets including favicons
- `tests/` - Unit and component tests

### Key Features
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Library**: shadcn/vue provides accessible, themeable components
- **API Integration**: `useCoinGecko` composable handles backend communication
- **Tailwind CSS**: Utility-first CSS with custom color system via CSS variables
- **Dark Mode Ready**: CSS variables support light/dark theme switching
- **TypeScript**: Full type safety throughout the application
- **Tests**: Unit tests for composables, component tests for pages
- **CI/CD**: GitHub Actions workflow runs on frontend file changes

### Environment Variables
```
# Backend API configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Common Development Commands
```bash
cd front-end
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run preview         # Preview production build
npm test               # Run tests
npm test -- --watch    # Run tests in watch mode
npm run type-check     # Check TypeScript types
npm run lint           # Run ESLint
```

### Component System (shadcn/vue)

shadcn/vue components are built on:
- **Radix Vue**: Unstyled, accessible component primitives
- **Class Variance Authority (CVA)**: Type-safe component variants
- **Tailwind Merge**: Intelligently merge conflicting Tailwind classes

Example usage:
```vue
<template>
  <Card>
    <CardHeader>
      <CardTitle>Cryptocurrency Prices</CardTitle>
      <CardDescription>Real-time prices from CoinGecko API</CardDescription>
    </CardHeader>
    <CardContent>
      <!-- Content here -->
    </CardContent>
  </Card>
</template>
```

### Composables Pattern

The `useCoinGecko` composable encapsulates API calls:
```typescript
const { getCoins, getCoinById } = useCoinGecko()

// Fetch all cryptocurrencies
const coins = await getCoins()

// Fetch specific cryptocurrency
const bitcoin = await getCoinById('bitcoin')
```

### Testing Strategy
- **Unit Tests**: Test composables and utility functions
- **Component Tests**: Test Vue components in isolation
- **Framework**: Vitest for fast, ESM-native testing
- **Environment**: happy-dom for lightweight DOM simulation

## Backend Architecture

### Architecture Pattern: Domain-Driven Design (DDD)

The backend follows Domain-Driven Design principles to organize code by business domains rather than technical layers.

**Key Concepts:**
- **Domains**: Organize code by business capability (e.g., `CoinGecko`, `User`, `Payment`)
- **Domain Services**: Encapsulate business logic and external integrations
- **Controllers**: Handle HTTP concerns and delegate to domain services
- **Models**: Represent data entities (optional in DDD if not using database)

**Current Domain Structure:**
```
app/Domain/
└── CoinGecko/
    ├── CoinController.php       # HTTP request handling
    └── CoinGeckoService.php     # Business logic & API integration
```

**Benefits:**
- Business logic is grouped by domain, not technical layer
- Easier to understand what each domain does
- Services are reusable across controllers
- Clear separation between HTTP concerns and business logic
- Scalable as new domains are added

**When creating new features:**
1. Identify the domain (e.g., `User`, `Payment`, `Analytics`)
2. Create directory: `app/Domain/YourDomain/`
3. Add service class: `YourDomainService.php` (business logic)
4. Add controller: `YourDomainController.php` (HTTP handling)
5. Register routes in `routes/api.php`

### Technology Stack
- **Framework**: Laravel 12
- **Architecture**: Domain-Driven Design (DDD)
- **Database**: SQLite (default, configurable via `DB_CONNECTION` in `.env`)
- **API Integration**: CoinGecko API (free tier at `https://api.coingecko.com/api/v3/`)
- **Task Queue**: Database queue connection
- **Session/Cache**: Database-backed for simplicity

### Directory Structure
- `app/Domain/` - **Domain-Driven Design structure** (organize by business domain)
  - `CoinGecko/` - Cryptocurrency domain
    - `CoinController.php` - HTTP request handlers
    - `CoinGeckoService.php` - Business logic and external API integration
- `app/Http/Controllers/` - Base controllers and non-domain controllers
- `app/Models/` - Eloquent models for database entities
- `app/Providers/` - Service provider bootstrapping
- `database/migrations/` - Schema definitions (new migrations follow `YYYY_MM_DD_HHMMSS_description.php` format)
- `database/seeders/` - Data seeding for development
- `database/factories/` - Model factories for testing
- `routes/api.php` - API route definitions
- `routes/web.php` - Web routes
- `config/` - Application configuration files
- `tests/` - PHPUnit tests split into `Unit/` and `Feature/`

### Key Environment Variables
```
# Core
APP_ENV=local|production
APP_DEBUG=true|false
APP_URL=http://localhost (for development)

# Database
DB_CONNECTION=sqlite (or mysql, postgres, etc.)
DB_DATABASE=database.sqlite

# CoinGecko API
COINGECKO_ENDPOINT=https://api.coingecko.com/api/v3/  (free tier)
COINGECKO_API_KEY=                                     (only for pro accounts)
```

## Common Development Commands

### Setup
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
npm install
npm run build
```

Or use the setup script:
```bash
cd backend
composer run setup
```

### Running Development Server
```bash
cd backend
composer run dev
```
This runs concurrently:
- PHP dev server (`php artisan serve`)
- Queue listener (`php artisan queue:listen`)
- Pail logs (`php artisan pail`)
- Vite build watcher (`npm run dev`)

All are color-coded in the output. Use Ctrl+C to stop all.

### Testing
```bash
cd backend
composer run test              # Run all tests
php artisan test tests/Unit    # Run only Unit tests
php artisan test tests/Feature # Run only Feature tests
php artisan test --filter=TestName  # Run specific test
```

Tests run against an in-memory SQLite database (see `phpunit.xml` for test environment config).

### Code Quality
```bash
cd backend
./vendor/bin/pint  # Laravel code formatter (PSR-12)
./vendor/bin/pint app/  # Format specific directory
```

### Artisan Commands (Common)
```bash
php artisan make:controller ControllerName       # Create a controller
php artisan make:model ModelName -m              # Create model + migration
php artisan make:migration create_table_name     # Create a migration
php artisan make:test TestName --unit            # Create unit test
php artisan make:test TestName --feature         # Create feature test
php artisan migrate                              # Run pending migrations
php artisan migrate:rollback                     # Rollback last migration batch
php artisan tinker                               # Interactive shell
```

## API Design Pattern (Domain-Driven)

Follow this structure when implementing new API endpoints:

```php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Domain\CoinGecko\CoinController;

Route::prefix('v1')->group(function () {
    // Health check
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'timestamp' => now()]);
    });

    // Coin endpoints (CoinGecko domain)
    Route::prefix('coins')->group(function () {
        Route::get('/top', [CoinController::class, 'top']);
        Route::get('/search', [CoinController::class, 'search']);
        Route::get('/{symbol}', [CoinController::class, 'show']);
    });
});
```

**Controller Pattern (DDD):**
- Controllers live in `app/Domain/YourDomain/`
- Controllers extend `App\Http\Controllers\Controller`
- Controllers inject domain services via constructor
- Controllers handle HTTP concerns (validation, responses)
- Controllers delegate business logic to services

```php
// app/Domain/CoinGecko/CoinController.php
class CoinController extends Controller
{
    public function __construct(
        protected CoinGeckoService $coinGeckoService
    ) {}

    public function top(): JsonResponse
    {
        try {
            $coins = $this->coinGeckoService->getCoins([...]);
            return response()->json(['success' => true, 'data' => $coins]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => '...'], 500);
        }
    }
}
```

**Service Pattern (DDD):**
- Services encapsulate business logic and external integrations
- Services are injected into controllers
- Services can be reused across multiple controllers
- Services handle caching, API calls, data transformation

```php
// app/Domain/CoinGecko/CoinGeckoService.php
class CoinGeckoService
{
    public function getCoins(array $params): array
    {
        return Http::get(config('services.coingecko.endpoint') . '/coins/markets', $params)
            ->throw()
            ->json();
    }
}
```

## Database Patterns

### Creating Migrations
```bash
php artisan make:migration create_coins_table
```

Migrations go in `database/migrations/` and follow this pattern:
```php
Schema::create('coins', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('symbol')->unique();
    $table->decimal('price', 15, 8);
    $table->timestamps();
});
```

### Models
Models extend `Illuminate\Database\Eloquent\Model` and define:
- `$fillable` - mass-assignable attributes
- `$casts` - type casting (e.g., `'price' => 'decimal:8'`)
- Relationships via methods like `hasMany()`, `belongsTo()`

Example:
```php
class Coin extends Model {
    protected $fillable = ['name', 'symbol', 'price'];
    protected $casts = ['price' => 'decimal:8'];
}
```

## Testing Approach

- **Unit tests** (`tests/Unit/`): Test individual classes in isolation
- **Feature tests** (`tests/Feature/`): Test HTTP requests and full workflows

Feature tests inherit from `Tests\TestCase` which provides:
- Database transaction rollback between tests
- HTTP testing helpers (`$this->get()`, `$this->post()`, etc.)
- Authentication helpers (`$this->actingAs()`)

Example feature test:
```php
public function test_can_fetch_coins() {
    $response = $this->get('/api/v1/coins');
    $response->assertStatus(200);
    $response->assertJsonStructure(['data' => ['*' => ['id', 'name', 'symbol']]]);
}
```

## External Integration: CoinGecko API

The `.env` file shows CoinGecko API configuration:
- **Free tier**: `https://api.coingecko.com/api/v3/` (limited requests)
- **Pro tier**: Requires `COINGECKO_API_KEY` environment variable

Create a service class to encapsulate API calls:
```php
class CoinGeckoService {
    public function getCoins() {
        return Http::get(config('services.coingecko.endpoint') . '/coins');
    }
}
```

Store API endpoint in `config/services.php`:
```php
'coingecko' => [
    'endpoint' => env('COINGECKO_ENDPOINT'),
    'api_key' => env('COINGECKO_API_KEY'),
],
```

## Git Workflow (Gitflow)

This project follows Gitflow branching strategy:

### Branch Naming
- **Feature branches**: `feature/#<issue-number> <issue-title>`
  - Example: `feature/#1-setup-laravel-backend`
  - Use for new features and enhancements

- **Bug fix branches**: `bug/#<issue-number> <issue-title>`
  - Example: `bug/#15-fix-api-caching`
  - Use for bug fixes

- **Main branch**: `main`
  - Production-ready code
  - Merged via pull requests from feature/bug branches

- **Develop branch**: `develop` (optional, for larger teams)
  - Integration branch for features

### Commit Message Format

All commits must start with the **issue number** from the branch:

```
#<issue-number> Brief description of changes

- Bullet point details
- More details

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Examples:**
```
#1 Setup Laravel backend with API routes

#15 Fix API response caching

#8 Add user authentication endpoints
```

### Workflow Steps

1. Create a feature/bug branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/#<issue-number>-<title>
   ```

2. Make commits with issue number prefix:
   ```bash
   git commit -m "#<issue-number> Your commit message here"
   ```

3. Before merging, ensure quality:
   ```bash
   composer run test      # All tests pass
   ./vendor/bin/pint      # Code is formatted
   ```

4. Push and create a pull request:
   ```bash
   git push -u origin feature/#<issue-number>-<title>
   ```

5. Merge to `main` only after:
   - PR review is approved
   - All CI checks pass
   - Tests pass on the PR

## Linting and Formatting

Laravel Pint is configured for PSR-12 compliance. Run before committing:
```bash
./vendor/bin/pint
```

This automatically fixes code style issues in the `app/` directory.
