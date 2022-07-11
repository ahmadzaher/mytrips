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

// ssh access : ssh -p 65002 u526533852@151.106.96.211

// php mysql : https://auth-db437.hstgr.io/index.php?db=u526533852_trips

// username : u526533852_ahmad_97341t

// password : Khrezaty1@#

Route::post('/auth/register', [AuthController::class, 'register']);

Route::post('/auth/login', [AuthController::class, 'login']);

Route::prefix('guest')->group(function () {
    Route::get('advertisement', [AdvertisementController::class, 'index']);
    Route::get('advertisement/{advertisement}', [AdvertisementController::class, 'show']);
});


Route::group(['prefix' => 'countries'], function() {

    Route::get('search/{name}/{parent_id?}', 	'\Igaster\LaravelCities\GeoController@search');

    Route::get('item/{id}', 		'\Igaster\LaravelCities\GeoController@item');

    Route::get('cities/{id}', 	'\Igaster\LaravelCities\GeoController@children');

    Route::get('parent/{id}', 	'\Igaster\LaravelCities\GeoController@parent');

    Route::get('country/{code}',	'\Igaster\LaravelCities\GeoController@country');

    Route::get('/', 		'\Igaster\LaravelCities\GeoController@countries');

    Route::get('ancestors/{id}','\Igaster\LaravelCities\GeoController@ancestors');

    Route::get('breadcrumbs/{id}','\Igaster\LaravelCities\GeoController@breadcrumbs');

});


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::prefix('user')->middleware(['role:user'])->group(function () {
        Route::apiResource('advertisement', \App\Http\Controllers\api\AdvertisementController::class);
        Route::get('/allowed_packages', [\App\Http\Controllers\api\AllowdPackageController::class, 'index']);
    });


    Route::prefix('admin')->middleware(['role:admin|staff'])->group(function () {
        Route::apiResource('allowed_packages', \App\Http\Controllers\api\AllowdPackageController::class);
        Route::apiResource('user', \App\Http\Controllers\api\UserController::class);

        Route::prefix('staff')->group(function () {
            Route::apiResource('user', \App\Http\Controllers\api\StaffController::class);
        });
    });


    Route::get('/profile', [\App\Http\Controllers\api\ProfileController::class, 'show']);
    Route::put('/profile', [\App\Http\Controllers\api\ProfileController::class, 'update']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

