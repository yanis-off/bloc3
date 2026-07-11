<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Seeder dédié à l'AUDIT DE PERFORMANCE.
 *
 * Génère un volume réaliste de films (2000) afin de mesurer le comportement
 * des endpoints qui ne sont pas paginés (GET /api/films charge actuellement
 * l'intégralité de la table en mémoire via un "select * from films").
 *
 * Usage :
 *   php artisan db:seed --class=LoadTestFilmSeeder
 *
 * Nettoyage (revenir aux données de démo) :
 *   php artisan migrate:fresh --seed
 *
 * ATTENTION : ne jamais exécuter ce seeder en production.
 */
class LoadTestFilmSeeder extends Seeder
{
    public function run(): void
    {
        $nbFilms = 2000;

        // On récupère les catégories existantes pour respecter la clé étrangère.
        $categoryIds = DB::table('categories')->pluck('id_category')->toArray();

        if (empty($categoryIds)) {
            $this->command->error('Aucune catégorie en base. Lancez d\'abord : php artisan db:seed');
            return;
        }

        $this->command->info("Génération de {$nbFilms} films pour le test de charge...");

        $now = Carbon::now();
        $batch = [];
        $batchSize = 500; // insertion par lots pour éviter de saturer la mémoire

        for ($i = 1; $i <= $nbFilms; $i++) {
            $batch[] = [
                'title'         => "Film de charge #{$i}",
                'synopsis'      => 'Synopsis généré automatiquement pour le test de performance. '
                                 . str_repeat('Contenu de remplissage. ', 10),
                'duration_min'  => rand(80, 180),
                'poster'        => "https://picsum.photos/seed/loadtest{$i}/400/600",
                'actors'        => 'Acteur A, Acteur B, Acteur C',
                'director'      => 'Réalisateur ' . rand(1, 50),
                'trailer_url'   => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'release_date'  => $now->copy()->subDays(rand(0, 3000))->toDateString(),
                'status'        => rand(0, 1) ? 'showing' : 'coming_soon',
                'id_category'   => $categoryIds[array_rand($categoryIds)],
                'created_at'    => $now,
                'updated_at'    => $now,
            ];

            if (count($batch) >= $batchSize) {
                DB::table('films')->insert($batch);
                $batch = [];
                $this->command->info("  ... {$i} films insérés");
            }
        }

        if (!empty($batch)) {
            DB::table('films')->insert($batch);
        }

        $total = DB::table('films')->count();
        $this->command->info("Terminé. Nombre total de films en base : {$total}");
    }
}
