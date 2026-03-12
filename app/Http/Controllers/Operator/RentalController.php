<?php

namespace App\Http\Controllers\Operator;

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
        $user = $request->user();

        $query = $user->assignedRentals()
            ->with(['customer', 'equipment.primaryImage']);

        if ($request->filled('status')) {
            $query->where('status', RentalStatus::from($request->status));
        }

        $rentals = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('operator/rentals/index', [
            'rentals' => $rentals,
            'filters' => $request->only(['status']),
        ]);
    }

    public function show(Rental $rental)
    {
        abort_if($rental->operator_id !== auth()->id(), 403);

        $rental->load(['customer', 'equipment.images', 'statusHistory.user']);

        return Inertia::render('operator/rentals/show', [
            'rental' => $rental,
        ]);
    }

    public function updateStatus(Request $request, Rental $rental)
    {
        abort_if($rental->operator_id !== auth()->id(), 403);

        $data = $request->validate([
            'status' => ['required', 'string', 'in:active,completed'],
            'notes' => ['nullable', 'string'],
        ]);

        $this->rentalService->updateStatus(
            $rental,
            RentalStatus::from($data['status']),
            $request->user(),
            $data['notes'] ?? null,
        );

        return redirect()->route('operator.dashboard')
            ->with('success', 'Rental status updated.');
    }
}
