<?php

namespace App\Http\Requests\Category;

/**
 * Herite de StoreCategoryRequest : seule la regle "unique" differe
 * (il faut ignorer la categorie elle-meme lors de la modification).
 */
class UpdateCategoryRequest extends StoreCategoryRequest
{
    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'name' => 'required|string|max:100|unique:categories,name,' . $category->id_category . ',id_category',
        ];
    }
}
