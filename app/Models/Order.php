<?php

namespace App\Models;

use Carbon\Carbon;
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

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('d M, Y');
    }


    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }
}
