<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Http\Requests\TaskFormRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;  // ← Ajoutez cette ligne

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Initialize queries based on role
        if ($user->role === 'Admin') {
            $tasksQuery = Task::with(['project', 'user']);
            $projects = Project::all(['id', 'name']);
        } elseif ($user->role === 'Developer') {
            $tasksQuery = Task::with(['project', 'user'])
                ->where('user_id', $user->id);
            
            // Developer sees only projects where they have tasks
            $projectIds = Task::where('user_id', $user->id)
                ->distinct()
                ->pluck('project_id');
            $projects = Project::whereIn('id', $projectIds)->get(['id', 'name']);
        } elseif ($user->role === 'Chef de projet') {
            $tasksQuery = Task::with(['project', 'user'])
                ->whereHas('project', function($q) use ($user) {
                    $q->where('chef_id', $user->id);
                });
            
            $projects = Project::where('chef_id', $user->id)->get(['id', 'name']);
        } else {
            // No role or unrecognized role
            $tasksQuery = Task::whereRaw('1 = 0');
            $projects = collect();
        }

        // Apply filters
        if ($request->filled('status') && $request->status !== 'all') {
            $tasksQuery->where('status', $request->status);
        }

        if ($request->filled('project') && $request->project !== 'all') {
            $tasksQuery->where('project_id', $request->project);
        }

        $tasks = $tasksQuery->orderBy('created_at', 'desc')->get();

        // Get users for task assignment (only for roles that can create tasks)
        if (in_array($user->role, ['Admin', 'Chef de projet'])) {
            $users = User::where('role', 'Developer')
                ->get(['id', 'name', 'role']);
        } else {
            $users = collect();
        }

        return Inertia::render('Management/Tasks', [
            'tasks' => $tasks,
            'projects' => $projects,
            'users' => $users,
            'filters' => [
                'status' => $request->status ?? 'all',
                'project' => $request->project ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskFormRequest $request)
    {
        $user = Auth::user();

        // Check permission
        if (!in_array($user->role, ['Admin', 'Chef de projet'])) {
            abort(403, "You don't have permission to create tasks");
        }

        // Chef de projet can only create tasks for their own projects
        if ($user->role === 'Chef de projet') {
            $project = Project::findOrFail($request->project_id);
            
            if ($project->chef_id !== $user->id) {
                abort(403, "You can only create tasks for your own projects");
            }
        }

        try {
            Task::create($request->validated());
            
            return redirect()->back()->with('success', 'Task created successfully');
        } catch (\Exception $e) {
            Log::error('Failed to create task: ' . $e->getMessage());
            
            return redirect()->back()
                ->with('error', 'Failed to create task. Please try again.')
                ->withInput();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $user = Auth::user();

        // Handle Developer updates (status only)
        if ($user->role === 'Developer') {
            if ($task->user_id !== $user->id) {
                abort(403, "You can only update your own tasks");
            }
            
            $validated = $request->validate([
                'status' => 'required|in:Pending,Ongoing,Completed'
            ]);
            
            try {
                $task->update($validated);
                return redirect()->back()->with('success', 'Task status updated successfully');
            } catch (\Exception $e) {
                Log::error('Failed to update task status: ' . $e->getMessage());
                return redirect()->back()->with('error', 'Failed to update task status');
            }
        }

        // Handle Chef de projet updates
        if ($user->role === 'Chef de projet') {
            // Load the project relationship if not already loaded
            $task->load('project');
            
            if ($task->project->chef_id !== $user->id) {
                abort(403, "You can only update your own project's tasks");
            }
            
            // If changing project, verify the new project belongs to this chef
            if ($request->filled('project_id') && $request->project_id != $task->project_id) {
                $newProject = Project::findOrFail($request->project_id);
                
                if ($newProject->chef_id !== $user->id) {
                    abort(403, "You can only assign tasks to your own projects");
                }
            }
        }

        // Validate and update (for Admin and Chef de projet)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:Pending,Ongoing,Completed',
            'due_date' => 'required|date',
        ]);

        try {
            $task->update($validated);
            return redirect()->back()->with('success', 'Task updated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to update task: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Failed to update task')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $user = Auth::user();

        // Developers cannot delete tasks
        if ($user->role === 'Developer') {
            abort(403, "You don't have permission to delete tasks");
        }

        // Chef de projet can only delete their own project's tasks
        if ($user->role === 'Chef de projet') {
            $task->load('project');
            
            if ($task->project->chef_id !== $user->id) {
                abort(403, "You can only delete your own project's tasks");
            }
        }

        try {
            $task->delete();
            return redirect()->back()->with('success', 'Task deleted successfully');
        } catch (\Exception $e) {
            Log::error('Failed to delete task: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete task');
        }
    }
}