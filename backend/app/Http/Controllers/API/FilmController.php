<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\FilmResource;
use App\Models\Film;
use Illuminate\Http\Request;

class FilmController extends Controller
{
    public function index()
    {
        return FilmResource::collection(
            Film::with('category')->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'synopsis'     => 'nullable|string',
            'duration_min' => 'nullable|integer|min:1',
            'poster'       => 'nullable|url|max:2048',
            'actors'       => 'nullable|string',
            'director' => 'nullable|string|max:255',
            'release_date' => 'nullable|date',
            'status'       => 'required|in:showing,coming_soon',
            'id_category'  => 'nullable|exists:categories,id_category',
            'trailer_url' => 'nullable|url|max:500',
        ]);

        $film = Film::create($validated);

        return (new FilmResource($film->load('category')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Film $film)
    {
        return new FilmResource($film->load('category'));
    }

    public function update(Request $request, Film $film)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'synopsis'     => 'nullable|string',
            'duration_min' => 'nullable|integer|min:1',
            'poster'       => 'nullable|url|max:2048',
            'actors'       => 'nullable|string',
            'director' => 'nullable|string|max:255',
            'release_date' => 'nullable|date',
            'status'       => 'required|in:showing,coming_soon',
            'id_category'  => 'nullable|exists:categories,id_category',
            'trailer_url' => 'nullable|url|max:500',
        ]);

        $film->update($validated);

        return new FilmResource($film->load('category'));
    }

    public function destroy(Film $film)
    {
        $film->delete();

        return response()->json(null, 204);
    }
}
