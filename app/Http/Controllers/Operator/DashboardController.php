<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Enums\RentalStatus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $assignedRentals = $user->assignedRentals()
            ->with(['customer', 'equipment.primaryImage'])
            ->whereIn('status', [RentalStatus::Confirmed, RentalStatus::Active])
            ->orderBy('start_date')
            ->get();

        $completedCount = $user->assignedRentals()
            ->where('status', RentalStatus::Completed)
            ->count();

        return Inertia::render('operator/dashboard', [
            'assignedRentals' => $assignedRentals,
            'completedCount' => $completedCount,
        ]);
    }
}
