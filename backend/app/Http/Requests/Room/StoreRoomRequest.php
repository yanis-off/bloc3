<?php

namespace App\Http\Requests\Room;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:100|unique:rooms,name',
            'capacity' => 'required|integer|min:1',
            'format'   => 'required|in:standard,imax,vip',
            'price'    => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Le nom de la salle est obligatoire.',
            'name.unique'       => 'Une salle porte déjà ce nom.',
            'capacity.required' => 'La capacité de la salle est obligatoire.',
            'capacity.min'      => 'La capacité doit être d\'au moins 1 place.',
            'format.required'   => 'Le format de la salle est obligatoire.',
            'format.in'         => 'Le format doit être standard, imax ou vip.',
            'price.required'    => 'Le tarif de la salle est obligatoire.',
            'price.min'         => 'Le tarif ne peut pas être négatif.',
        ];
    }
}
