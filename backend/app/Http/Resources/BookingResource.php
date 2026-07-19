<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_booking'  => $this->id_booking,
            'seats_count' => $this->seats_count,
            'status'      => $this->status,
            'expires_at'  => $this->expires_at,
            'created_at'  => $this->created_at,
            'screening'   => new ScreeningResource($this->whenLoaded('screening')),
            'user'        => new UserResource($this->whenLoaded('user')),
        ];
    }
}
