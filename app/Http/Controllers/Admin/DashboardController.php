<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Enums\RentalStatus;
use App\Models\Equipment;
use App\Models\Rental;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_equipment' => Equipment::count(),
            'active_rentals' => Rental::whereIn('status', [RentalStatus::Active, RentalStatus::Confirmed])->count(),
            'pending_rentals' => Rental::where('status', RentalStatus::Pending)->count(),
            'total_revenue' => Rental::whereIn('status', [RentalStatus::Active, RentalStatus::Completed])->sum('total_price'),
            'total_customers' => User::where('role', 'customer')->count(),
        ];

        $recentRentals = Rental::with(['customer', 'equipment'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentRentals' => $recentRentals,
        ]);
    }
}
