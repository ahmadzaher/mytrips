<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

    public function getCreatedAtAttribute($value)
    {
        $user = Auth::user();
        if($user->hasRole('admin'))
            return Carbon::parse($value)->format('d M, Y');
        return  $value;
    }

    public function advertisement_country_city($advertisement) {

        $advertisement->from_country_name = is_object(DB::table('geo')->where('id', $advertisement->from_country)->first()) ? DB::table('geo')->where('id', $advertisement->from_country)->first()->name : '';
        $advertisement->from_city_name = is_object(DB::table('geo')->where('id', $advertisement->from_city)->first()) ? DB::table('geo')->where('id', $advertisement->from_city)->first()->name : '';
        $advertisement->to_country_name = is_object(DB::table('geo')->where('id', $advertisement->to_country)->first()) ? DB::table('geo')->where('id', $advertisement->to_country)->first()->name : '';
        $advertisement->to_city_name = is_object(DB::table('geo')->where('id', $advertisement->to_city)->first()) ? DB::table('geo')->where('id', $advertisement->to_city)->first()->name : '';
        return $advertisement;
    }

}
