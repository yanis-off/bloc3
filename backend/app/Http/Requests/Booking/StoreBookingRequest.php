<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'seats_count'  => 'required|integer|min:1',
            'id_screening' => 'required|exists:screenings,id_screening',
        ];
    }

    public function messages(): array
    {
        return [
            'seats_count.required'  => 'Le nombre de places est obligatoire.',
            'seats_count.min'       => 'Vous devez réserver au moins 1 place.',
            'id_screening.required' => 'La séance est obligatoire.',
            'id_screening.exists'   => 'Cette séance n\'existe pas.',
        ];
    }
}
