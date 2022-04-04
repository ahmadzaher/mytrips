@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>



                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('You are logged in!') }}

                        @role('admin')
                        <p>This is visible to users with the admin role. Gets translated to
                            \Laratrust::hasRole('admin')</p>
                        @endrole

                        @role('staff')
                        <p>This is visible to users with the staff role. Gets translated to
                            \Laratrust::hasRole('staff')</p>
                        @endrole

                        @role('user')
                        <p>This is visible to users with the admin role. Gets translated to
                            \Laratrust::hasRole('user')</p>
                        @endrole
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
