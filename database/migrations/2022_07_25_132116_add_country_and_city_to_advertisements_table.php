<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCountryAndCityToAdvertisementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->integer('from_country');
            $table->integer('from_city');
            $table->integer('to_country');
            $table->integer('to_city');
            $table->dropColumn('from');
            $table->dropColumn('to');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropColumn('from_country');
            $table->dropColumn('from_city');
            $table->dropColumn('to_country');
            $table->dropColumn('to_city');
            $table->string('from');
            $table->string('to');
        });
    }
}
