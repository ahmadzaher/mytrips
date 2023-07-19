<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;

class ProfileController extends Controller
{
    use ApiResponser;


    public function show(Request $request)
    {
        $user = auth()->user();

        if (isset($request->avatar)) {
            $user->clearMediaCollection('thumb');
            $user
                ->addMediaFromRequest('avatar')
                ->toMediaCollection('thumb');
        }
        $user->avatar = $user->getFirstMediaUrl('thumb', 'thumb');
        $user->confirmation_video = $user->getFirstMediaUrl('confirmation_video', 'confirmation_video');
        $user->confirmation_photo = $user->getFirstMediaUrl('confirmation_photo', 'confirmation_photo');
        unset($user->media);

        $roles = $user->roles()->get();

        if(count($roles) > 0)
            $user->role = $roles[0];
        $user->average_ratings = $user->averageRating;
        $user->verified = $user->email_verified_at != null;
        unset($user->isVerified);

        return $this->success($user);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $user = User::find($user->id);
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,'.$user->id],
            'phone_number' => ['max:255'],
            'avatar' => 'image|mimes:jpg,png,jpeg,gif,svg|max:2048',
            'confirmation_photo' => 'image|mimes:jpg,png,jpeg|max:2048',
            'confirmation_video' => 'mimes:mp4|max:20000',
        ]);
        $user->email = $request->email;
        $user->name = $request->name;
        $user->phone_number = $request->phone_number;

        $user->save();

        if (isset($request->avatar)) {
            $user->clearMediaCollection('thumb');
            $user
                ->addMediaFromRequest('avatar')
                ->toMediaCollection('thumb');
        }

        if (isset($request->confirmation_photo)) {
            $user->clearMediaCollection('confirmation_photo');
            $user
                ->addMediaFromRequest('confirmation_photo')
                ->toMediaCollection('confirmation_photo');
        }

        if (isset($request->confirmation_video)) {
            $user->clearMediaCollection('confirmation_video');
            $user
                ->addMediaFromRequest('confirmation_video')
                ->toMediaCollection('confirmation_video');
        }
        $user->avatar = $user->getFirstMediaUrl('thumb', 'thumb');
        $user->confirmation_video = $user->getFirstMediaUrl('confirmation_video', 'confirmation_video');
        $user->confirmation_photo = $user->getFirstMediaUrl('confirmation_photo', 'confirmation_photo');
        $user->average_ratings = $user->averageRating;
        unset($user->media);


        return $this->success($user, 'Updated successfully!');
    }
}