<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'chef_id', 
    ];


    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
 public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    // Relation avec les tâches
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
