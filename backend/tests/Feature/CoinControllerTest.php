<?php

namespace Tests\Feature;

use App\Domain\CoinGecko\CoinGeckoService;
use Illuminate\Foundation\Testing\TestCase;
use PHPUnit\Framework\MockObject\MockObject;

class CoinControllerTest extends TestCase
{
    /**
     * The mocked CoinGecko service.
     */
    protected CoinGeckoService|MockObject $coinGeckoServiceMock;

    /**
     * Set up the test case.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Mock the CoinGeckoService
        $this->coinGeckoServiceMock = $this->createMock(CoinGeckoService::class);
        $this->app->instance(CoinGeckoService::class, $this->coinGeckoServiceMock);
    }

    /**
     * Test that the top coins endpoint returns the top 10 cryptocurrencies.
     */
    public function test_top_coins_endpoint_returns_top_10_coins(): void
    {
        // Mock the response
        $mockCoins = [
            [
                'id' => 'bitcoin',
                'name' => 'Bitcoin',
                'symbol' => 'btc',
                'current_price' => 45000.50,
                'market_cap' => 880000000000,
                'market_cap_rank' => 1,
                'total_volume' => 25000000000,
            ],
            [
                'id' => 'ethereum',
                'name' => 'Ethereum',
                'symbol' => 'eth',
                'current_price' => 2500.75,
                'market_cap' => 300000000000,
                'market_cap_rank' => 2,
                'total_volume' => 15000000000,
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoins')
            ->with($this->callback(function (array $params) {
                return $params['order'] === 'market_cap_desc'
                    && $params['per_page'] === 10;
            }))
            ->willReturn($mockCoins);

        $response = $this->get('/api/v1/coins/top');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'count' => 2,
        ]);
        $response->assertJsonPath('data.0.symbol', 'btc');
        $response->assertJsonPath('data.1.symbol', 'eth');
    }

    /**
     * Test that search endpoint with valid query returns matching coins.
     */
    public function test_search_endpoint_with_valid_query_returns_matching_coins(): void
    {
        $mockCoins = [
            [
                'id' => 'bitcoin',
                'name' => 'Bitcoin',
                'symbol' => 'btc',
                'current_price' => 45000.50,
            ],
            [
                'id' => 'bitcoin-cash',
                'name' => 'Bitcoin Cash',
                'symbol' => 'bch',
                'current_price' => 450.75,
            ],
            [
                'id' => 'ethereum',
                'name' => 'Ethereum',
                'symbol' => 'eth',
                'current_price' => 2500.75,
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoins')
            ->willReturn($mockCoins);

        $response = $this->get('/api/v1/coins/search?q=bitcoin');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'query' => 'bitcoin',
        ]);
        $response->assertJsonCount(2, 'data'); // Bitcoin and Bitcoin Cash
        $response->assertJsonPath('data.0.symbol', 'btc');
        $response->assertJsonPath('data.1.symbol', 'bch');
    }

