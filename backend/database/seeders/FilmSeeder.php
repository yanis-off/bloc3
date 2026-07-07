<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Film;
use Illuminate\Database\Seeder;

class FilmSeeder extends Seeder
{
    public function run(): void
    {
        $films = [
            [
                'title'        => 'The Last Horizon',
                'synopsis'     => 'An epic adventure across the universe.',
                'duration_min' => 120,
                'actors'       => 'John Doe, Jane Smith',
                'director'     => 'Marc Fontaine',
                'release_date' => '2026-01-10',
                'status'       => 'showing',
                'category'     => 'Science-fiction',
                'poster'       => 'https://picsum.photos/seed/last-horizon/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Silent Waves',
                'synopsis'     => 'A drama about loss and redemption.',
                'duration_min' => 95,
                'actors'       => 'Alice Brown, Bob White',
                'director'     => 'Julien Moreau',
                'release_date' => '2025-11-02',
                'status'       => 'showing',
                'category'     => 'Drame',
                'poster'       => 'https://picsum.photos/seed/silent-waves/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Laughter Road',
                'synopsis'     => 'A comedy about a road trip gone wrong.',
                'duration_min' => 105,
                'actors'       => 'Chris Green, Paul Martin',
                'director'     => 'Sophie Lambert',
                'release_date' => '2026-08-15',
                'status'       => 'coming_soon',
                'category'     => 'Comédie',
                'poster'       => 'https://picsum.photos/seed/laughter-road/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Midnight Chase',
                'synopsis'     => 'A detective races against time to catch a serial thief.',
                'duration_min' => 110,
                'actors'       => 'Tom Reed, Nina Cole',
                'director'     => 'Étienne Rousseau',
                'release_date' => '2025-09-20',
                'status'       => 'showing',
                'category'     => 'Thriller',
                'poster'       => 'https://picsum.photos/seed/midnight-chase/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Whispers in the Dark',
                'synopsis'     => 'A family moves into a house haunted by its past.',
                'duration_min' => 98,
                'actors'       => 'Laura Bennett, Mike Ford',
                'director'     => 'Claire Dubois',
                'release_date' => '2026-10-31',
                'status'       => 'coming_soon',
                'category'     => 'Horreur',
                'poster'       => 'https://picsum.photos/seed/whispers-dark/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Kingdom of Embers',
                'synopsis'     => 'A young heir must reclaim her throne from a rival kingdom.',
                'duration_min' => 135,
                'actors'       => 'Elena Cruz, Marcus Lee',
                'director'     => 'Antoine Girard',
                'release_date' => '2026-03-14',
                'status'       => 'showing',
                'category'     => 'Fantastique',
                'poster'       => 'https://picsum.photos/seed/kingdom-embers/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Two Hearts, One City',
                'synopsis'     => 'Two strangers keep crossing paths in a bustling metropolis.',
                'duration_min' => 102,
                'actors'       => 'Sarah Wilson, David Kim',
                'director'     => 'Camille Perrin',
                'release_date' => '2025-12-25',
                'status'       => 'showing',
                'category'     => 'Romance',
                'poster'       => 'https://picsum.photos/seed/two-hearts/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'The Lost Expedition',
                'synopsis'     => 'A team of explorers searches for a legendary lost city.',
                'duration_min' => 128,
                'actors'       => 'Ryan Cooper, Zoe Adams',
                'director'     => 'Hugo Lefevre',
                'release_date' => '2026-06-05',
                'status'       => 'showing',
                'category'     => 'Aventure',
                'poster'       => 'https://picsum.photos/seed/lost-expedition/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Circuit Breaker',
                'synopsis'     => 'A rogue AI threatens to take control of the world\'s networks.',
                'duration_min' => 115,
                'actors'       => 'Kevin Zhao, Amara Okafor',
                'director'     => 'Nadia Petit',
                'release_date' => '2026-09-18',
                'status'       => 'coming_soon',
                'category'     => 'Action',
                'poster'       => 'https://picsum.photos/seed/circuit-breaker/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
            [
                'title'        => 'Paws and Effect',
                'synopsis'     => 'A group of talking animals band together to save their forest home.',
                'duration_min' => 88,
                'actors'       => 'Voice cast ensemble',
                'director'     => 'Lucie Faure',
                'release_date' => '2026-07-01',
                'status'       => 'showing',
                'category'     => 'Animation',
                'poster'       => 'https://picsum.photos/seed/paws-effect/400/600',
                'trailer_url'  => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ],
        ];

        foreach ($films as $film) {
            $category = Category::where('name', $film['category'])->first();
            unset($film['category']);
            $film['id_category'] = $category?->id_category;

            Film::create($film);
        }
    }
}
