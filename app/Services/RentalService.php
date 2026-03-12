<?php

namespace App\Services;

use App\Enums\RentalStatus;
use App\Models\Equipment;
use App\Models\Rental;
use App\Models\RentalStatusHistory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;

class RentalService
{
    public function __construct(
        private EquipmentAvailabilityService $availabilityService,
    ) {}

    public function calculatePrice(Equipment $equipment, Carbon $startDate, Carbon $endDate, int $quantity = 1): array
    {
        $days = $startDate->diffInDays($endDate);
        $weeks = floor($days / 7);
        $remainingDays = $days % 7;

        $dailyRate = (float) $equipment->daily_rate;
        $weeklyRate = $equipment->weekly_rate ? (float) $equipment->weekly_rate : $dailyRate * 7;
        $monthlyRate = $equipment->monthly_rate ? (float) $equipment->monthly_rate : $dailyRate * 30;

        if ($days >= 30 && $monthlyRate) {
            $months = floor($days / 30);
            $remainingAfterMonths = $days % 30;
            $subtotal = ($months * $monthlyRate) + ($remainingAfterMonths * $dailyRate);
        } elseif ($weeks >= 1 && $weeklyRate) {
            $subtotal = ($weeks * $weeklyRate) + ($remainingDays * $dailyRate);
        } else {
            $subtotal = $days * $dailyRate;
        }

        $subtotal *= $quantity;
        $deposit = (float) $equipment->deposit_amount * $quantity;

        return [
            'days' => $days,
            'daily_rate' => $dailyRate,
            'subtotal' => round($subtotal, 2),
            'deposit' => round($deposit, 2),
            'total' => round($subtotal, 2),
        ];
    }

    public function createRental(User $customer, Equipment $equipment, array $data): Rental
    {
        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);
        $quantity = $data['quantity'] ?? 1;

        if (! $this->availabilityService->isAvailable($equipment, $startDate, $endDate, $quantity)) {
            throw new \RuntimeException('Equipment is not available for the selected dates.');
        }

        $pricing = $this->calculatePrice($equipment, $startDate, $endDate, $quantity);

        $rental = Rental::create([
            'rental_number' => $this->generateRentalNumber(),
            'customer_id' => $customer->id,
            'equipment_id' => $equipment->id,
            'quantity' => $quantity,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'daily_rate_snapshot' => $pricing['daily_rate'],
            'total_price' => $pricing['total'],
            'deposit_amount' => $pricing['deposit'],
            'status' => RentalStatus::Pending,
            'notes' => $data['notes'] ?? null,
            'delivery_address' => $data['delivery_address'] ?? null,
        ]);

        RentalStatusHistory::create([
            'rental_id' => $rental->id,
            'from_status' => null,
            'to_status' => RentalStatus::Pending,
            'changed_by' => $customer->id,
            'notes' => 'Rental request submitted.',
        ]);

        return $rental;
    }

    public function updateStatus(Rental $rental, RentalStatus $newStatus, User $changedBy, ?string $notes = null): Rental
    {
        $oldStatus = $rental->status;

        $rental->update(['status' => $newStatus]);

        if ($newStatus === RentalStatus::Cancelled) {
            $rental->update([
                'cancelled_at' => now(),
                'cancellation_reason' => $notes,
            ]);
        }

        RentalStatusHistory::create([
            'rental_id' => $rental->id,
            'from_status' => $oldStatus,
            'to_status' => $newStatus,
            'changed_by' => $changedBy->id,
            'notes' => $notes,
        ]);

        return $rental->fresh();
    }

    private function generateRentalNumber(): string
    {
        $year = now()->year;
        $lastRental = Rental::withTrashed()
            ->where('rental_number', 'like', "RNT-{$year}-%")
            ->orderByDesc('id')
            ->first();

        if ($lastRental) {
            $lastNumber = (int) Str::afterLast($lastRental->rental_number, '-');
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('RNT-%d-%05d', $year, $nextNumber);
    }
}
