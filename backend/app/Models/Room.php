<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'id_room';

    protected $fillable = [
        'name',
        'capacity',
        'format',
        'price',
    ];

    public function screenings()
    {
        return $this->hasMany(Screening::class, 'id_room', 'id_room');
    }
}
