<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Models\Order;
use App\Rules\AvailableWeight;
use App\Traits\ApiResponser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{
    use ApiResponser;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $orders = Order::with('advertisement.user')->with('user')->latest()->paginate();
        foreach ($orders as $key => $order)
        {
            $orders[$key]->advertisement = Advertisement::advertisement_country_city($order->advertisement);
        }
        return $this->success($orders);
    }

    /**
     * Display a listing of user advertisements.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function myOrders(Request $request)
    {
        $user = auth()->user();

        $orders = Order::with('advertisement.user')->where('user_id', $user->id)->with('user')->latest()->paginate();
        foreach ($orders as $key => $order)
        {
            $orders[$key]->advertisement = Advertisement::advertisement_country_city($order->advertisement);
            $orders[$key]->advertisement->available_weight = Advertisement::available_weight($order->advertisement->id);

        }

        return $this->success($orders);
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
            'weight' => ['required', 'numeric', new AvailableWeight()],
            'advertisement_id' => ['required', 'numeric']
        ];

        if (!$user->hasRole('user')) {
            $validations['user_id'] = ['required', 'numeric'];
        }

        $request->validate($validations);

        $order = new Order([
            'user_id' => $user->id,
            'advertisement_id' => $request->advertisement_id,
            'weight' => $request->weight,
        ]);



        $order->save();

        $order = Order::with('advertisement')->with('user')->find($order->id);

        return $this->success($order, null, 201);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function rate(Request $request, $order_id)
    {
        $request->validate([
            'rate' => ['required', 'integer', 'between:1,10']
        ]);
        $order = Order::with('advertisement.user')->with('user')->find($order_id);

        $user = auth()->user();
        if($user->id == $order->user_id && $order->status == 3)
        {
            if($order->rated == 1){
                DB::table('ratings')->where([
                    'rateable_id' => $order->advertisement->user->id,
                    'user_id' => $user->id,
                    'rating' => $order->rating
                ])->limit(1)->delete();
            }
            $order->rated = 1;
            $order->rating = $request->rate;
            $order->save();
            $order->advertisement->user->rate($request->rate);
            return $this->success([
                'ratings' => $order->advertisement->user->averageRating
            ]);
        }

        return $this->forbidden();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Order $order)
    {
        $order = Order::with('advertisement.user')->with('user')->find($order->id);
        $order->advertisement = Advertisement::advertisement_country_city($order->advertisement);

        $order->advertisement->available_weight = Advertisement::available_weight($order->advertisement->id);
        return $this->success($order);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\JsonResponse
     */
    public function step1(Request $request, $order_id)
    {
        $order = Order::with('advertisement.user')->with('user')->find($order_id);

        $user = auth()->user();
        if($user->id == $order->user_id)
        {
            if($order->status == 2){

                return $this->error('Already verified', 403);
            }
            $order->status = 2;
            $order->save();

            return $this->success($order);
        }

        return $this->forbidden();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\JsonResponse
     */
    public function step2(Request $request, $order_id)
    {
        $order = Order::with('advertisement.user')->with('user')->find($order_id);

        $user = auth()->user();
        if($user->id == $order->advertisement->user->id)
        {
            if($order->status == 3){

                return $this->error('Already verified', 403);
            }
            $order->status = 3;
            $order->save();

            return $this->success($order);
        }

        return $this->forbidden();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Advertisement  $advertisement
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Order $order)
    {
        $order = Order::with('advertisement.user')->with('user')->find($order->id);
        $user = auth()->user();
        if($order->status != 1){
            return $this->error("You can't delete a verified order", 403);
        }
        if ($user->id == $order->user_id || $user->id == $user->advertisement->id){
            $order->delete();
            return $this->success(null, 'Deleted Successfully!');
        }
        return $this->error('Something went wrong!', 403);

    }
}
