<?php

use App\Http\Controllers\api\AdvertisementController;
use App\Http\Controllers\api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/auth/register', [AuthController::class, 'register']);

Route::post('/auth/login', [AuthController::class, 'login']);

Route::prefix('guest')->group(function () {
    Route::get('advertisement', [AdvertisementController::class, 'index']);
    Route::get('advertisement/{advertisement}', [AdvertisementController::class, 'show']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::prefix('user')->middleware(['role:user'])->group(function () {
        Route::apiResource('advertisement', \App\Http\Controllers\api\AdvertisementController::class);
    });


    Route::prefix('admin')->middleware(['role:admin|staff'])->group(function () {
        Route::apiResource('allowed_packages', \App\Http\Controllers\api\AllowdPackageController::class);
    });


    Route::get('/profile', [\App\Http\Controllers\api\ProfileController::class, 'show']);
    Route::put('/profile', [\App\Http\Controllers\api\ProfileController::class, 'update']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
