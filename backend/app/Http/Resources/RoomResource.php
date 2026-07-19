<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_room'  => $this->id_room,
            'name'     => $this->name,
            'capacity' => $this->capacity,
            'format'   => $this->format,
            'price'    => $this->price,
        ];
    }
}
