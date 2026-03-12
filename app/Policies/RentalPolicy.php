<?php

namespace App\Policies;

use App\Enums\RentalStatus;
use App\Models\Rental;
use App\Models\User;

class RentalPolicy
{
    public function view(User $user, Rental $rental): bool
    {
        return $user->id === $rental->customer_id
            || $user->id === $rental->operator_id
            || $user->isAdmin();
    }

    public function cancel(User $user, Rental $rental): bool
    {
        return $user->id === $rental->customer_id
            && in_array($rental->status, [RentalStatus::Pending, RentalStatus::Confirmed]);
    }
}
