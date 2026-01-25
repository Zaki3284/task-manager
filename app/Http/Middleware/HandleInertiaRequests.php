<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\File;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
public function share(Request $request): array
{
    $locale = session('locale', config('app.locale', 'en'));
    
    // Load translations
    $translationFile = lang_path("{$locale}.json");
    $translations = File::exists($translationFile) 
        ? json_decode(File::get($translationFile), true) 
        : [];

    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user(),
        ],
        'locale' => $locale, // ✅ Always pass current locale
        'translations' => $translations,
        'dir' => $locale === 'ar' ? 'rtl' : 'ltr',
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
    ]);
}
}