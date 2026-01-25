<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:Pending,Ongoing,Completed',
            'due_date' => 'required|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Task name is required',
            'project_id.required' => 'Project is required',
            'project_id.exists' => 'Selected project does not exist',
            'user_id.required' => 'Developer is required',
            'user_id.exists' => 'Selected developer does not exist',
            'due_date.required' => 'Due date is required',
            'due_date.after_or_equal' => 'Due date cannot be in the past',
        ];
    }
}
