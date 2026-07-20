<?php

namespace App\Http\Requests\Room;

class UpdateRoomRequest extends StoreRoomRequest
{
    public function rules(): array
    {
        $room = $this->route('room');

        return [
            'name'     => 'required|string|max:100|unique:rooms,name,' . $room->id_room . ',id_room',
            'capacity' => 'required|integer|min:1',
            'format'   => 'required|in:standard,imax,vip',
            'price'    => 'required|numeric|min:0',
        ];
    }
}
