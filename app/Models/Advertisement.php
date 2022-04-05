<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'from',
        'to',
        'weight',
        'cost',
        'date',
        'additional_information',
    ];
}
