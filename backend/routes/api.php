<?php

use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Placeholder for future API endpoints
    // Example route structure for cryptocurrency data:
    // Route::get('/coins', [CoinController::class, 'index']);
    // Route::get('/coins/{id}', [CoinController::class, 'show']);

    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now(),
        ]);
    });
});
