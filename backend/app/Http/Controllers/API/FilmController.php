<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Film\StoreFilmRequest;
use App\Http\Requests\Film\UpdateFilmRequest;
use App\Http\Resources\FilmResource;
use App\Models\Film;
use Illuminate\Http\Request;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        return FilmResource::collection(
            Film::with('category')->paginate($perPage)
        );
    }

    public function store(StoreFilmRequest $request)
    {
        $film = Film::create($request->validated());

        return (new FilmResource($film->load('category')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Film $film)
    {
        return new FilmResource($film->load('category'));
    }

    public function update(UpdateFilmRequest $request, Film $film)
    {
        $film->update($request->validated());

        return new FilmResource($film->load('category'));
    }

    public function destroy(Film $film)
    {
        $film->delete();

        return response()->json(null, 204);
    }
}
