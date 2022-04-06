<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdvertisementsAllowedPackagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advertisements_allowed_packages', function (Blueprint $table) {

            $table->unsignedBigInteger('advertisement_id');
            $table->unsignedBigInteger('allowed_package_id');
            //FOREIGN KEY CONSTRAINTS
            $table->foreign('advertisement_id')->references('id')->on('advertisements')->onDelete('cascade');
            $table->foreign('allowed_package_id')->references('id')->on('allowed_packages')->onDelete('cascade');

            //SETTING THE PRIMARY KEYS
            $table->primary(['advertisement_id','allowed_package_id'], 'allowed_packages_advertisement');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('advertisements_allowed_packages');
    }
}
