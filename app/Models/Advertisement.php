<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'from_country',
        'to_country',
        'from_city',
        'to_city',
        'weight',
        'cost',
        'date',
        'additional_information',
    ];



    public function allowed_packages() {

        return $this->belongsToMany(AllowedPackage::class,'advertisements_allowed_packages');

    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders() {

        return $this->hasMany(Order::class);

    }

    public function available_weight($advertisement_id) {

        $ads = Advertisement::find($advertisement_id);
        $available_weight = $ads->weight;
        foreach ($ads->orders as $order)
        {
            $available_weight -= $order->weight;
        }

        return $available_weight;
    }

}
