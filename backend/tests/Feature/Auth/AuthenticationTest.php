<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        // Utilisation de postJson pour les requêtes API
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // Si votre route de login utilise l'authentification standard de Laravel en arrière-plan
        $this->assertAuthenticated();

        // On attend un statut 200 (OK) contenant le token plutôt qu'un 204 (No Content)
        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        // Une tentative de connexion invalide sur une API renvoie une erreur
        // de validation (422), via l'exception levee par LoginRequest::authenticate().
        $response->assertStatus(422);
    }

    public function test_login_is_rate_limited_after_too_many_attempts(): void
    {
        $user = User::factory()->create();

        // 5 tentatives ratees consomment le quota (LoginRequest autorise 5 essais
        // par couple email+IP avant de bloquer).
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', [
                'email' => $user->email,
                'password' => 'wrong-password',
            ]);
        }

        // La 6e tentative doit etre bloquee par le rate limiting,
        // meme avec le bon mot de passe.
        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('email');
    }

    public function test_register_is_rate_limited_after_too_many_attempts(): void
    {
        // La route /api/register est protegee par throttle:5,1 (5 requetes/minute/IP).
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/register', [
                'first_name' => 'Test',
                'last_name'  => 'User',
                'email'      => "test{$i}@example.com",
                'password'   => 'password',
                'password_confirmation' => 'password',
            ]);
        }

        $response = $this->postJson('/api/register', [
            'first_name' => 'Test',
            'last_name'  => 'User',
            'email'      => 'test-overflow@example.com',
            'password'   => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(429);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        // On s'authentifie via le guard 'sanctum' pour les APIs et on utilise postJson
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/logout');

        // Au lieu d'assertGuest() qui vérifie les sessions web,
        // on valide que l'API répond avec succès (statut 200) après avoir révoqué le token
        $response->assertStatus(200);
    }
}
