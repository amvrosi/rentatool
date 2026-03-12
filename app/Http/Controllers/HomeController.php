<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\EquipmentCategory;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $featuredEquipment = Equipment::with(['category', 'primaryImage'])
            ->active()
            ->featured()
            ->take(6)
            ->get();

        $categories = EquipmentCategory::active()
            ->topLevel()
            ->withCount('equipment')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('welcome', [
            'featuredEquipment' => $featuredEquipment,
            'categories' => $categories,
        ]);
    }
}
