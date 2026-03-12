<?php

use App\Http\Controllers\Operator\DashboardController;
use App\Http\Controllers\Operator\RentalController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('rentals', [RentalController::class, 'index'])->name('rentals.index');
Route::get('rentals/{rental}', [RentalController::class, 'show'])->name('rentals.show');
Route::put('rentals/{rental}/status', [RentalController::class, 'updateStatus'])->name('rentals.update-status');
