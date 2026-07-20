<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Film;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilmTest extends TestCase
{
    use RefreshDatabase;

    // ── Public endpoints ──────────────────────────────────────────────────────

    public function test_anyone_can_list_films(): void
    {
        Film::factory()->count(3)->create();

        $this->getJson('/api/films')
             ->assertStatus(200)
             ->assertJsonCount(3, 'data');
    }

    public function test_films_list_is_paginated(): void
    {
        // Regression P1-10 : /api/films doit etre pagine (payload borne
        // meme si le catalogue grandit), avec les metadonnees exposees.
        Film::factory()->count(20)->create();

        $response = $this->getJson('/api/films?per_page=5')
                         ->assertStatus(200);

        $this->assertCount(5, $response->json('data'));
        $this->assertSame(20, $response->json('meta.total'));
        $this->assertSame(4, $response->json('meta.last_page'));
    }

    public function test_anyone_can_view_a_single_film(): void
    {
        $film = Film::factory()->create(['title' => 'Lost Horizon']);

        $this->getJson("/api/films/{$film->id_film}")
             ->assertStatus(200)
             ->assertJsonPath('title', 'Lost Horizon');
    }

    public function test_viewing_nonexistent_film_returns_404(): void
    {
        $this->getJson('/api/films/9999')->assertStatus(404);
    }

    // ── Admin CRUD ────────────────────────────────────────────────────────────

    public function test_admin_can_create_a_film(): void
    {
        $admin    = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/films', [
                'title'        => 'Nouveau Film',
                'synopsis'     => 'Un synopsis.',
                'duration_min' => 120,
                'actors'       => 'Acteur A, Acteur B',
                'director'     => 'Réalisateur X',
                'release_date' => '2025-06-01',
                'status'       => 'showing',
                'id_category'  => $category->id_category,
                'poster'       => 'https://example.com/poster.jpg',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('films', ['title' => 'Nouveau Film']);
    }

    public function test_admin_can_update_a_film(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $film  = Film::factory()->create(['title' => 'Ancien Titre', 'status' => 'showing']);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/films/{$film->id_film}", [
                 'title'  => 'Nouveau Titre',
                 'status' => 'showing', // <-- Ajout du champ obligatoire requis pour la validation
             ])
             ->assertStatus(200)
             ->assertJsonPath('title', 'Nouveau Titre');
    }

    public function test_admin_can_delete_a_film(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $film  = Film::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/films/{$film->id_film}")
             ->assertStatus(204);

        // Soft delete : la ligne existe toujours en base (deleted_at renseigne),
        // elle disparait seulement des requetes/listes par defaut.
        $this->assertSoftDeleted('films', ['id_film' => $film->id_film]);
    }

    public function test_deleting_a_film_does_not_cascade_delete_its_screenings(): void
    {
        // Regression : avant l'ajout du Soft Delete, supprimer un film
        // supprimait silencieusement en cascade ses seances (et leurs
        // reservations), via la contrainte cascadeOnDelete() en base.
        // Le Soft Delete remplace le DELETE SQL par un simple UPDATE
        // (deleted_at), qui ne declenche plus cette cascade.
        $admin     = User::factory()->create(['role' => 'admin']);
        $film      = Film::factory()->create();
        $screening = Screening::factory()->create(['id_film' => $film->id_film]);

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/films/{$film->id_film}")
             ->assertStatus(204);

        $this->assertDatabaseHas('screenings', ['id_screening' => $screening->id_screening]);
    }

    public function test_deleted_film_does_not_appear_in_public_list(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $film  = Film::factory()->create();

        $this->actingAs($admin, 'sanctum')->deleteJson("/api/films/{$film->id_film}");

        $response = $this->getJson('/api/films');
        $response->assertJsonMissing(['id_film' => $film->id_film]);
    }

    // ── Authorization ─────────────────────────────────────────────────────────

    public function test_regular_user_cannot_create_film(): void
    {
        $user     = User::factory()->create(['role' => 'user']);
        $category = Category::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/films', [
                 'title'        => 'Film Interdit',
                 'duration_min' => 90,
                 'status'       => 'showing',
                 'id_category'  => $category->id_category,
             ])
             ->assertStatus(403);
    }

    public function test_guest_cannot_create_film(): void
    {
        $this->postJson('/api/films', ['title' => 'Test'])->assertStatus(401);
    }

    // ── Film status filter ────────────────────────────────────────────────────

    public function test_films_list_includes_status_field(): void
    {
        Film::factory()->showing()->create();
        Film::factory()->comingSoon()->create();

        $films = $this->getJson('/api/films')
                      ->assertStatus(200)
                      ->json();

        $statuses = collect($films)->pluck('status')->unique()->sort()->values()->toArray();
        $this->assertContains('showing', $statuses);
        $this->assertContains('coming_soon', $statuses);
    }
}
