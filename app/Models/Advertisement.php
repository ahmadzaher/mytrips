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



    public function allowed_packages() {

        return $this->belongsToMany(AllowedPackage::class,'advertisements_allowed_packages');

    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
