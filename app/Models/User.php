<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laratrust\Traits\LaratrustUserTrait;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use willvincent\Rateable\Rateable;

class User extends Authenticatable implements HasMedia
{
    use Rateable;
    use LaratrustUserTrait;
    use HasApiTokens, HasFactory, Notifiable;
    use InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    public function registerMediaConversions(Media $media = null): void
    {
        // profile avatar
        $this->addMediaConversion('thumb')
            ->width(368)
            ->height(232)
            ->sharpen(10);
        // confirmation photo
        $this
            ->addMediaCollection('confirmation_photo')
            ->acceptsFile(function (File $file) {
                return $file->mimeType === 'image/jpeg' || $file->mimeType === 'image/png' || $file->mimeType === 'image/jpg';
            });
        // confirmation video
        $this
            ->addMediaCollection('confirmation_photo')
            ->acceptsFile(function (File $file) {
                return $file->mimeType === 'mp4';
            });
    }
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_confirmed',
        'phone_number',
        'isVerified'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->toDateString();
    }

    public function advertisements()
    {
        return $this->hasMany(Advertisement::class);
    }
}
