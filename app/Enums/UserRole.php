<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Customer = 'customer';
    case Operator = 'operator';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Customer => 'Customer',
            self::Operator => 'Operator',
        };
    }
}
