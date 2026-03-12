<?php

namespace App\Enums;

enum EquipmentStatus: string
{
    case Active = 'active';
    case Maintenance = 'maintenance';
    case Retired = 'retired';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Maintenance => 'Under Maintenance',
            self::Retired => 'Retired',
        };
    }
}
