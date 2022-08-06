<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Twilio\Rest\Client;

class AuthController extends Controller
{
    use ApiResponser;

    public function register(Request $request)
    {
        $attr = $request->validate([
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'phone_number' => ['required', 'numeric', 'unique:users'],
        ]);
        $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'image|mimes:jpg,png,jpeg,gif,svg|max:2048',
        ]);


        $token = getenv("TWILIO_AUTH_TOKEN");
        $twilio_sid = getenv("TWILIO_SID");
        $twilio_verify_sid = getenv("TWILIO_VERIFY_SID");

        $twilio = new Client($twilio_sid, $token);
        $twilio->verify->v2->services($twilio_verify_sid)
            ->verifications
            ->create($request['phone_number'], "sms");

        $user = User::create([
            'name' => $request['name'],
            'password' => bcrypt($request['password']),
            'email' => $request['email'],
            'phone_number' => $request->phone_number
        ]);

        $user->attachRole('user');

        return response([
            'status' => 'Success',
            'message' => null,
            'data' => [
                'phone_number' => $request->phone_number
            ]
        ]);

    }

    public function verify(Request $request)
    {
        $data = $request->validate([
            'verification_code' => ['required', 'numeric'],
            'phone_number' => ['required', 'string'],
        ]);
        /* Get credentials from .env */
        $token = getenv("TWILIO_AUTH_TOKEN");
        $twilio_sid = getenv("TWILIO_SID");
        $twilio_verify_sid = getenv("TWILIO_VERIFY_SID");
        $twilio = new Client($twilio_sid, $token);
        $verification = $twilio->verify->v2->services($twilio_verify_sid)
            ->verificationChecks
            ->create(['Code' => $data['verification_code'], 'To' => '+' . $data['phone_number']]);

        if ($verification->valid) {
            $user = tap(User::where('phone_number', '+' . $data['phone_number']))->update(['isVerified' => true]);
            /* Authenticate user */
            $user = $user->first();

            Auth::login($user);

            $user = auth()->user();

            $token = $user->createToken('API Token')->plainTextToken;
            $cookie = cookie('jwt', $token, 60 * 24); // 1 DAY

            if (isset($request->avatar)) {
                $user->clearMediaCollection('thumb');
                $user
                    ->addMediaFromRequest('avatar')
                    ->toMediaCollection('thumb');
            }
            $user->avatar = $user->getFirstMediaUrl('thumb', 'thumb');
            unset($user->media);

            $roles = $user->roles()->get();

            if(count($roles) > 0)
                $user->role = $roles[0];

            return response([
                'status' => 'Success',
                'message' => null,
                'data' => [
                    'token' => $token,
                    'user' => $user
                ]
            ])->withCookie($cookie);
        }

        return $this->error('Credentials not match', 401);
    }

    public function login(Request $request)
    {
        $attr = $request->validate([
            'email' => 'required|string|email|',
            'password' => 'required|string|min:6'
        ]);

        $request->validate([
            'avatar' => 'image|mimes:jpg,png,jpeg,gif,svg|max:2048',
        ]);

        if (!Auth::attempt($attr)) {
            return $this->error('Credentials not match', 401);
        }

        $token = auth()->user()->createToken('API Token')->plainTextToken;

        $cookie = cookie('jwt', $token, 60 * 24); // 1 DAY


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

        return response([
            'status' => 'Success',
            'message' => 'Logged in successfully',
            'data' => [
                'token' => $token,
                'user' => $user
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
