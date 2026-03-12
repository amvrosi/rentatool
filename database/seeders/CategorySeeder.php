<?php

namespace Database\Seeders;

use App\Models\EquipmentCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Heavy Machinery', 'icon' => 'Truck', 'description' => 'Excavators, bulldozers, cranes, and other heavy construction equipment.', 'sort_order' => 1],
            ['name' => 'Power Tools', 'icon' => 'Zap', 'description' => 'Electric and battery-powered tools for cutting, drilling, and fastening.', 'sort_order' => 2],
            ['name' => 'Hand Tools', 'icon' => 'Hammer', 'description' => 'Manual tools including hammers, wrenches, pliers, and more.', 'sort_order' => 3],
            ['name' => 'Containers & Storage', 'icon' => 'Container', 'description' => 'Shipping containers, storage units, and portable cabins.', 'sort_order' => 4],
            ['name' => 'Lifting Equipment', 'icon' => 'ArrowUpFromLine', 'description' => 'Forklifts, hoists, jacks, and lifting accessories.', 'sort_order' => 5],
            ['name' => 'Concrete & Masonry', 'icon' => 'Layers', 'description' => 'Concrete mixers, vibrators, trowels, and masonry tools.', 'sort_order' => 6],
            ['name' => 'Safety Equipment', 'icon' => 'ShieldCheck', 'description' => 'Personal protective equipment, barriers, and safety signage.', 'sort_order' => 7],
            ['name' => 'Generators & Lighting', 'icon' => 'Lightbulb', 'description' => 'Portable generators, floodlights, and temporary power solutions.', 'sort_order' => 8],
        ];

        foreach ($categories as $category) {
            EquipmentCategory::create([
                ...$category,
                'slug' => Str::slug($category['name']),
                'is_active' => true,
            ]);
        }
    }
}
