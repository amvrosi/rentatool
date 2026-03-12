<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Enums\RentalStatus;
use App\Enums\UserRole;
use App\Models\Rental;
use App\Models\User;
use App\Services\RentalService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RentalController extends Controller
{
    public function __construct(private RentalService $rentalService) {}

    public function index(Request $request)
    {
        $query = Rental::with(['customer', 'equipment', 'operator']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $rentals = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('admin/rentals/index', [
            'rentals' => $rentals,
            'filters' => $request->only(['status']),
            'statuses' => array_map(fn ($s) => ['value' => $s->value, 'label' => $s->label()], RentalStatus::cases()),
        ]);
    }

    public function show(Rental $rental)
    {
        $rental->load(['customer', 'equipment.images', 'operator', 'statusHistory.user']);
        $operators = User::where('role', UserRole::Operator)->get(['id', 'name']);

        return Inertia::render('admin/rentals/show', [
            'rental' => $rental,
            'operators' => $operators,
            'statuses' => array_map(fn ($s) => ['value' => $s->value, 'label' => $s->label()], RentalStatus::cases()),
        ]);
    }

    public function update(Request $request, Rental $rental)
    {
        $data = $request->validate([
            'status' => ['nullable', 'string'],
            'operator_id' => ['nullable', 'exists:users,id'],
            'admin_notes' => ['nullable', 'string'],
        ]);

        if (isset($data['operator_id'])) {
            $rental->update(['operator_id' => $data['operator_id']]);
        }

        if (isset($data['admin_notes'])) {
            $rental->update(['admin_notes' => $data['admin_notes']]);
        }

        if (isset($data['status'])) {
            $this->rentalService->updateStatus(
                $rental,
                RentalStatus::from($data['status']),
                $request->user(),
                $data['admin_notes'] ?? null,
            );
        }

        return redirect()->route('admin.rentals.show', $rental)
            ->with('success', 'Rental updated successfully.');
    }
}
