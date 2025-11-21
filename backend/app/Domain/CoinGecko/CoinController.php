<?php

namespace App\Domain\CoinGecko;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CoinController extends Controller
{
    /**
     * The CoinGecko service instance.
     */
    protected CoinGeckoService $coinGeckoService;

    /**
     * Create a new controller instance.
     */
    public function __construct(CoinGeckoService $coinGeckoService)
    {
        $this->coinGeckoService = $coinGeckoService;
    }

    /**
     * Get the top 10 cryptocurrencies by market cap.
     */
    public function markets(): JsonResponse
    {
        try {
            // Cache top 10 coins for 1 minute
            $coins = \Illuminate\Support\Facades\Cache::remember('coingecko_top_10', 60, function () {
                return $this->coinGeckoService->getCoins([
                    'vs_currency' => 'usd',
                    'order' => 'market_cap_desc',
                    'per_page' => 10,
                    'page' => 1,
                    'sparkline' => false,
                ]);
            });

            return response()->json([
                'success' => true,
                'data' => $coins,
                'count' => count($coins),
            ]);
        } catch (\Exception $exception) {
            Log::error('Failed to fetch top coins', [
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch top coins',
                'error' => config('app.debug') ? $exception->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Search for cryptocurrencies by name or symbol.
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $keyword = $request->query('q');

            if (empty($keyword)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Search query parameter "q" is required',
                    'data' => [],
                ], 422);
            }

            // Get all coins and filter by keyword (use same cache as resolveCoinId)
            $coins = \Illuminate\Support\Facades\Cache::remember('coingecko_coins_list', 300, function () {
                return $this->coinGeckoService->getCoins([
                    'vs_currency' => 'usd',
                    'per_page' => 250,
                    'page' => 1,
                    'sparkline' => false,
                    'order' => 'market_cap_desc',
                ]);
            });

            // Filter coins by name or symbol
            $keyword = strtolower($keyword);
            $filtered = array_filter($coins, function ($coin) use ($keyword) {
                return
                    strpos(strtolower($coin['name'] ?? ''), $keyword) !== false ||
                    strpos(strtolower($coin['symbol'] ?? ''), $keyword) !== false;
            });

            return response()->json([
                'success' => true,
                'data' => array_values($filtered),
                'count' => count($filtered),
                'query' => $keyword,
            ]);
        } catch (\Exception $exception) {
            Log::error('Failed to search coins', [
                'query' => $request->query('q'),
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to search coins',
                'error' => config('app.debug') ? $exception->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get detailed information for a specific cryptocurrency by symbol.
     */
    public function show(string $symbol): JsonResponse
    {
        try {
            $coinId = $this->resolveCoinId($symbol);

            if (! $coinId) {
                return response()->json([
                    'success' => false,
                    'message' => "Cryptocurrency with symbol '{$symbol}' not found",
                ], 404);
            }

            // Cache individual coin data for 1 minute
            $coin = \Illuminate\Support\Facades\Cache::remember("coingecko_coin_{$coinId}", 60, function () use ($coinId) {
                return $this->coinGeckoService->getCoinById($coinId, [
                    'localization' => false,
                    'tickers' => false,
                    'market_data' => true,
                    'community_data' => false,
                    'developer_data' => false,
                ]);
            });

            return response()->json([
                'success' => true,
                'data' => $coin,
            ]);
        } catch (\Exception $exception) {
            Log::error('Failed to fetch coin details', [
                'symbol' => $symbol,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch coin details',
                'error' => config('app.debug') ? $exception->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Resolve a cryptocurrency symbol to its CoinGecko ID.
     */
    protected function resolveCoinId(string $symbol): ?string
    {
        try {
            $symbol = strtolower($symbol);

            // Cache the coins list for 5 minutes to avoid rate limits
            $coins = \Illuminate\Support\Facades\Cache::remember('coingecko_coins_list', 300, function () {
                return $this->coinGeckoService->getCoins([
                    'vs_currency' => 'usd',
                    'per_page' => 250,
                    'page' => 1,
                    'sparkline' => false,
                    'order' => 'market_cap_desc',
                ]);
            });

            foreach ($coins as $coin) {
                if (strtolower($coin['symbol'] ?? '') === $symbol) {
                    return $coin['id'];
                }
            }

            return null;
        } catch (\Exception $exception) {
            Log::error('Failed to resolve coin ID', [
                'symbol' => $symbol,
                'error' => $exception->getMessage(),
            ]);

            return null;
        }
    }
}
