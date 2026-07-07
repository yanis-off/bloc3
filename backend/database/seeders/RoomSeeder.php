<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            ['name' => 'Salle 1', 'capacity' => 120, 'format' => 'standard', 'price' => 9.00],
            ['name' => 'Salle 2', 'capacity' => 90,  'format' => 'standard', 'price' => 9.00],
            ['name' => 'Salle 3', 'capacity' => 150, 'format' => 'imax',     'price' => 14.00],
            ['name' => 'Salle 4', 'capacity' => 80,  'format' => 'standard', 'price' => 9.00],
            ['name' => 'Salle 5', 'capacity' => 60,  'format' => 'vip',      'price' => 22.00],
            ['name' => 'Salle 6', 'capacity' => 100, 'format' => 'standard', 'price' => 9.00],
            ['name' => 'Salle 7', 'capacity' => 200, 'format' => 'imax',     'price' => 14.00],
            ['name' => 'Salle 8', 'capacity' => 70,  'format' => 'vip',      'price' => 22.00],
            ['name' => 'Salle 9', 'capacity' => 110, 'format' => 'standard', 'price' => 9.00],
            ['name' => 'Salle 10', 'capacity' => 130, 'format' => 'imax',    'price' => 14.00],
        ];

        foreach ($rooms as $room) {
            Room::create($room);
        }
    }
}
