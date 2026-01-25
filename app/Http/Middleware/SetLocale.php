<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        // Get locale from session, default to 'en'
        $locale = session('locale', config('app.locale', 'en'));
        
        // Validate locale
        $allowedLanguages = ['en', 'fr', 'ar'];
        if (!in_array($locale, $allowedLanguages)) {
            $locale = 'en';
        }
        
        // Set application locale
        app()->setLocale($locale);
        
        return $next($request);
    }
}