<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Traits\ApiResponser;
use Igaster\LaravelCities\Geo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class AdvertisementController extends Controller
{

    use ApiResponser;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $ads = Advertisement::with('allowed_packages')->with('user')->latest()->paginate();
        foreach ($ads as $key => $advertisement)
        {
            $ads[$key] = Advertisement::advertisement_country_city($ads[$key]);
            $ads[$key]->user->average_ratings = $ads[$key]->user->averageRating;
        }
        return $this->success($ads);
    }


    /**
     * Display a listing of user advertisements.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function myAdvertisements(Request $request)
    {
        $user = auth()->user();
        $ads = Advertisement::with('allowed_packages')
            ->where('user_id', $user->id)
            ->with('user')
            ->with('orders')
            ->latest()->paginate();
        foreach ($ads as $key => $advertisement)
        {
            $ads[$key] = Advertisement::advertisement_country_city($ads[$key]);
            $ads[$key]->available_weight = $ads[$key]->weight;
            $ads[$key]->user->average_ratings = $ads[$key]->user->averageRating;
            foreach ($advertisement->orders as $order)
            {
                $ads[$key]->available_weight -= $order->weight;
            }
        }
        return $this->success($ads);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {

        $user = auth()->user();

        $validations = [
            'from_country' => ['required', 'numeric'],
            'from_city' => ['required', 'numeric'],
            'to_country' => ['required', 'numeric'],
            'to_city' => ['required', 'numeric'],
            'weight' => ['required', 'numeric'],
            'cost' => ['required', 'numeric'],
            'date' => ['required', 'date_format:Y-m-d H:i:s', 'after_or_equal:'.date('Y-m-d H:i:s')],
            'allowed_packages' => ['required']
        ];

        if (!$user->hasRole('user')) {
//            return $this->error('This is for users', 401);
            $validations['user_id'] = ['required', 'numeric'];
        }

        $request->validate($validations);
        $advertisement = new Advertisement([
            'user_id' => $user->id,
            'from_country' => $request->from_country,
            'from_city' => $request->from_city,
            'to_country' => $request->to_country,
            'to_city' => $request->to_city,
            'weight' => $request->weight,
            'cost' => $request->cost,
            'date' => $request->date,
            'additional_information' => $request->additional_information,
        ]);


        $advertisement->save();


        $allowed_packages = (array_unique($request->allowed_packages, SORT_REGULAR));

        $advertisement->allowed_packages()->sync($allowed_packages);
        $advertisement = Advertisement::with('allowed_packages')->with('user')->find($advertisement->id);


        $advertisement->available_weight = Advertisement::available_weight($advertisement->id);
        $advertisement = Advertisement::advertisement_country_city($advertisement);
        return $this->success($advertisement, null, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Advertisement $advertisement)
    {
        $advertisement = Advertisement::with('allowed_packages')->with('user')->find($advertisement->id);
        $advertisement->available_weight = Advertisement::available_weight($advertisement->id);
        $advertisement = Advertisement::advertisement_country_city($advertisement);
        return $this->success($advertisement);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Advertisement $advertisement)
    {
        $user = auth()->user();
        $user_id = $user->id;
        if($user_id !== $advertisement->user_id)
            return $this->forbidden();

        $request->validate([
            'from_country' => ['required', 'numeric'],
            'from_city' => ['required', 'numeric'],
            'to_country' => ['required', 'numeric'],
            'to_city' => ['required', 'numeric'],
            'weight' => ['required', 'numeric'],
            'cost' => ['required', 'numeric'],
            'date' => ['required', 'date_format:Y-m-d H:i:s', 'after_or_equal:'.date('Y-m-d H:i:s')],
            'allowed_packages' => ['required']
        ]);

        $advertisement->user_id = $user_id;
        $advertisement->from_country = $request->from_country;
        $advertisement->from_city = $request->from_city;
        $advertisement->to_country = $request->to_country;
        $advertisement->to_city = $request->to_city;
        $advertisement->weight = $request->weight;
        $advertisement->cost = $request->cost;
        $advertisement->date = $request->date;
        $advertisement->save();


        $allowed_packages = (array_unique($request->allowed_packages, SORT_REGULAR));
        $advertisement->allowed_packages()->sync($allowed_packages);
        $advertisement = Advertisement::with('allowed_packages')->with('user')->find($advertisement->id);


        $advertisement->available_weight = Advertisement::available_weight($advertisement->id);
        $advertisement = Advertisement::advertisement_country_city($advertisement);
        return $this->success($advertisement);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Advertisement $advertisement)
    {
        $user = auth()->user();
        if ($user->id == $advertisement->user_id){
            $advertisement->delete();
            return $this->success(null, 'Deleted Successfully!');
        }
        return $this->error('Something went wrong!', 403);

    }
}
