<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Models\Equipment;
use App\Models\Rental;
use App\Services\EquipmentAvailabilityService;
use App\Services\RentalService;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(
        private RentalService $rentalService,
        private EquipmentAvailabilityService $availabilityService,
    ) {}

    public function create(Equipment $equipment)
    {
        $equipment->load(['category', 'images']);

        return Inertia::render('booking/create', [
            'equipment' => $equipment,
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        $equipment = Equipment::findOrFail($request->equipment_id);

        $rental = $this->rentalService->createRental(
            $request->user(),
            $equipment,
            $request->validated(),
        );

        return redirect()->route('booking.confirmation', $rental);
    }

    public function confirmation(Rental $rental)
    {
        $this->authorize('view', $rental);

        $rental->load(['equipment.category', 'equipment.primaryImage']);

        return Inertia::render('booking/confirmation', [
            'rental' => $rental,
        ]);
    }
}
