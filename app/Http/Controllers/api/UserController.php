<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;

class UserController extends Controller
{
    use ApiResponser;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
//        $users = User::whereRoleIs('user')->orWhereRoleIs('admin')->latest()->get();
        $users = User::whereRoleIs('user')->with('media')->with('roles')->latest()->get();
        foreach($users as $key => $user)
        {
            $avatar = $user->getFirstMediaUrl('thumb', 'thumb') != null ? url($user->getFirstMediaUrl('thumb', 'thumb')) : '';

            $confirmation_video = $user->getFirstMediaUrl('confirmation_video', 'confirmation_video');
            $confirmation_photo = $user->getFirstMediaUrl('confirmation_photo', 'confirmation_photo');

            $users[$key]['avatar'] = $avatar;
            $users[$key]['confirmation_photo'] = $confirmation_photo;
            $users[$key]['confirmation_video'] = $confirmation_video;
            unset($users[$key]['media']);
        }
        return $this->success($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'avatar' => 'image|mimes:jpg,png,jpeg,gif,svg|max:2048',
        ]);

        $user = User::create([
            'name' => $request['name'],
            'password' => bcrypt($request['password']),
            'email' => $request['email'],
            'phone_number' => $request->phone_number
        ]);
        $user->save();

        $user->attachRole('user');



        if (isset($request->avatar)) {
            $user->clearMediaCollection('thumb');
            $user
                ->addMediaFromRequest('avatar')
                ->toMediaCollection('thumb');
        }
        $user->avatar = $user->getFirstMediaUrl('thumb', 'thumb');
        unset($user->media);
        $roles = $user->roles()->get();
        $user->role = $roles[0];

        return $this->success($user, null, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        $roles = $user->roles()->get();
        if(count($roles) > 0)
            $user->role = $roles[0];
        $user->avatar = $user->getFirstMediaUrl('thumb', 'thumb');
        $user->confirmation_video = $user->getFirstMediaUrl('confirmation_video', 'confirmation_video');
        $user->confirmation_photo = $user->getFirstMediaUrl('confirmation_photo', 'confirmation_photo');
        unset($user->media);
        return $this->success($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'unique:users,email,'.$user->id],
            'password' => 'string|min:6|confirmed|nullable',
            'avatar' => 'image|mimes:jpg,png,jpeg,gif,svg|max:2048'
        ]);

        if(isset($request->is_confirmed)){
            $user->is_confirmed = $request->is_confirmed;
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone_number = $request->phone_number;
        $user->password = bcrypt($request->password);
        $user->save();

        if (isset($request->avatar)) {
            $user->clearMediaCollection('thumb');
            $user
                ->addMediaFromRequest('avatar')
                ->toMediaCollection('thumb');
        }

        $user->avatar = $user->getFirstMediaUrl('thumb', 'thumb');
        unset($user->media);

        return $this->success($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user)
    {
        $current_user = auth()->user();

        if($user->id == $current_user->id){
            return $this->error('You can\'t delete yourself', 403);
        }
        $user->advertisements()->delete();
        $user->delete();
        return $this->success(null, 'Deleted Successfully!');
    }
}
