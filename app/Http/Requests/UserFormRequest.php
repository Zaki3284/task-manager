<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($userId),
            ],
            'role' => 'required|in:Admin,Developer,Chef de projet',
            'status' => 'required|in:Active,Inactive',
            'password' => $this->isMethod('post') 
                ? 'required|string|min:6|confirmed' 
                : 'nullable|string|min:6|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'email.required' => 'Email is required',
            'email.unique' => 'Email is already taken',
            'role.required' => 'Role is required',
            'status.required' => 'Status is required',
            'password.required' => 'Password is required',
            'password.confirmed' => 'Password confirmation does not match',
        ];
    }
}
