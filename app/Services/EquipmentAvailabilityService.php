<?php

namespace App\Services;

use App\Enums\RentalStatus;
use App\Models\Equipment;
use App\Models\Rental;
use Carbon\Carbon;

class EquipmentAvailabilityService
{
    public function getAvailableQuantity(Equipment $equipment, Carbon $startDate, Carbon $endDate, ?int $excludeRentalId = null): int
    {
        $query = Rental::where('equipment_id', $equipment->id)
            ->whereIn('status', [
                RentalStatus::Pending,
                RentalStatus::Confirmed,
                RentalStatus::Active,
            ])
            ->where(function ($q) use ($startDate, $endDate) {
                $q->where(function ($q2) use ($startDate, $endDate) {
                    $q2->where('start_date', '<=', $endDate)
                        ->where('end_date', '>=', $startDate);
                });
            });

        if ($excludeRentalId) {
            $query->where('id', '!=', $excludeRentalId);
        }

        $rentedQuantity = $query->sum('quantity');

        return max(0, $equipment->quantity - $rentedQuantity);
    }

    public function isAvailable(Equipment $equipment, Carbon $startDate, Carbon $endDate, int $quantity = 1): bool
    {
        return $this->getAvailableQuantity($equipment, $startDate, $endDate) >= $quantity;
    }
}
