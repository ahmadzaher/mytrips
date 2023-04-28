<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

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
        $user = Auth::user();
        if($user->hasRole('admin'))
            return Carbon::parse($value)->format('d M, Y');
        return  $value;
    }


    public function advertisement()
    {
        return $this->belongsTo(Advertisement::class);
    }
}
