<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'weight',
        'additional_information',
        'advertisement_id',
        'user_id',
        'status',
        'rated',
        'rating'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }
}
