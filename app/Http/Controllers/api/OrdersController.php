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
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show(Order $order)
    {
        //
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
        $user = auth()->user();
        if ($user->id == $order->user_id){
            $order->delete();
            return $this->success(null, 'Deleted Successfully!');
        }
        return $this->error('Something went wrong!', 403);

    }
}
