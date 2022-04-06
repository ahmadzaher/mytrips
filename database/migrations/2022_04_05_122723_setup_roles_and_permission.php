<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Role;
use App\Models\Permission;

class SetupRolesAndPermission extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        // Roles
        $admin = new Role([
            'name' => 'admin',
            'display_name' => 'Admin',
            'description' => 'All Application manager'
        ]);

        $user = new Role([
            'name' => 'user',
            'display_name' => 'User',
            'description' => 'This is the client or advertiser'
        ]);

        $staff = new Role([
            'name' => 'staff',
            'display_name' => 'Staff',
            'description' => 'This user can create or confirm other users'
        ]);

        //Permissions


        $userCreate = new Permission([
            'name' => 'user-create',
            'display_name' => 'Create Users',
            'description' => 'Create Users'
        ]);
        $userCreate->save();
        $userRead = new Permission([
            'name' => 'user-read',
            'display_name' => 'Read Users',
            'description' => 'Read Users'
        ]);
        $userRead->save();
        $userUpdate = new Permission([
            'name' => 'user-update',
            'display_name' => 'Update Users',
            'description' => 'Update Users'
        ]);
        $userUpdate->save();
        $userDelete = new Permission([
            'name' => 'user-delete',
            'display_name' => 'Delete Users',
            'description' => 'Delete Users'
        ]);
        $userDelete->save();




        $advertisementCreate = new Permission([
            'name' => 'advertisement-create',
            'display_name' => 'Create Advertisement',
            'description' => 'Create Advertisement'
        ]);
        $advertisementCreate->save();
        $advertisementRead = new Permission([
            'name' => 'advertisement-read',
            'display_name' => 'Read Advertisement',
            'description' => 'Read Advertisement'
        ]);
        $advertisementRead->save();
        $advertisementUpdate = new Permission([
            'name' => 'advertisement-update',
            'display_name' => 'Update Advertisement',
            'description' => 'Update Advertisement'
        ]);
        $advertisementUpdate->save();
        $advertisementDelete = new Permission([
            'name' => 'advertisement-delete',
            'display_name' => 'Delete Advertisement',
            'description' => 'Delete Advertisement'
        ]);
        $advertisementDelete->save();


        $allowedPackageCreate = new Permission([
            'name' => 'allowed-package-create',
            'display_name' => 'Create allowed packages',
            'description' => 'Create allowed packages'
        ]);
        $allowedPackageCreate->save();
        $allowedPackageRead = new Permission([
            'name' => 'allowed-package-read',
            'display_name' => 'Read allowed packages',
            'description' => 'Read allowed packages'
        ]);
        $allowedPackageRead->save();
        $allowedPackageUpdate = new Permission([
            'name' => 'allowed-package-update',
            'display_name' => 'Update allowed packages',
            'description' => 'Update allowed packages'
        ]);
        $allowedPackageUpdate->save();
        $allowedPackageDelete = new Permission([
            'name' => 'allowed-package-delete',
            'display_name' => 'Delete allowed packages',
            'description' => 'Delete allowed packages'
        ]);
        $allowedPackageDelete->save();

        $admin->save();
        $admin->attachPermissions([
            $advertisementCreate,
            $advertisementDelete,
            $advertisementRead,
            $advertisementUpdate,
            $userCreate,
            $userDelete,
            $userRead,
            $userUpdate,
            $allowedPackageCreate,
            $allowedPackageDelete,
            $allowedPackageRead,
            $allowedPackageUpdate
        ]);
        $user->save();

        $user->attachPermissions([
            $advertisementCreate,
            $advertisementDelete,
            $advertisementRead,
            $advertisementUpdate,
            $allowedPackageCreate,
            $allowedPackageDelete,
            $allowedPackageRead,
            $allowedPackageUpdate
        ]);
        $staff->save();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
