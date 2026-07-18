<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AccountDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_delete_own_account(): void
    {
        $user = User::factory()->create(['password' => Hash::make('password')]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/user', ['current_password' => 'password']);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertStringContainsString('anonymized.local', $user->email);
        $this->assertSame('Utilisateur', $user->first_name);
        $this->assertSame('Supprimé', $user->last_name);
    }

    public function test_deleting_account_requires_correct_password(): void
    {
        $user = User::factory()->create([
            'email'    => 'still.here@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/user', ['current_password' => 'wrong-password']);

        $response->assertStatus(422);

        $user->refresh();
        $this->assertSame('still.here@example.com', $user->email);
    }

    public function test_guest_cannot_delete_account(): void
    {
        $this->deleteJson('/api/user', ['current_password' => 'password'])
             ->assertStatus(401);
    }

    public function test_deleting_account_preserves_booking_history(): void
    {
        $user      = User::factory()->create(['password' => Hash::make('password')]);
        $screening = Screening::factory()->create(['seats_remaining' => 50]);
        $booking   = Booking::factory()->create([
            'id_user'      => $user->id,
            'id_screening' => $screening->id_screening,
        ]);

        $this->actingAs($user, 'sanctum')
             ->deleteJson('/api/user', ['current_password' => 'password'])
             ->assertStatus(200);

        // La reservation n'est pas supprimee en cascade : seule l'identite
        // du compte est anonymisee, l'historique de reservation est preserve.
        $this->assertDatabaseHas('bookings', [
            'id_booking' => $booking->id_booking,
            'id_user'    => $user->id,
        ]);
    }

    public function test_deleting_account_revokes_all_tokens(): void
    {
        $user = User::factory()->create(['password' => Hash::make('password')]);
        $user->createToken('device-1');
        $user->createToken('device-2');

        $this->assertSame(2, $user->tokens()->count());

        $this->actingAs($user, 'sanctum')
             ->deleteJson('/api/user', ['current_password' => 'password'])
             ->assertStatus(200);

        $this->assertSame(0, $user->tokens()->count());
    }
}
