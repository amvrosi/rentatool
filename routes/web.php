<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Customer;
use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Operator;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/equipment', [EquipmentController::class, 'index'])->name('equipment.index');
Route::get('/equipment/{slug}', [EquipmentController::class, 'show'])->name('equipment.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardRedirectController::class)->name('dashboard');

    // Booking
    Route::get('/booking/{equipment}', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/{rental}/confirmation', [BookingController::class, 'confirmation'])->name('booking.confirmation');

    // Customer
    Route::prefix('my')->name('customer.')->group(function () {
        Route::get('/dashboard', [Customer\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/rentals', [Customer\RentalController::class, 'index'])->name('rentals.index');
        Route::get('/rentals/{rental}', [Customer\RentalController::class, 'show'])->name('rentals.show');
        Route::post('/rentals/{rental}/cancel', [Customer\RentalController::class, 'cancel'])->name('rentals.cancel');
    });

    // Admin Routes
    Route::prefix('admin')->name('admin.')->middleware('auth', 'verified')->group(function () {
        Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('equipment', Admin\EquipmentController::class);
        Route::resource('categories', Admin\CategoryController::class)->except(['show']);
        Route::get('/rentals', [Admin\RentalController::class, 'index'])->name('rentals.index');
        Route::get('/rentals/{rental}', [Admin\RentalController::class, 'show'])->name('rentals.show');
        Route::put('/rentals/{rental}/status', [Admin\RentalController::class, 'updateStatus'])->name('rentals.update-status');
        Route::put('/rentals/{rental}/assign', [Admin\RentalController::class, 'assignOperator'])->name('rentals.assign');
        Route::get('/users', [Admin\UserController::class, 'index'])->name('users.index');
    });

    // Operator Routes
    Route::prefix('operator')->name('operator.')->middleware('auth', 'verified')->group(function () {
        Route::get('/dashboard', [Operator\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/rentals', [Operator\RentalController::class, 'index'])->name('rentals.index');
        Route::get('/rentals/{rental}', [Operator\RentalController::class, 'show'])->name('rentals.show');
        Route::put('/rentals/{rental}/status', [Operator\RentalController::class, 'updateStatus'])->name('rentals.update-status');
    });
});

require __DIR__.'/settings.php';
