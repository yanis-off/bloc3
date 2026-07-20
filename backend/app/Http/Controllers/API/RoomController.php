<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        return RoomResource::collection(Room::paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100|unique:rooms,name',
            'capacity' => 'required|integer|min:1',
            'format' => 'required|in:standard,imax,vip',
            'price'  => 'required|numeric|min:0',
        ]);

        $room = Room::create($validated);

        return (new RoomResource($room))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Room $room)
    {
        return new RoomResource($room);
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100|unique:rooms,name,' . $room->id_room . ',id_room',
            'capacity' => 'required|integer|min:1',
            'format' => 'required|in:standard,imax,vip',
            'price'  => 'required|numeric|min:0',
        ]);

        $room->update($validated);

        return new RoomResource($room);
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json(null, 204);
    }
}
