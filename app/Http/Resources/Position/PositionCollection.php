<?php

namespace App\Http\Resources\Position;

use Illuminate\Http\Resources\Json\JsonResource;

class PositionCollection extends JsonResource
{
    public function toArray($request)
    {
        return [
            'data' => PositionResource::collection($this->collection),
        ];
    }
}
