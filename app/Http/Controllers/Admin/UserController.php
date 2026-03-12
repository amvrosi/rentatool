<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->withCount('rentals')->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search']),
            'roles' => array_map(fn ($r) => ['value' => $r->value, 'label' => $r->label()], UserRole::cases()),
        ]);
    }

    public function show(User $user)
    {
        $user->loadCount('rentals');

        return Inertia::render('admin/users/show', [
            'viewUser' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => ['required', 'string'],
        ]);

        $user->update(['role' => UserRole::from($data['role'])]);

        return redirect()->back()->with('success', 'User role updated.');
    }
}
