# Cryptobro Backend

Laravel REST API for cryptocurrency price tracking, powered by the CoinGecko API.

## Features

- RESTful API for cryptocurrency data
- CoinGecko API integration
- Response caching to minimize external API calls
- Health check endpoint
- Comprehensive error handling
- PSR-12 compliant code (Laravel Pint)

## API Documentation

📚 **[View Full API Documentation](API.md)**

The API documentation includes:
- Complete endpoint reference
- Request/response examples
- Error handling guidelines
- cURL and JavaScript examples

## Quick Start

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ (for Vite asset compilation)
- SQLite (included with most PHP installations)

### Installation

1. **Install dependencies:**
   ```bash
   composer install
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure CoinGecko API:**

   Free tier (default):
   ```env
   COINGECKO_ENDPOINT=https://api.coingecko.com/api/v3/
   COINGECKO_API_KEY=
   ```

   Pro tier (optional):
   ```env
   COINGECKO_ENDPOINT=https://pro-api.coingecko.com/api/v3/
   COINGECKO_API_KEY=your_api_key_here
   ```

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Start development server:**
   ```bash
   composer run dev
   ```

   This runs concurrently:
   - PHP server on `http://localhost:8000`
   - Queue worker
   - Application logs (Pail)
   - Vite asset compiler

## API Endpoints

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/api/v1/health`           | Health check                   |
| GET    | `/api/v1/coins/markets`    | Top 10 cryptocurrencies        |
| GET    | `/api/v1/coins/search?q=*` | Search cryptocurrencies        |
| GET    | `/api/v1/coins/{symbol}`   | Get coin details by symbol     |

See [API.md](API.md) for detailed documentation with examples.

## Testing

```bash
# Run all tests
composer run test

# Run specific test suite
php artisan test tests/Unit
php artisan test tests/Feature

# Run specific test
php artisan test --filter=TestName
```

## Code Quality

Format code with Laravel Pint:
```bash
./vendor/bin/pint
```

Check formatting without changes:
```bash
./vendor/bin/pint --test
```

## Project Structure

```
backend/
├── app/
│   ├── Domain/
│   │   └── CoinGecko/
│   │       ├── CoinController.php      # API endpoints
│   │       └── CoinGeckoService.php    # External API integration
│   └── Http/
│       └── Controllers/
├── config/
│   └── services.php                    # CoinGecko configuration
├── routes/
│   └── api.php                         # API route definitions
├── tests/
│   ├── Feature/                        # Integration tests
│   └── Unit/                           # Unit tests
├── API.md                              # API documentation
└── composer.json
```

## Caching Strategy

The API implements intelligent caching to minimize external API calls:

- **Top coins**: 60 seconds
- **Coin search**: 300 seconds (5 minutes)
- **Individual coins**: 60 seconds per coin

Cache is automatically managed by Laravel's cache system.

## Environment Variables

| Variable              | Description                    | Default                                      |
|-----------------------|--------------------------------|----------------------------------------------|
| `COINGECKO_ENDPOINT`  | CoinGecko API base URL         | `https://api.coingecko.com/api/v3/`          |
| `COINGECKO_API_KEY`   | CoinGecko API key (optional)   | (empty for free tier)                        |
| `DB_CONNECTION`       | Database connection            | `sqlite`                                     |

## Development Commands

```bash
# Start development server
composer run dev

# Run tests
composer run test

# Format code
./vendor/bin/pint

# Clear cache
php artisan cache:clear

# View logs
php artisan pail
```

## Troubleshooting

### Rate Limiting Issues

If you encounter rate limiting from CoinGecko:
1. Increase cache duration in `CoinController.php`
2. Consider upgrading to CoinGecko Pro
3. Check logs with `php artisan pail`

### Database Issues

Reset the database:
```bash
php artisan migrate:fresh
```

### Cache Issues

Clear all caches:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## Contributing

Please see [CLAUDE.md](../CLAUDE.md) for development guidelines and git workflow.

## License

This project is part of the Cryptobro monorepo.
