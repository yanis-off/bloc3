<?php

namespace Database\Seeders;

use App\Models\Film;
use App\Models\Room;
use App\Models\Screening;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ScreeningSeeder extends Seeder
{
    public function run(): void
    {
        $films = Film::where('status', 'showing')->get();
        $rooms = Room::all();

        $times = ['14:00', '17:30', '20:30'];
        $daysAhead = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        foreach ($daysAhead as $i => $offset) {
            $film = $films[$i % $films->count()];
            $room = $rooms[$i % $rooms->count()];

            Screening::create([
                'date'            => Carbon::today()->addDays($offset)->toDateString(),
                'time'            => $times[$i % count($times)],
                'seats_remaining' => $room->capacity,
                'id_film'         => $film->id_film,
                'id_room'         => $room->id_room,
            ]);
        }
    }
}
