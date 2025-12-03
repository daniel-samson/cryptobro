<?php

use App\Domain\CoinGecko\CoinController;
use Illuminate\Support\Facades\Route;

Route::prefix("v1")
    ->middleware(["throttle:api"])
    ->group(function () {
        // Health check endpoint (higher rate limit)
        Route::get("/health", function () {
            return response()->json([
                "status" => "ok",
                "timestamp" => now(),
            ]);
        })->withoutMiddleware(["throttle:api"]);

        // Coin endpoints
        Route::prefix("coins")->group(function () {
            Route::get("/markets", [CoinController::class, "markets"]);
            Route::get("/search", [CoinController::class, "search"]);
            Route::get("/{symbol}", [CoinController::class, "show"]);
        });
    });
