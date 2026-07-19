<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScreeningResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_screening'    => $this->id_screening,
            'date'            => $this->date,
            'time'            => $this->time,
            'seats_remaining' => $this->seats_remaining,
            'id_film'         => $this->id_film,
            'id_room'         => $this->id_room,
            'film'            => new FilmResource($this->whenLoaded('film')),
            'room'            => new RoomResource($this->whenLoaded('room')),
        ];
    }
}
