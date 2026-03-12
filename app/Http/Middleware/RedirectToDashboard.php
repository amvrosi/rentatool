<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectToDashboard
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            return match ($user->role->value) {
                'admin' => redirect()->route('admin.dashboard'),
                'operator' => redirect()->route('operator.dashboard'),
                default => redirect()->route('customer.dashboard'),
            };
        }

        return $next($request);
    }
}
