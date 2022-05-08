<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    use ApiResponser;

    public function register(Request $request)
    {
        $attr = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed'
        ]);

        $user = User::create([
            'name' => $attr['name'],
            'password' => bcrypt($attr['password']),
            'email' => $attr['email'],
            'phone_number' => $request->phone_number
        ]);

        $user->attachRole('user');
        $token = $user->createToken('API Token')->plainTextToken;
        $cookie = cookie('jwt', $token, 60 * 24); // 1 DAY

        if (!Auth::attempt($attr)) {
            return $this->error('Credentials not match', 401);
        }

        return response([
            'status' => 'Success',
            'message' => null,
            'data' => [
                'token' => $token,
                'user' => auth()->user()
            ]
        ])->withCookie($cookie);

    }

    public function login(Request $request)
    {
        $attr = $request->validate([
            'email' => 'required|string|email|',
            'password' => 'required|string|min:6'
        ]);

        if (!Auth::attempt($attr)) {
            return $this->error('Credentials not match', 401);
        }

        $token = auth()->user()->createToken('API Token')->plainTextToken;

        $cookie = cookie('jwt', $token, 60 * 24); // 1 DAY

        return response([
            'status' => 'Success',
            'message' => 'Logged in successfully',
            'data' => [
                'token' => $token,
                'user' => auth()->user()
            ]
        ])->withCookie($cookie);

    }

    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();

        $cookie = Cookie::forget('jwt');

        try {
            $request->session()->invalidate();
        }catch (\Exception $e){
            // From Api
        }

        return response([
            'message' => 'Tokens Revoked'
        ])->withCookie($cookie);

    }
}
