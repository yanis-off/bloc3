<?php

namespace App\Http\Requests\Film;

use Illuminate\Foundation\Http\FormRequest;

class StoreFilmRequest extends FormRequest
{
    /**
     * Autorisation deja geree par le middleware 'admin' sur la route.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'        => 'required|string|max:255',
            'synopsis'     => 'nullable|string',
            'duration_min' => 'nullable|integer|min:1',
            'poster'       => 'nullable|url|max:2048',
            'actors'       => 'nullable|string',
            'director'     => 'nullable|string|max:255',
            'release_date' => 'nullable|date',
            'status'       => 'required|in:showing,coming_soon',
            'id_category'  => 'nullable|exists:categories,id_category',
            'trailer_url'  => 'nullable|url|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'        => 'Le titre du film est obligatoire.',
            'title.max'              => 'Le titre ne peut pas dépasser 255 caractères.',
            'duration_min.integer'   => 'La durée doit être un nombre entier de minutes.',
            'duration_min.min'       => 'La durée doit être d\'au moins 1 minute.',
            'poster.url'             => 'L\'affiche doit être une URL valide (ex. https://...).',
            'director.max'           => 'Le nom du réalisateur ne peut pas dépasser 255 caractères.',
            'release_date.date'      => 'La date de sortie doit être une date valide.',
            'status.required'        => 'Le statut du film est obligatoire.',
            'status.in'              => 'Le statut doit être "à l\'affiche" ou "bientôt disponible".',
            'id_category.exists'     => 'La catégorie sélectionnée n\'existe pas.',
            'trailer_url.url'        => 'Le lien de la bande-annonce doit être une URL valide.',
        ];
    }
}
