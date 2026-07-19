<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class FilmResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_film'      => $this->id_film,
            'title'        => $this->title,
            'synopsis'     => $this->synopsis,
            'duration_min' => $this->duration_min,
            'poster'       => $this->poster,
            'actors'       => $this->actors,
            'director'     => $this->director,
            'release_date' => $this->release_date,
            'trailer_url'  => $this->trailer_url,
            'status'       => $this->status,
            'category'     => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}
