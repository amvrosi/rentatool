<?php

namespace App\Http\Requests\Admin;

use App\Enums\EquipmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $equipmentId = $this->route('equipment');

        return [
            'category_id' => ['required', 'exists:equipment_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('equipment', 'slug')->ignore($equipmentId)],
            'description' => ['required', 'string'],
            'short_description' => ['nullable', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', Rule::unique('equipment', 'sku')->ignore($equipmentId)],
            'daily_rate' => ['required', 'numeric', 'min:0'],
            'weekly_rate' => ['nullable', 'numeric', 'min:0'],
            'monthly_rate' => ['nullable', 'numeric', 'min:0'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:1'],
            'status' => ['nullable', Rule::enum(EquipmentStatus::class)],
            'specifications' => ['nullable', 'array'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string'],
            'is_featured' => ['boolean'],
            'requires_operator' => ['boolean'],
            'min_rental_days' => ['integer', 'min:1'],
            'max_rental_days' => ['nullable', 'integer', 'min:1'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:5120'],
            'remove_images' => ['nullable', 'array'],
            'remove_images.*' => ['integer', 'exists:equipment_images,id'],
        ];
    }
}
