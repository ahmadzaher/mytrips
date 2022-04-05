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
        ]);
        $user->email = $request->email;
        $user->name = $request->name;
        $user->phone_number = $request->phone_number;

        $user->save();

        return $this->success($user, 'Updated successfully!');
    }
}
