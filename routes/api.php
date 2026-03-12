<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\RentalController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('equipment', [EquipmentController::class, 'index']);
    Route::get('equipment/{equipment}', [EquipmentController::class, 'show']);
    Route::get('categories', [CategoryController::class, 'index']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('rentals', RentalController::class)->only(['index', 'show', 'store']);
    });
});
