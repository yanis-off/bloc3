<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Room\StoreRoomRequest;
use App\Http\Requests\Room\UpdateRoomRequest;
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

    public function store(StoreRoomRequest $request)
    {
        $room = Room::create($request->validated());

        return (new RoomResource($room))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Room $room)
    {
        return new RoomResource($room);
    }

    public function update(UpdateRoomRequest $request, Room $room)
    {
        $room->update($request->validated());

        return new RoomResource($room);
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json(null, 204);
    }
}
