<?php

return [
    /*
    |--------------------------------------------------------------------------
    | CoinGecko API Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration for the CoinGecko API integration.
    | The CoinGecko API provides cryptocurrency price data and market information.
    |
    | Documentation: https://docs.coingecko.com/v3.0.1/reference/endpoint-overview
    |
    */

    /*
    |--------------------------------------------------------------------------
    | API Endpoint
    |--------------------------------------------------------------------------
    |
    | The base URL for the CoinGecko API. Use the free tier endpoint for
    | development and lower request volumes, or the pro tier for production
    | with higher rate limits.
    |
    | Free tier: https://api.coingecko.com/api/v3/
    | Pro tier: https://pro-api.coingecko.com/api/v3/
    |
    */
    'endpoint' => env('COINGECKO_ENDPOINT', 'https://api.coingecko.com/api/v3/'),

    /*
    |--------------------------------------------------------------------------
    | API Key
    |--------------------------------------------------------------------------
    |
    | The API key for CoinGecko Pro tier access. Only required if using the
    | pro tier endpoint. Leave empty for free tier usage.
    |
    */
    'api_key' => env('COINGECKO_API_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout (seconds)
    |--------------------------------------------------------------------------
    |
    | The timeout duration for HTTP requests to the CoinGecko API.
    | Increase this if you experience timeout issues with large requests.
    |
    */
    'timeout' => env('COINGECKO_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Cache Duration (minutes)
    |--------------------------------------------------------------------------
    |
    | How long to cache cryptocurrency price data. Set to 0 to disable caching.
    | This reduces API requests and improves application performance.
    |
    */
    'cache_duration' => env('COINGECKO_CACHE_DURATION', 5),

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Free tier: 10-50 calls/minute (depending on endpoint)
    | Pro tier: Higher limits depending on plan
    |
    | Set to 0 to disable rate limiting on the application side.
    |
    */
    'max_requests_per_minute' => env('COINGECKO_MAX_REQUESTS_PER_MINUTE', 45),
];
