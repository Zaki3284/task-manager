<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:Pending,Ongoing,Completed',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The project name is required.',
            'name.max' => 'The project name cannot exceed 255 characters.',
            'status.required' => 'The project status is required.',
            'status.in' => 'The status must be Pending, Ongoing, or Completed.',
        ];
    }
}