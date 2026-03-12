<?php

namespace App\Models;

use App\Enums\EquipmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'equipment';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'daily_rate',
        'weekly_rate',
        'monthly_rate',
        'deposit_amount',
        'quantity',
        'status',
        'specifications',
        'features',
        'is_featured',
        'requires_operator',
        'min_rental_days',
        'max_rental_days',
    ];

    protected function casts(): array
    {
        return [
            'daily_rate' => 'decimal:2',
            'weekly_rate' => 'decimal:2',
            'monthly_rate' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'quantity' => 'integer',
            'status' => EquipmentStatus::class,
            'specifications' => 'array',
            'features' => 'array',
            'is_featured' => 'boolean',
            'requires_operator' => 'boolean',
            'min_rental_days' => 'integer',
            'max_rental_days' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EquipmentCategory::class, 'category_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(EquipmentImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(EquipmentImage::class)->where('is_primary', true);
    }

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', EquipmentStatus::Active);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
}
