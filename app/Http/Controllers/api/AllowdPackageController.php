<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\AllowedPackage;
use Illuminate\Http\Request;
use App\Traits\ApiResponser;

class AllowdPackageController extends Controller
{
    use ApiResponser;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $allowedPackages = AllowedPackage::latest()->get();
        return $this->success($allowedPackages);
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
            'name' => ['required', 'string', 'max:255', 'unique:allowed_packages,name'],
        ]);
        $allowedPackage = new AllowedPackage([
            'name' => $request->name,
            'description' => $request->description,

        ]);
        $allowedPackage->save();

        return $this->success($allowedPackage, null, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AllowedPackage  $allowedPackage
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(AllowedPackage $allowedPackage)
    {
        return $this->success($allowedPackage);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AllowedPackage  $allowedPackage
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, AllowedPackage $allowedPackage)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:allowed_packages,name,' . $allowedPackage->id],
        ]);

        $allowedPackage->name = $request->name;
        $allowedPackage->description = $request->from;
        $allowedPackage->save();

        return $this->success($allowedPackage);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AllowedPackage  $allowedPackage
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(AllowedPackage $allowedPackage)
    {
        $allowedPackage->delete();
        return $this->success(null, 'Deleted Successfully!');
    }
}
