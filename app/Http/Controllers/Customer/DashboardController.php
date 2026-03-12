<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Enums\RentalStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $activeRentals = $user->rentals()
            ->with(['equipment.primaryImage'])
            ->whereIn('status', [RentalStatus::Pending, RentalStatus::Confirmed, RentalStatus::Active])
            ->orderBy('start_date')
            ->get();

        $stats = [
            'total_rentals' => $user->rentals()->count(),
            'active_rentals' => $user->rentals()->whereIn('status', [RentalStatus::Active, RentalStatus::Confirmed])->count(),
            'total_spent' => $user->rentals()->where('status', '!=', RentalStatus::Cancelled)->sum('total_price'),
        ];

        return Inertia::render('customer/dashboard', [
            'activeRentals' => $activeRentals,
            'stats' => $stats,
        ]);
    }
}
