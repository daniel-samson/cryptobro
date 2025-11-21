<?php

namespace App\Domain\CoinGecko;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CoinGeckoService
{
    /**
     * The base URL for the CoinGecko API.
     */
    protected string $endpoint;

    /**
     * The API key for CoinGecko Pro tier access.
     */
    protected ?string $apiKey;

    /**
     * The timeout duration for HTTP requests in seconds.
     */
    protected int $timeout;

    /**
     * Create a new CoinGecko service instance.
     */
    public function __construct()
    {
        $this->endpoint = config('coingecko.endpoint');
        $this->apiKey = config('coingecko.api_key');
        $this->timeout = config('coingecko.timeout', 30);
    }

    /**
     * Get a list of all supported coins with market data.
     *
     * @param  array  $options  Query parameters (pagination, order, etc.)
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    public function getCoins(array $options = []): array
    {
        return $this->get('/coins/markets', $options);
    }

    /**
     * Get cryptocurrency data by ID.
     *
     * @param  string  $id  The cryptocurrency ID
     * @param  array  $options  Query parameters
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    public function getCoinById(string $id, array $options = []): array
    {
        return $this->get("/coins/{$id}", $options);
    }

    /**
     * Get simple price data for one or more cryptocurrencies.
     *
     * @param  array  $ids  Array of cryptocurrency IDs
     * @param  array  $vsCurrencies  Array of target currencies (e.g., ['usd', 'eur'])
     * @param  array  $options  Additional query parameters
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    public function getSimplePrice(array $ids, array $vsCurrencies = ['usd'], array $options = []): array
    {
        $params = array_merge($options, [
            'ids' => implode(',', $ids),
            'vs_currencies' => implode(',', $vsCurrencies),
        ]);

        return $this->get('/simple/price', $params);
    }

    /**
     * Get the current price of a single cryptocurrency.
     *
     * @param  string  $id  The cryptocurrency ID
     * @param  string  $vsCurrency  The target currency code (default: 'usd')
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    public function getPriceById(string $id, string $vsCurrency = 'usd'): array
    {
        return $this->getSimplePrice([$id], [$vsCurrency]);
    }

    /**
     * Get trending coins.
     *
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    public function getTrendingCoins(): array
    {
        return $this->get('/search/trending');
    }

    /**
     * Get global cryptocurrency market data.
     *
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    public function getGlobal(): array
    {
        return $this->get('/global');
    }

    /**
     * Make a GET request to the CoinGecko API.
     *
     * @param  string  $endpoint  The API endpoint
     * @param  array  $params  Query parameters
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    protected function get(string $endpoint, array $params = []): array
    {
        try {
            $request = Http::timeout($this->timeout);

            // Add API key to headers if using pro tier
            if ($this->apiKey) {
                $request = $request->withHeaders([
                    'x-cg-pro-api-key' => $this->apiKey,
                ]);
            }

            $response = $request->get($this->endpoint.ltrim($endpoint, '/'), $params);

            return $this->handleResponse($response, $endpoint);
        } catch (\Exception $exception) {
            Log::error('CoinGecko API request failed', [
                'endpoint' => $endpoint,
                'params' => $params,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    /**
     * Handle the API response.
     *
     *
     * @throws \Illuminate\Http\Client\RequestException
     */
    protected function handleResponse(Response $response, string $endpoint): array
    {
        if ($response->failed()) {
            Log::warning('CoinGecko API request returned error', [
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            $response->throw();
        }

        return $response->json();
    }
}
