<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RentalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rental_number' => $this->rental_number,
            'customer_id' => $this->customer_id,
            'equipment_id' => $this->equipment_id,
            'operator_id' => $this->operator_id,
            'quantity' => $this->quantity,
            'start_date' => $this->start_date->toDateString(),
            'end_date' => $this->end_date->toDateString(),
            'actual_return_date' => $this->actual_return_date?->toDateString(),
            'daily_rate_snapshot' => (float) $this->daily_rate_snapshot,
            'total_price' => (float) $this->total_price,
            'deposit_amount' => (float) $this->deposit_amount,
            'status' => $this->status,
            'notes' => $this->notes,
            'admin_notes' => $this->admin_notes,
            'delivery_address' => $this->delivery_address,
            'cancelled_at' => $this->cancelled_at,
            'cancellation_reason' => $this->cancellation_reason,
            'duration_days' => $this->duration_days,
            'customer' => $this->whenLoaded('customer'),
            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
            'operator' => $this->whenLoaded('operator'),
            'status_history' => $this->whenLoaded('statusHistory'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
