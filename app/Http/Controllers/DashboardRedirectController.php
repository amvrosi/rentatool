<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DashboardRedirectController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if ($user) {
            return match ($user->role->value) {
                'admin' => redirect()->route('admin.dashboard'),
                'operator' => redirect()->route('operator.dashboard'),
                default => redirect()->route('customer.dashboard'),
            };
        }

        return redirect()->route('home');
    }
}
