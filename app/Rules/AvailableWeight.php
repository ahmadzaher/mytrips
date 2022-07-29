<?php

namespace App\Rules;

use App\Models\Advertisement;
use Illuminate\Contracts\Validation\Rule;

class AvailableWeight implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public $available_weight = 0;

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $this->available_weight = $available_weight = Advertisement::available_weight($_REQUEST['advertisement_id']);
        $order_weight = $_REQUEST['weight'];
        return $order_weight <= $available_weight;
    }


    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The weight must be equal or less than ' . $this->available_weight . ' Kg';
    }
}
