<?php

namespace App\Http\Requests\Film;

/**
 * Les regles de modification sont identiques a la creation pour Film :
 * on herite directement de StoreFilmRequest plutot que de dupliquer
 * le tableau de regles (anomalie "validation dupliquee" corrigee ici).
 */
class UpdateFilmRequest extends StoreFilmRequest
{
}
