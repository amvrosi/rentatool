<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EquipmentCategoryResource;
use App\Models\EquipmentCategory;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = EquipmentCategory::active()
            ->topLevel()
            ->with('children')
            ->withCount('equipment')
            ->orderBy('sort_order')
            ->get();

        return EquipmentCategoryResource::collection($categories);
    }
}
