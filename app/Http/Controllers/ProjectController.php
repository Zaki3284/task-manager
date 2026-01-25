<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\ProjectFormRequest;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'Admin') {
            $projects = Project::all();
        } elseif ($user->role === 'Chef de projet') {
            $projects = Project::where('chef_id', $user->id)->get();
        } else {
            abort(403, "You don't have permission to view projects");
        }

        return Inertia::render('Management/Projects', [
            'projects' => $projects,
            'userRole' => $user->role, // نرسل الدور للـ React
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectFormRequest $request)
    {
        $user = Auth::user();

        if (!in_array($user->role, ['Admin', 'Chef de projet'])) {
            abort(403, "You don't have permission to create projects");
        }

        try {
            Project::create([
                ...$request->validated(),
                'chef_id' => $user->id, // Chef de projet هو صاحب المشروع
            ]);

            return redirect()->back()->with('success', 'Project created successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create project: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectFormRequest $request, Project $project)
    {
        $user = Auth::user();

        if ($user->role === 'Developer') {
            abort(403, "You don't have permission to update projects");
        }

        if ($user->role === 'Chef de projet' && $project->chef_id !== $user->id) {
            abort(403, "You can only update your own projects");
        }

        try {
            $project->update($request->validated());
            return redirect()->back()->with('success', 'Project updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update project: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $user = Auth::user();

        if ($user->role === 'Developer') {
            abort(403, "You don't have permission to delete projects");
        }

        if ($user->role === 'Chef de projet' && $project->chef_id !== $user->id) {
            abort(403, "You can only delete your own projects");
        }

        try {
            $project->delete();
            return redirect()->back()->with('success', 'Project deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete project: ' . $e->getMessage());
        }
    }
}
