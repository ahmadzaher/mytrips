<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;


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
        $user = auth()->user();
        $ads = Advertisement::latest()->paginate();
        return $this->success($ads, null, 201);
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

        if (!$user->hasRole('user')) {
            return $this->error('This is for users', 401);
        }

        $request->validate([
            'from' => ['required', 'string', 'max:255'],
            'to' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'numeric'],
            'cost' => ['required', 'numeric'],
            'date' => ['required', 'date_format:Y-m-d H:i:s', 'after_or_equal:'.date('Y-m-d H:i:s')],
        ]);
        $advertisement = new Advertisement([
            'user_id' => $user->id,
            'from' => $request->from,
            'to' => $request->to,
            'weight' => $request->weight,
            'cost' => $request->cost,
            'date' => $request->date,
            'additional_information' => $request->additional_information,

        ]);
        $advertisement->save();

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
        return $this->success($advertisement, null, 201);
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
            'from' => ['required', 'string', 'max:255'],
            'to' => ['required', 'string', 'max:255'],
            'weight' => ['required', 'numeric'],
            'cost' => ['required', 'numeric'],
            'date' => ['required', 'date_format:Y-m-d H:i:s', 'after_or_equal:'.date('Y-m-d H:i:s')],
        ]);

        $advertisement->user_id = $user_id;
        $advertisement->from = $request->from;
        $advertisement->to = $request->to;
        $advertisement->weight = $request->weight;
        $advertisement->cost = $request->cost;
        $advertisement->date = $request->date;
        $advertisement->save();

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
        if ($user->id == $advertisement->user_id)
            return $this->success(null, 'Deleted Successfully!');
        return $this->error('Something went wrong!', 403);

    }
}
