<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    // ── Create ────────────────────────────────────────────────────────────────

    public function test_authenticated_user_can_create_booking(): void
    {
        $user      = User::factory()->create(['role' => 'user']);
        $screening = Screening::factory()->create(['seats_remaining' => 50]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/bookings', [
                'id_screening' => $screening->id_screening,
                'seats_count'  => 2,
            ]);

        $response->assertStatus(201)
                 ->assertJsonPath('status', 'pending')
                 ->assertJsonPath('seats_count', 2);

        $this->assertDatabaseHas('bookings', [
            'id_user'      => $user->id,
            'id_screening' => $screening->id_screening,
            'seats_count'  => 2,
        ]);
    }

    public function test_booking_decrements_seats_remaining(): void
    {
        $user      = User::factory()->create(['role' => 'user']);
        $screening = Screening::factory()->create(['seats_remaining' => 50]);

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/bookings', [
                 'id_screening' => $screening->id_screening,
                 'seats_count'  => 3,
             ])->assertStatus(201);

        $this->assertDatabaseHas('screenings', [
            'id_screening'    => $screening->id_screening,
            'seats_remaining' => 47,
        ]);
    }

    public function test_cannot_book_more_seats_than_available(): void
    {
        $user      = User::factory()->create(['role' => 'user']);
        $screening = Screening::factory()->create(['seats_remaining' => 2]);

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/bookings', [
                 'id_screening' => $screening->id_screening,
                 'seats_count'  => 5,
             ])->assertStatus(422);
    }

    public function test_cannot_overbook_a_screening_down_to_the_last_seat(): void
    {
        // Regression P1-03 : sans transaction + verrou, deux reservations
        // qui lisent seats_remaining avant que l'une des deux ne le decremente
        // pouvaient toutes les deux passer, menant a un seats_remaining negatif.
        // Ce test verifie le scenario sequentiel equivalent : une fois la
        // capacite epuisee par une premiere reservation, la suivante doit
        // etre refusee meme si elle demande une seule place.
        $user1     = User::factory()->create(['role' => 'user']);
        $user2     = User::factory()->create(['role' => 'user']);
        $screening = Screening::factory()->create(['seats_remaining' => 1]);

        $this->actingAs($user1, 'sanctum')
             ->postJson('/api/bookings', [
                 'id_screening' => $screening->id_screening,
                 'seats_count'  => 1,
             ])->assertStatus(201);

        $this->actingAs($user2, 'sanctum')
             ->postJson('/api/bookings', [
                 'id_screening' => $screening->id_screening,
                 'seats_count'  => 1,
             ])->assertStatus(422);

        $this->assertDatabaseHas('screenings', [
            'id_screening'    => $screening->id_screening,
            'seats_remaining' => 0,
        ]);

        // Une seule reservation doit exister, jamais deux places vendues
        // pour une seule place disponible.
        $this->assertEquals(
            1,
            Booking::where('id_screening', $screening->id_screening)->count()
        );
    }

    public function test_guest_cannot_create_booking(): void
    {
        $screening = Screening::factory()->create();

        $this->postJson('/api/bookings', [
            'id_screening' => $screening->id_screening,
            'seats_count'  => 1,
        ])->assertStatus(401);
    }

    public function test_booking_has_expiry_set_correctly(): void
    {
        $user = User::factory()->create();
        $screening = Screening::factory()->create([
            'date'            => now()->addDay()->format('Y-m-d'),
            'time'            => '20:00:00',
            'seats_remaining' => 50,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/bookings', [
                'id_screening' => $screening->id_screening,
                'seats_count'  => 1,
            ])->assertStatus(201);

        // expires_at doit être 3h avant la séance
        $expectedExpiry = \Carbon\Carbon::parse(
            $screening->date . ' ' . $screening->time
        )->subHours(3);

        $actualExpiry = \Carbon\Carbon::parse($response->json('expires_at'));
        $this->assertTrue($expectedExpiry->diffInMinutes($actualExpiry) < 2);
    }

    // ── List ──────────────────────────────────────────────────────────────────

    public function test_user_only_sees_own_bookings(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Booking::factory()->create(['id_user' => $user1->id]);
        Booking::factory()->create(['id_user' => $user1->id]);
        Booking::factory()->create(['id_user' => $user2->id]);

        $response = $this->actingAs($user1, 'sanctum')
                         ->getJson('/api/bookings')
                         ->assertStatus(200);

        $this->assertCount(2, $response->json('data'));
    }

    public function test_admin_sees_all_bookings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Booking::factory()->create(['id_user' => $user1->id]);
        Booking::factory()->create(['id_user' => $user2->id]);

        $response = $this->actingAs($admin, 'sanctum')
                         ->getJson('/api/bookings')
                         ->assertStatus(200);

        $this->assertCount(2, $response->json('data'));
    }

    public function test_bookings_list_is_paginated(): void
    {
        // Regression P1-10 : /api/bookings doit etre pagine (payload
        // borne meme si le volume de reservations augmente), avec les
        // metadonnees de pagination exposees.
        $user = User::factory()->create();
        Booking::factory()->count(20)->create(['id_user' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
                         ->getJson('/api/bookings?per_page=5')
                         ->assertStatus(200);

        $this->assertCount(5, $response->json('data'));
        $this->assertSame(20, $response->json('meta.total'));
        $this->assertSame(4, $response->json('meta.last_page'));
    }

    // ── View (show) ──────────────────────────────────────────────────────────

    public function test_user_can_view_own_booking(): void
    {
        $user    = User::factory()->create();
        $booking = Booking::factory()->create(['id_user' => $user->id]);

        $this->actingAs($user, 'sanctum')
             ->getJson("/api/bookings/{$booking->id_booking}")
             ->assertStatus(200)
             ->assertJsonPath('id_booking', $booking->id_booking);
    }

    public function test_user_cannot_view_another_users_booking(): void
    {
        $user1   = User::factory()->create();
        $user2   = User::factory()->create();
        $booking = Booking::factory()->create(['id_user' => $user2->id]);

        $this->actingAs($user1, 'sanctum')
             ->getJson("/api/bookings/{$booking->id_booking}")
             ->assertStatus(403);
    }

    public function test_admin_can_view_any_booking(): void
    {
        $admin   = User::factory()->create(['role' => 'admin']);
        $user    = User::factory()->create();
        $booking = Booking::factory()->create(['id_user' => $user->id]);

        $this->actingAs($admin, 'sanctum')
             ->getJson("/api/bookings/{$booking->id_booking}")
             ->assertStatus(200);
    }

    // ── Cancel (destroy) ──────────────────────────────────────────────────────

    public function test_user_can_cancel_own_booking_and_seats_are_restored(): void
    {
        $user      = User::factory()->create();
        $screening = Screening::factory()->create(['seats_remaining' => 48]);
        $booking   = Booking::factory()->create([
            'id_user'      => $user->id,
            'id_screening' => $screening->id_screening,
            'seats_count'  => 2,
            'status'       => 'pending',
        ]);

        $this->actingAs($user, 'sanctum')
             ->deleteJson("/api/bookings/{$booking->id_booking}")
             ->assertStatus(204);

        $this->assertDatabaseMissing('bookings', ['id_booking' => $booking->id_booking]);
        $this->assertDatabaseHas('screenings', [
            'id_screening'    => $screening->id_screening,
            'seats_remaining' => 50, // 48 + 2 restored
        ]);
    }

    public function test_user_cannot_cancel_another_users_booking(): void
    {
        $user1   = User::factory()->create();
        $user2   = User::factory()->create();
        $booking = Booking::factory()->create(['id_user' => $user2->id]);

        $this->actingAs($user1, 'sanctum')
             ->deleteJson("/api/bookings/{$booking->id_booking}")
             ->assertStatus(403);
    }

    public function test_cancelled_booking_does_not_restore_seats(): void
    {
        $user      = User::factory()->create();
        $screening = Screening::factory()->create(['seats_remaining' => 50]);
        $booking   = Booking::factory()->cancelled()->create([
            'id_user'      => $user->id,
            'id_screening' => $screening->id_screening,
            'seats_count'  => 2,
        ]);

        $this->actingAs($user, 'sanctum')
             ->deleteJson("/api/bookings/{$booking->id_booking}")
             ->assertStatus(204);

        // seats_remaining must NOT change (already restored or never decremented)
        $this->assertDatabaseHas('screenings', [
            'id_screening'    => $screening->id_screening,
            'seats_remaining' => 50,
        ]);
    }

    // ── Admin update ──────────────────────────────────────────────────────────

    public function test_admin_can_confirm_booking(): void
    {
        $admin   = User::factory()->create(['role' => 'admin']);
        $booking = Booking::factory()->create(['status' => 'pending']);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/bookings/{$booking->id_booking}", ['status' => 'confirmed'])
             ->assertStatus(200)
             ->assertJsonPath('status', 'confirmed');
    }

    public function test_admin_cancellation_restores_seats(): void
    {
        $admin     = User::factory()->create(['role' => 'admin']);
        $screening = Screening::factory()->create(['seats_remaining' => 48]);
        $booking   = Booking::factory()->create([
            'id_screening' => $screening->id_screening,
            'seats_count'  => 2,
            'status'       => 'confirmed',
        ]);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/bookings/{$booking->id_booking}", ['status' => 'cancelled'])
             ->assertStatus(200);

        $this->assertDatabaseHas('screenings', [
            'id_screening'    => $screening->id_screening,
            'seats_remaining' => 50,
        ]);
    }

    public function test_regular_user_cannot_confirm_booking(): void
    {
        $user    = User::factory()->create(['role' => 'user']);
        $booking = Booking::factory()->create(['status' => 'pending']);

        $this->actingAs($user, 'sanctum')
             ->putJson("/api/bookings/{$booking->id_booking}", ['status' => 'confirmed'])
             ->assertStatus(403);
    }
}
