<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// routes/web.php
Route::post('/change-language', function (\Illuminate\Http\Request $request) {
    session(['locale' => $request->language]);
    app()->setLocale($request->language);
    return back();
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'counts' => [
                'projects' => Project::count(),
                'tasks'    => Task::count(),
                'users'    => User::count(),
            ],
        ]);
    })->name('dashboard');
    
Route::resource('projects', ProjectController::class)->only([
    'index', 'store', 'update', 'destroy'
]);
    Route::resource('tasks', TaskController::class);
    Route::resource('users', UserController::class);

});


Route::post('/change-language', function (Request $request) {
    $language = $request->input('language', 'en');
    
    // Store in session
    session(['locale' => $language]);
    
    // Redirect back to refresh the page with new locale
    return back();
})->name('change-language');

require __DIR__.'/settings.php';
