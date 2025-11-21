<?php

namespace App\Domain\CoinGecko;

use Illuminate\Database\Eloquent\Model;

/**
 * Coin Model
 *
 * This model represents cryptocurrency data retrieved from the CoinGecko API.
 * Note: This is primarily used for type hinting and API responses.
 * Actual data is fetched from CoinGecko API, not stored in the database.
 */
class Coin extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'symbol',
        'name',
        'current_price',
        'market_cap',
        'market_cap_rank',
        'total_volume',
        'high_24h',
        'low_24h',
        'price_change_24h',
        'price_change_percentage_24h',
        'circulating_supply',
        'total_supply',
        'ath',
        'atl',
        'image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'current_price' => 'decimal:8',
        'market_cap' => 'decimal:2',
        'total_volume' => 'decimal:2',
        'high_24h' => 'decimal:8',
        'low_24h' => 'decimal:8',
        'price_change_24h' => 'decimal:8',
        'price_change_percentage_24h' => 'decimal:2',
        'circulating_supply' => 'decimal:2',
        'total_supply' => 'decimal:2',
        'ath' => 'decimal:8',
        'atl' => 'decimal:8',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
}
