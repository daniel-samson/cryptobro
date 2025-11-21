# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cryptobro** is a monorepo cryptocurrency price tracking application with:
- **Backend**: Laravel 12 REST API that fetches cryptocurrency prices from the CoinGecko API
- **Frontend**: Nuxt application (not yet implemented) that will communicate with the backend

Current branch: `feature/#1-setup-laravel-backend` - setting up the Laravel backend structure.

## Backend Architecture

### Technology Stack
- **Framework**: Laravel 12
- **Database**: SQLite (default, configurable via `DB_CONNECTION` in `.env`)
- **API Integration**: CoinGecko API (free tier at `https://api.coingecko.com/api/v3/`)
- **Task Queue**: Database queue connection
- **Session/Cache**: Database-backed for simplicity

### Directory Structure
- `app/Http/Controllers/` - Request handlers for API endpoints
- `app/Models/` - Eloquent models for database entities
- `app/Providers/` - Service provider bootstrapping
- `database/migrations/` - Schema definitions (new migrations follow `YYYY_MM_DD_HHMMSS_description.php` format)
- `database/seeders/` - Data seeding for development
- `database/factories/` - Model factories for testing
- `routes/api.php` - API route definitions (currently doesn't exist, needs to be created)
- `routes/web.php` - Web routes (currently only has a welcome view)
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

## API Design Pattern

Since `routes/api.php` doesn't exist yet, follow this structure when implementing:

```php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CoinController;

Route::prefix('v1')->group(function () {
    Route::get('/coins', [CoinController::class, 'index']);
    Route::get('/coins/{id}', [CoinController::class, 'show']);
});
```

Controllers should extend `App\Http\Controllers\Controller` and return JSON responses via `response()->json()` or Eloquent models (Laravel auto-converts to JSON).

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
