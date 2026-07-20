<?php

namespace App\Http\Requests\Screening;

use Illuminate\Foundation\Http\FormRequest;

class StoreScreeningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date'            => 'required|date',
            'time'            => 'required|date_format:H:i',
            'seats_remaining' => 'required|integer|min:0',
            'id_film'         => 'required|exists:films,id_film',
            'id_room'         => 'required|exists:rooms,id_room',
        ];
    }

    public function messages(): array
    {
        return [
            'date.required'            => 'La date de la séance est obligatoire.',
            'date.date'                => 'La date doit être une date valide.',
            'time.required'            => 'L\'heure de la séance est obligatoire.',
            'time.date_format'         => 'L\'heure doit être au format HH:MM.',
            'seats_remaining.required' => 'Le nombre de places est obligatoire.',
            'seats_remaining.min'      => 'Le nombre de places ne peut pas être négatif.',
            'id_film.required'         => 'Le film est obligatoire.',
            'id_film.exists'           => 'Le film sélectionné n\'existe pas.',
            'id_room.required'         => 'La salle est obligatoire.',
            'id_room.exists'           => 'La salle sélectionnée n\'existe pas.',
        ];
    }
}
