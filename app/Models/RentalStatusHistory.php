<?php

namespace App\Models;

use App\Enums\RentalStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalStatusHistory extends Model
{
    protected $table = 'rental_status_history';

    protected $fillable = [
        'rental_id',
        'from_status',
        'to_status',
        'changed_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'from_status' => RentalStatus::class,
            'to_status' => RentalStatus::class,
        ];
    }

    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
