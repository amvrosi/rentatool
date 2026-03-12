<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Enums\RentalStatus;
use App\Models\Rental;
use App\Services\RentalService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RentalController extends Controller
{
    public function __construct(private RentalService $rentalService) {}

    public function index(Request $request)
    {
        $rentals = $request->user()->rentals()
            ->with(['equipment.primaryImage', 'equipment.category'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('customer/rentals/index', [
            'rentals' => $rentals,
        ]);
    }

    public function show(Rental $rental)
    {
        $this->authorize('view', $rental);

        $rental->load(['equipment.category', 'equipment.images', 'operator', 'statusHistory.user']);

        return Inertia::render('customer/rentals/show', [
            'rental' => $rental,
        ]);
    }

    public function cancel(Request $request, Rental $rental)
    {
        $this->authorize('cancel', $rental);

        $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $this->rentalService->updateStatus(
            $rental,
            RentalStatus::Cancelled,
            $request->user(),
            $request->reason,
        );

        return redirect()->route('customer.rentals.index')
            ->with('success', 'Rental has been cancelled.');
    }
}
