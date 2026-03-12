<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EquipmentController;
use App\Http\Controllers\Admin\RentalController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('equipment', EquipmentController::class);
Route::resource('categories', CategoryController::class)->except(['show']);

Route::get('rentals', [RentalController::class, 'index'])->name('rentals.index');
Route::get('rentals/{rental}', [RentalController::class, 'show'])->name('rentals.show');
Route::put('rentals/{rental}', [RentalController::class, 'update'])->name('rentals.update');

Route::get('users', [UserController::class, 'index'])->name('users.index');
Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
