<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@rentatool.com',
            'role' => UserRole::Admin,
        ]);

        User::factory()->create([
            'name' => 'John Operator',
            'email' => 'operator@rentatool.com',
            'role' => UserRole::Operator,
        ]);

        User::factory()->create([
            'name' => 'Jane Customer',
            'email' => 'customer@rentatool.com',
            'role' => UserRole::Customer,
            'phone' => '+1 555-0123',
            'company_name' => 'BuildRight Construction',
        ]);

        $this->call([
            CategorySeeder::class,
            EquipmentSeeder::class,
        ]);
    }
}
