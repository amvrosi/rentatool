<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\RentalResource;
use App\Models\Equipment;
use App\Models\Rental;
use App\Services\RentalService;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    public function __construct(private RentalService $rentalService) {}

    public function index(Request $request)
    {
        $rentals = $request->user()->rentals()
            ->with(['equipment.primaryImage'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return RentalResource::collection($rentals);
    }

    public function show(Rental $rental)
    {
        abort_if($rental->customer_id !== auth()->id(), 403);

        $rental->load(['equipment.category', 'equipment.images', 'operator', 'statusHistory']);

        return new RentalResource($rental);
    }

    public function store(StoreBookingRequest $request)
    {
        $equipment = Equipment::findOrFail($request->equipment_id);

        $rental = $this->rentalService->createRental(
            $request->user(),
            $equipment,
            $request->validated(),
        );

        return new RentalResource($rental->load('equipment'));
    }
}
