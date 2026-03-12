<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        $heavyMachinery = EquipmentCategory::where('slug', 'heavy-machinery')->first();
        $powerTools = EquipmentCategory::where('slug', 'power-tools')->first();
        $handTools = EquipmentCategory::where('slug', 'hand-tools')->first();
        $containers = EquipmentCategory::where('slug', 'containers-storage')->first();
        $lifting = EquipmentCategory::where('slug', 'lifting-equipment')->first();
        $concrete = EquipmentCategory::where('slug', 'concrete-masonry')->first();
        $generators = EquipmentCategory::where('slug', 'generators-lighting')->first();

        $items = [
            // Heavy Machinery
            [
                'category_id' => $heavyMachinery->id,
                'name' => 'CAT 320 Excavator',
                'description' => 'The CAT 320 is a powerful hydraulic excavator ideal for digging, trenching, and material handling on construction sites. Features advanced hydraulics and fuel-efficient engine.',
                'short_description' => '20-ton hydraulic excavator for heavy construction work.',
                'sku' => 'HM-EXC-001',
                'daily_rate' => 450.00,
                'weekly_rate' => 2500.00,
                'monthly_rate' => 8500.00,
                'deposit_amount' => 2000.00,
                'quantity' => 3,
                'requires_operator' => true,
                'is_featured' => true,
                'specifications' => ['Weight' => '20,000 kg', 'Engine Power' => '121 kW', 'Bucket Capacity' => '1.19 m3', 'Max Dig Depth' => '6.68 m'],
                'features' => ['GPS tracking', 'Air-conditioned cab', 'Advanced hydraulics', 'Low fuel consumption'],
            ],
            [
                'category_id' => $heavyMachinery->id,
                'name' => 'CAT D6 Bulldozer',
                'description' => 'A versatile bulldozer for grading, spreading, and earthmoving operations. Features enhanced blade control and excellent visibility.',
                'short_description' => 'Medium-size bulldozer for earthmoving and grading.',
                'sku' => 'HM-BUL-001',
                'daily_rate' => 550.00,
                'weekly_rate' => 3000.00,
                'monthly_rate' => 10000.00,
                'deposit_amount' => 2500.00,
                'quantity' => 2,
                'requires_operator' => true,
                'is_featured' => true,
                'specifications' => ['Weight' => '17,700 kg', 'Engine Power' => '149 kW', 'Blade Capacity' => '3.18 m3'],
                'features' => ['Slope Assist', 'VPAT blade', 'Rear camera', 'Auto ripper'],
            ],
            [
                'category_id' => $heavyMachinery->id,
                'name' => 'Liebherr LTM 1100 Crane',
                'description' => 'All-terrain mobile crane with 100-ton lifting capacity. Suitable for building construction, infrastructure projects, and industrial installations.',
                'short_description' => '100-ton all-terrain mobile crane.',
                'sku' => 'HM-CRN-001',
                'daily_rate' => 1200.00,
                'weekly_rate' => 7000.00,
                'monthly_rate' => 24000.00,
                'deposit_amount' => 5000.00,
                'quantity' => 1,
                'requires_operator' => true,
                'is_featured' => true,
                'specifications' => ['Max Lift Capacity' => '100 tons', 'Max Boom Length' => '60 m', 'Engine Power' => '270 kW'],
                'features' => ['All-terrain capability', 'Variable boom length', 'Wind speed sensor', 'Load moment indicator'],
            ],

            // Power Tools
            [
                'category_id' => $powerTools->id,
                'name' => 'Hilti TE 60 Rotary Hammer',
                'description' => 'Professional-grade rotary hammer drill for concrete drilling, chiseling, and demolition work. Excellent power-to-weight ratio.',
                'short_description' => 'Heavy-duty rotary hammer for concrete work.',
                'sku' => 'PT-HAM-001',
                'daily_rate' => 35.00,
                'weekly_rate' => 180.00,
                'monthly_rate' => 550.00,
                'deposit_amount' => 150.00,
                'quantity' => 10,
                'is_featured' => false,
                'specifications' => ['Impact Energy' => '8.5 J', 'Weight' => '5.8 kg', 'Power' => '1,300 W'],
                'features' => ['SDS-max chuck', 'Active vibration reduction', 'Dust removal system'],
            ],
            [
                'category_id' => $powerTools->id,
                'name' => 'Stihl MS 461 Chainsaw',
                'description' => 'Professional chainsaw for demanding forestry and construction cutting tasks. Powerful engine with low emissions and vibration.',
                'short_description' => 'Professional-grade chainsaw for heavy cutting.',
                'sku' => 'PT-CHN-001',
                'daily_rate' => 45.00,
                'weekly_rate' => 220.00,
                'monthly_rate' => 650.00,
                'deposit_amount' => 200.00,
                'quantity' => 5,
                'is_featured' => true,
                'specifications' => ['Engine Power' => '4.4 kW', 'Weight' => '6.4 kg', 'Bar Length' => '50 cm'],
                'features' => ['Anti-vibration system', 'Decompression valve', 'Tool-free fuel cap'],
            ],
            [
                'category_id' => $powerTools->id,
                'name' => 'Makita DGA900 Angle Grinder',
                'description' => 'Cordless 230mm angle grinder with brushless motor. Perfect for cutting metal, concrete, and stone on job sites without power.',
                'short_description' => 'Cordless 230mm angle grinder.',
                'sku' => 'PT-GRD-001',
                'daily_rate' => 25.00,
                'weekly_rate' => 130.00,
                'monthly_rate' => 400.00,
                'deposit_amount' => 100.00,
                'quantity' => 8,
                'specifications' => ['Disc Diameter' => '230 mm', 'No Load Speed' => '6,000 RPM', 'Battery' => '2x 18V LXT'],
                'features' => ['Brushless motor', 'Anti-restart', 'Soft start', 'Active feedback sensing'],
            ],

            // Containers
            [
                'category_id' => $containers->id,
                'name' => '20ft Shipping Container',
                'description' => 'Standard 20-foot steel shipping container for secure on-site storage. Weather-resistant and lockable.',
                'short_description' => 'Standard 20ft steel storage container.',
                'sku' => 'CS-CON-001',
                'daily_rate' => 15.00,
                'weekly_rate' => 80.00,
                'monthly_rate' => 250.00,
                'deposit_amount' => 500.00,
                'quantity' => 15,
                'is_featured' => true,
                'min_rental_days' => 7,
                'specifications' => ['Length' => '6.06 m', 'Width' => '2.44 m', 'Height' => '2.59 m', 'Capacity' => '33.2 m3'],
                'features' => ['Weatherproof', 'Lockable doors', 'Forklift pockets', 'Ventilation'],
            ],
            [
                'category_id' => $containers->id,
                'name' => '40ft Shipping Container',
                'description' => 'Large 40-foot steel shipping container for extensive on-site storage. Double the capacity of a standard 20ft unit.',
                'short_description' => 'Large 40ft steel storage container.',
                'sku' => 'CS-CON-002',
                'daily_rate' => 25.00,
                'weekly_rate' => 140.00,
                'monthly_rate' => 400.00,
                'deposit_amount' => 800.00,
                'quantity' => 8,
                'min_rental_days' => 7,
                'specifications' => ['Length' => '12.19 m', 'Width' => '2.44 m', 'Height' => '2.59 m', 'Capacity' => '67.7 m3'],
                'features' => ['Weatherproof', 'Lockable doors', 'Forklift pockets', 'Stackable'],
            ],

            // Lifting
            [
                'category_id' => $lifting->id,
                'name' => 'Toyota 8FGU25 Forklift',
                'description' => 'Reliable counterbalance forklift for material handling. Features smooth transmission and excellent operator comfort.',
                'short_description' => '2.5-ton capacity forklift.',
                'sku' => 'LE-FRK-001',
                'daily_rate' => 120.00,
                'weekly_rate' => 650.00,
                'monthly_rate' => 2200.00,
                'deposit_amount' => 1000.00,
                'quantity' => 4,
                'requires_operator' => true,
                'specifications' => ['Lift Capacity' => '2,500 kg', 'Max Lift Height' => '4.7 m', 'Fuel' => 'LPG/Gasoline'],
                'features' => ['System of Active Stability', 'Operator presence sensing', 'Automatic parking brake'],
            ],

            // Concrete
            [
                'category_id' => $concrete->id,
                'name' => 'Honda GX390 Concrete Mixer',
                'description' => 'Portable concrete mixer powered by reliable Honda engine. Ideal for small to medium construction projects.',
                'short_description' => '350L portable concrete mixer.',
                'sku' => 'CM-MIX-001',
                'daily_rate' => 55.00,
                'weekly_rate' => 280.00,
                'monthly_rate' => 850.00,
                'deposit_amount' => 300.00,
                'quantity' => 6,
                'specifications' => ['Drum Capacity' => '350 L', 'Engine' => 'Honda GX390', 'Output' => '250 L per batch'],
                'features' => ['Honda engine', 'Towable', 'Easy clean drum', 'Reliable start'],
            ],

            // Generators
            [
                'category_id' => $generators->id,
                'name' => 'Atlas Copco QAS 60 Generator',
                'description' => 'Quiet, fuel-efficient diesel generator for construction site power needs. Suitable for tools, lighting, and temporary installations.',
                'short_description' => '60 kVA diesel generator.',
                'sku' => 'GL-GEN-001',
                'daily_rate' => 85.00,
                'weekly_rate' => 450.00,
                'monthly_rate' => 1500.00,
                'deposit_amount' => 500.00,
                'quantity' => 5,
                'is_featured' => true,
                'specifications' => ['Power Output' => '60 kVA', 'Fuel' => 'Diesel', 'Noise Level' => '67 dBA', 'Tank Capacity' => '165 L'],
                'features' => ['Low noise', 'Fuel efficient', 'Weather resistant', 'Auto start/stop'],
            ],
        ];

        foreach ($items as $item) {
            Equipment::create([
                ...$item,
                'slug' => Str::slug($item['name']),
                'status' => 'active',
                'requires_operator' => $item['requires_operator'] ?? false,
                'is_featured' => $item['is_featured'] ?? false,
                'min_rental_days' => $item['min_rental_days'] ?? 1,
            ]);
        }
    }
}
