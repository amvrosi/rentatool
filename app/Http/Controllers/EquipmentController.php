<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\EquipmentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::with(['category', 'primaryImage'])->active();

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('min_price')) {
            $query->where('daily_rate', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('daily_rate', '<=', $request->max_price);
        }

        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $equipment = $query->paginate(12)->withQueryString();

        $categories = EquipmentCategory::active()
            ->topLevel()
            ->withCount('equipment')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('equipment/index', [
            'equipment' => $equipment,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'min_price', 'max_price', 'sort', 'direction']),
        ]);
    }

    public function show(string $slug)
    {
        $equipment = Equipment::with(['category', 'images'])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        $relatedEquipment = Equipment::with(['primaryImage'])
            ->active()
            ->where('category_id', $equipment->category_id)
            ->where('id', '!=', $equipment->id)
            ->take(4)
            ->get();

        return Inertia::render('equipment/show', [
            'equipment' => $equipment,
            'relatedEquipment' => $relatedEquipment,
        ]);
    }
}
