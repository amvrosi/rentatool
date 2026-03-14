<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEquipmentRequest;
use App\Http\Requests\Admin\UpdateEquipmentRequest;
use App\Models\Equipment;
use App\Models\EquipmentCategory;
use App\Models\EquipmentImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Equipment::with(['category', 'primaryImage']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $equipment = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $categories = EquipmentCategory::active()->orderBy('sort_order')->get();

        return Inertia::render('admin/equipment/index', [
            'equipment' => $equipment,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    public function create()
    {
        $categories = EquipmentCategory::active()->orderBy('sort_order')->get();

        return Inertia::render('admin/equipment/create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreEquipmentRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        $images = $data['images'] ?? [];
        unset($data['images']);

        $equipment = Equipment::create($data);

        foreach ($images as $index => $image) {
            $path = $image->store('equipment', 'public');
            EquipmentImage::create([
                'equipment_id' => $equipment->id,
                'path' => $path,
                'alt_text' => $equipment->name,
                'sort_order' => $index,
                'is_primary' => $index === 0,
            ]);
        }

        return redirect()->route('admin.equipment.index')
            ->with('success', 'Equipment created successfully.');
    }

    public function edit(Equipment $equipment)
    {
        $equipment->load('images');
        $categories = EquipmentCategory::active()->orderBy('sort_order')->get();

        return Inertia::render('admin/equipment/edit', [
            'equipment' => $equipment,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateEquipmentRequest $request, Equipment $equipment)
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        // Remove images
        if (!empty($data['remove_images'])) {
            $imagesToRemove = EquipmentImage::whereIn('id', $data['remove_images'])
                ->where('equipment_id', $equipment->id)
                ->get();
            foreach ($imagesToRemove as $img) {
                Storage::disk('public')->delete($img->path);
                $img->delete();
            }
        }
        unset($data['remove_images']);

        // Add new images
        $images = $data['images'] ?? [];
        unset($data['images']);

        $equipment->update($data);

        $maxOrder = $equipment->images()->max('sort_order') ?? -1;
        foreach ($images as $index => $image) {
            $path = $image->store('equipment', 'public');
            EquipmentImage::create([
                'equipment_id' => $equipment->id,
                'path' => $path,
                'alt_text' => $equipment->name,
                'sort_order' => $maxOrder + $index + 1,
                'is_primary' => $equipment->images()->count() === 0 && $index === 0,
            ]);
        }

        return redirect()->route('admin.equipment.index')
            ->with('success', 'Equipment updated successfully.');
    }

    public function destroy(Equipment $equipment)
    {
        foreach ($equipment->images as $image) {
            Storage::disk('public')->delete($image->path);
        }
        $equipment->delete();

        return redirect()->route('admin.equipment.index')
            ->with('success', 'Equipment deleted successfully.');
    }
}
