<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Screening\StoreScreeningRequest;
use App\Http\Requests\Screening\UpdateScreeningRequest;
use App\Http\Resources\ScreeningResource;
use App\Models\Screening;
use Illuminate\Http\Request;

class ScreeningController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        $query = Screening::with(['film', 'room']);

        // Filtre optionnel : utilise par FilmDetail.jsx pour ne recuperer
        // que les seances du film consulte, plutot que de tout charger
        // puis filtrer cote client.
        if ($request->filled('id_film')) {
            $query->where('id_film', $request->query('id_film'));
        }

        return ScreeningResource::collection(
            $query->orderBy('date')->orderBy('time')->paginate($perPage)
        );
    }

    public function store(StoreScreeningRequest $request)
    {
        $screening = Screening::create($request->validated());

        return (new ScreeningResource($screening->load(['film', 'room'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Screening $screening)
    {
        return new ScreeningResource($screening->load(['film', 'room']));
    }

    public function update(UpdateScreeningRequest $request, Screening $screening)
    {
        $screening->update($request->validated());

        return new ScreeningResource($screening->load(['film', 'room']));
    }

    public function destroy(Screening $screening)
    {
        $screening->delete();

        return response()->json(null, 204);
    }
}
