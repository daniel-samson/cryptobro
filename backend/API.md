# Cryptobro API Documentation

Version: 1.0
Base URL: `http://localhost:8000/v1` (development)

## Overview

The Cryptobro API provides endpoints for retrieving cryptocurrency data from CoinGecko. All endpoints return JSON responses and implement caching to minimize external API calls.

## Authentication

Currently, no authentication is required for API access.

## Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": {...},
  "count": 10  // Optional: included in list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (debug mode only)"
}
```

## Endpoints

### Health Check

Check if the API is running and responsive.

**Endpoint:** `GET /v1/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000000Z"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### Get Top Cryptocurrencies

Retrieve the top 10 cryptocurrencies by market capitalization.

**Endpoint:** `GET /v1/coins/markets`

**Caching:** 60 seconds

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      "current_price": 45000.50,
      "market_cap": 880000000000,
      "market_cap_rank": 1,
      "total_volume": 25000000000,
      "high_24h": 46000.00,
      "low_24h": 44000.00,
      "price_change_24h": 500.50,
      "price_change_percentage_24h": 1.12,
      "circulating_supply": 19000000,
      "total_supply": 21000000,
      "ath": 69000.00,
      "ath_change_percentage": -34.78,
      "ath_date": "2021-11-10T14:24:11.849Z",
      "atl": 67.81,
      "atl_change_percentage": 66000.00,
      "atl_date": "2013-07-06T00:00:00.000Z",
      "last_updated": "2024-01-15T10:30:00.000Z"
    }
    // ... 9 more coins
  ],
  "count": 10
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Failed to fetch data

---

### Search Cryptocurrencies

Search for cryptocurrencies by name or symbol.

**Endpoint:** `GET /v1/coins/search`

**Query Parameters:**
| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| q         | string | Yes      | Search keyword (name or symbol)      |

**Example Request:**
```
GET /v1/coins/search?q=bitcoin
```

**Caching:** 300 seconds (5 minutes)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      "current_price": 45000.50,
      "market_cap": 880000000000,
      "market_cap_rank": 1,
      "price_change_percentage_24h": 1.12
      // ... additional fields
    },
    {
      "id": "bitcoin-cash",
      "symbol": "bch",
      "name": "Bitcoin Cash",
      // ... additional fields
    }
  ],
  "count": 2,
  "query": "bitcoin"
}
```

**Status Codes:**
- `200 OK` - Success (even if no results found)
- `422 Unprocessable Entity` - Missing or invalid query parameter
- `500 Internal Server Error` - Failed to fetch data

**Error Example (Missing Query):**
```json
{
  "success": false,
  "message": "Search query parameter \"q\" is required",
  "data": []
}
```

---

### Get Cryptocurrency Details

Get detailed information for a specific cryptocurrency by its symbol.

**Endpoint:** `GET /v1/coins/{symbol}`

**Path Parameters:**
| Parameter | Type   | Description                              |
|-----------|--------|------------------------------------------|
| symbol    | string | Cryptocurrency symbol (e.g., btc, eth)   |

**Example Request:**
```
GET /v1/coins/btc
```

**Caching:** 60 seconds per coin

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "description": {
      "en": "Bitcoin is the first successful internet money..."
    },
    "image": {
      "thumb": "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
      "small": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      "large": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
    },
    "market_cap_rank": 1,
    "market_data": {
      "current_price": {
        "usd": 45000.50
      },
      "market_cap": {
        "usd": 880000000000
      },
      "total_volume": {
        "usd": 25000000000
      },
      "high_24h": {
        "usd": 46000.00
      },
      "low_24h": {
        "usd": 44000.00
      },
      "price_change_24h": 500.50,
      "price_change_percentage_24h": 1.12,
      "market_cap_change_24h": 5000000000,
      "market_cap_change_percentage_24h": 0.57,
      "circulating_supply": 19000000,
      "total_supply": 21000000,
      "max_supply": 21000000,
      "ath": {
        "usd": 69000.00
      },
      "ath_change_percentage": {
        "usd": -34.78
      },
      "ath_date": {
        "usd": "2021-11-10T14:24:11.849Z"
      },
      "atl": {
        "usd": 67.81
      },
      "atl_change_percentage": {
        "usd": 66000.00
      },
      "atl_date": {
        "usd": "2013-07-06T00:00:00.000Z"
      }
    },
    "last_updated": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Cryptocurrency with specified symbol not found
- `500 Internal Server Error` - Failed to fetch data

**Error Example (Not Found):**
```json
{
  "success": false,
  "message": "Cryptocurrency with symbol 'xyz' not found"
}
```

---

## Rate Limiting

The API implements caching to minimize external API calls to CoinGecko:
- Top coins: Cached for 60 seconds
- Coin search: Cached for 300 seconds (5 minutes)
- Individual coin details: Cached for 60 seconds per coin

No explicit rate limiting is currently enforced on the API endpoints.

## Error Handling

### Common HTTP Status Codes

| Status Code | Description                                    |
|-------------|------------------------------------------------|
| 200         | Success                                        |
| 404         | Resource not found                             |
| 422         | Unprocessable entity (validation error)        |
| 500         | Internal server error                          |

### Error Response Fields

- `success`: Always `false` for error responses
- `message`: Human-readable error message
- `error`: Detailed error information (only in debug mode)

## Examples

### Using cURL

**Get top cryptocurrencies:**
```bash
curl http://localhost:8000/v1/coins/markets
```

**Search for a cryptocurrency:**
```bash
curl "http://localhost:8000/v1/coins/search?q=ethereum"
```

**Get Bitcoin details:**
```bash
curl http://localhost:8000/v1/coins/btc
```

### Using JavaScript (Fetch API)

```javascript
// Get top cryptocurrencies
fetch('http://localhost:8000/v1/coins/markets')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Search for cryptocurrencies
fetch('http://localhost:8000/v1/coins/search?q=doge')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get coin details
fetch('http://localhost:8000/v1/coins/eth')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## Data Source

All cryptocurrency data is sourced from [CoinGecko API](https://www.coingecko.com/en/api) (free tier).

## Notes

- All prices are in USD
- Timestamps are in ISO 8601 format (UTC)
- Symbol matching is case-insensitive (BTC, btc, Btc all work)
- Search is performed on both name and symbol fields
- The API returns the first matching coin when multiple coins share the same symbol