    /**
     * Test that search endpoint without query parameter returns error.
     */
    public function test_search_endpoint_without_query_parameter_returns_422(): void
    {
        $response = $this->get('/api/v1/coins/search');

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Search query parameter "q" is required',
        ]);
    }

    /**
     * Test that search endpoint with empty query returns error.
     */
    public function test_search_endpoint_with_empty_query_returns_422(): void
    {
        $response = $this->get('/api/v1/coins/search?q=');

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Search query parameter "q" is required',
        ]);
    }

    /**
     * Test that search endpoint is case-insensitive.
     */
    public function test_search_endpoint_is_case_insensitive(): void
    {
        $mockCoins = [
            [
                'id' => 'bitcoin',
                'name' => 'Bitcoin',
                'symbol' => 'btc',
            ],
            [
                'id' => 'ethereum',
                'name' => 'Ethereum',
                'symbol' => 'eth',
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoins')
            ->willReturn($mockCoins);

        $response = $this->get('/api/v1/coins/search?q=BITCOIN');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.symbol', 'btc');
    }

    /**
     * Test that show endpoint returns coin details by symbol.
     */
    public function test_show_endpoint_returns_coin_details_by_symbol(): void
    {
        $mockCoins = [
            [
                'id' => 'bitcoin',
                'symbol' => 'btc',
                'name' => 'Bitcoin',
            ],
            [
                'id' => 'ethereum',
                'symbol' => 'eth',
                'name' => 'Ethereum',
            ],
        ];

        $mockCoinDetails = [
            'id' => 'bitcoin',
            'symbol' => 'btc',
            'name' => 'Bitcoin',
            'market_data' => [
                'current_price' => ['usd' => 45000.50],
                'market_cap' => ['usd' => 880000000000],
                'total_volume' => ['usd' => 25000000000],
                'high_24h' => ['usd' => 46000],
                'low_24h' => ['usd' => 44000],
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->atLeast(1))
            ->method('getCoins')
            ->willReturn($mockCoins);

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoinById')
            ->with('bitcoin', $this->callback(function (array $params) {
                return $params['market_data'] === true;
            }))
            ->willReturn($mockCoinDetails);

        $response = $this->get('/api/v1/coins/btc');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => 'bitcoin',
                'symbol' => 'btc',
                'name' => 'Bitcoin',
            ],
        ]);
        $response->assertJsonPath('data.market_data.current_price.usd', 45000.50);
    }

    /**
     * Test that show endpoint returns 404 for non-existent symbol.
     */
    public function test_show_endpoint_returns_404_for_non_existent_symbol(): void
    {
        $mockCoins = [
            [
                'id' => 'bitcoin',
                'symbol' => 'btc',
                'name' => 'Bitcoin',
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoins')
            ->willReturn($mockCoins);

        $response = $this->get('/api/v1/coins/xyz');

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => "Cryptocurrency with symbol 'xyz' not found",
        ]);
    }

    /**
     * Test that show endpoint is case-insensitive for symbol.
     */
    public function test_show_endpoint_is_case_insensitive_for_symbol(): void
    {
        $mockCoins = [
            [
                'id' => 'bitcoin',
                'symbol' => 'btc',
                'name' => 'Bitcoin',
            ],
        ];

        $mockCoinDetails = [
            'id' => 'bitcoin',
            'symbol' => 'btc',
            'name' => 'Bitcoin',
            'market_data' => [
                'current_price' => ['usd' => 45000.50],
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->atLeast(1))
            ->method('getCoins')
            ->willReturn($mockCoins);

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoinById')
            ->willReturn($mockCoinDetails);

        $response = $this->get('/api/v1/coins/BTC');

        $response->assertStatus(200);
        $response->assertJsonPath('data.symbol', 'btc');
    }

    /**
     * Test that top endpoint returns 500 on service error.
     */
    public function test_top_endpoint_returns_500_on_service_error(): void
    {
        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoins')
            ->willThrowException(new \Exception('API error'));

        $response = $this->get('/api/v1/coins/top');

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
            'message' => 'Failed to fetch top coins',
        ]);
    }

    /**
     * Test that search endpoint returns 500 on service error.
     */
    public function test_search_endpoint_returns_500_on_service_error(): void
    {
        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoins')
            ->willThrowException(new \Exception('API error'));

        $response = $this->get('/api/v1/coins/search?q=bitcoin');

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
            'message' => 'Failed to search coins',
        ]);
    }

    /**
     * Test that show endpoint returns 500 on service error during coin details fetch.
     */
    public function test_show_endpoint_returns_500_on_service_error(): void
    {
        $mockCoins = [
            [
                'id' => 'bitcoin',
                'symbol' => 'btc',
                'name' => 'Bitcoin',
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->atLeast(1))
            ->method('getCoins')
            ->willReturn($mockCoins);

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoinById')
            ->willThrowException(new \Exception('API error'));

        $response = $this->get('/api/v1/coins/btc');

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
            'message' => 'Failed to fetch coin details',
        ]);
    }

    /**
     * Test that search endpoint filters by both name and symbol.
     */
    public function test_search_endpoint_filters_by_both_name_and_symbol(): void
    {
        $mockCoins = [
            [
                'id' => 'ethereum',
                'name' => 'Ethereum',
                'symbol' => 'eth',
            ],
            [
                'id' => 'ethereum-classic',
                'name' => 'Ethereum Classic',
                'symbol' => 'etc',
            ],
            [
                'id' => 'ether-token',
                'name' => 'Ether Token',
                'symbol' => 'et',
            ],
        ];

        $this->coinGeckoServiceMock
            ->expects($this->once())
            ->method('getCoins')
            ->willReturn($mockCoins);

        $response = $this->get('/api/v1/coins/search?q=eth');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data'); // All match "eth" in name or symbol
    }
}
