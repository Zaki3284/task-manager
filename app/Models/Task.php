<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'project_id',
        'user_id',
        'status',
        'due_date'
    ];

    // Relation avec le projet
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Relation avec l'utilisateur (développeur)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}