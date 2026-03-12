<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'equipment_id' => ['required', 'exists:equipment,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'quantity' => ['integer', 'min:1'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'delivery_address' => ['nullable', 'string', 'max:500'],
        ];
    }
}
