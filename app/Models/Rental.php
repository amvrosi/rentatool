<?php

namespace App\Models;

use App\Enums\RentalStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rental extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'rental_number',
        'customer_id',
        'equipment_id',
        'operator_id',
        'quantity',
        'start_date',
        'end_date',
        'actual_return_date',
        'daily_rate_snapshot',
        'total_price',
        'deposit_amount',
        'status',
        'notes',
        'admin_notes',
        'delivery_address',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'actual_return_date' => 'date',
            'daily_rate_snapshot' => 'decimal:2',
            'total_price' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'status' => RentalStatus::class,
            'cancelled_at' => 'datetime',
            'quantity' => 'integer',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(RentalStatusHistory::class)->orderBy('created_at', 'desc');
    }

    public function getDurationDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date);
    }

    public function scopeByStatus($query, RentalStatus $status)
    {
        return $query->where('status', $status);
    }

    public function scopeActive($query)
    {
        return $query->where('status', RentalStatus::Active);
    }

    public function scopeUpcoming($query)
    {
        return $query->whereIn('status', [RentalStatus::Pending, RentalStatus::Confirmed])
            ->where('start_date', '>=', now());
    }
}
