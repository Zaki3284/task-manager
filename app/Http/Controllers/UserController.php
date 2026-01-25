<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserFormRequest;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Management/Team_Users', [
            'users' => User::select(
                'id',
                'name',
                'email',
                'role',
                'status'
            )->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserFormRequest $request)
    {
        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'role'     => $request->role,
            'status'   => $request->status,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')
            ->with('success', 'User created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserFormRequest $request, User $user)
    {
        $data = $request->only([
            'name',
            'email',
            'role',
            'status',
        ]);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully');
    }
}
