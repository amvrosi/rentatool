<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'sku' => $this->sku,
            'daily_rate' => (float) $this->daily_rate,
            'weekly_rate' => $this->weekly_rate ? (float) $this->weekly_rate : null,
            'monthly_rate' => $this->monthly_rate ? (float) $this->monthly_rate : null,
            'deposit_amount' => (float) $this->deposit_amount,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'specifications' => $this->specifications,
            'features' => $this->features,
            'is_featured' => $this->is_featured,
            'requires_operator' => $this->requires_operator,
            'min_rental_days' => $this->min_rental_days,
            'max_rental_days' => $this->max_rental_days,
            'category' => new EquipmentCategoryResource($this->whenLoaded('category')),
            'images' => EquipmentImageResource::collection($this->whenLoaded('images')),
            'primary_image' => new EquipmentImageResource($this->whenLoaded('primaryImage')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
