<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $perPage = min(max((int) $request->query('per_page', 10), 1), 100);

        if ($user->isAdmin()) {
            return BookingResource::collection(
                Booking::with(['user', 'screening.film', 'screening.room'])
                    ->latest()
                    ->paginate($perPage)
            );
        }

        return BookingResource::collection(
            Booking::with(['screening.film', 'screening.room'])
                ->where('id_user', $user->id)
                ->latest()
                ->paginate($perPage)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'seats_count'  => 'required|integer|min:1',
            'id_screening' => 'required|exists:screenings,id_screening',
        ]);

        return DB::transaction(function () use ($validated) {
            $screening = Screening::where('id_screening', $validated['id_screening'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($screening->seats_remaining < $validated['seats_count']) {
                return response()->json([
                    'message' => 'Not enough seats available.'
                ], 422);
            }

            $screeningDateTime = \Carbon\Carbon::parse($screening->date . ' ' . $screening->time);
            $expiresAt = $screeningDateTime->subHours(3);

            if ($expiresAt->isPast()) {
                return response()->json([
                    'message' => 'Cette séance débute dans moins de 3h. Réservez sur place.'
                ], 422);
            }

            $booking = Booking::create([
                'seats_count'  => $validated['seats_count'],
                'status'       => 'pending',
                'expires_at'   => $expiresAt,
                'id_user'      => Auth::id(),
                'id_screening' => $validated['id_screening'],
            ]);

            $screening->decrement('seats_remaining', $validated['seats_count']);

            return (new BookingResource($booking->load(['screening.film', 'screening.room'])))
                ->response()
                ->setStatusCode(201);
        });
    }

    public function show(Booking $booking)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($booking->id_user !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return new BookingResource($booking->load(['screening.film', 'screening.room']));
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,expired,cancelled',
        ]);

        $oldStatus = $booking->status;
        $booking->update($validated);

        if (
            in_array($validated['status'], ['expired', 'cancelled'])
            && !in_array($oldStatus, ['expired', 'cancelled'])
        ) {
            $booking->screening->increment('seats_remaining', $booking->seats_count);
        }

        return new BookingResource($booking->load(['screening.film', 'screening.room']));
    }

    public function destroy(Booking $booking)
    {
        /** @var User $user */
        $user = Auth::user();

        if ($booking->id_user !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!in_array($booking->status, ['expired', 'cancelled'])) {
            $booking->screening->increment('seats_remaining', $booking->seats_count);
        }

        $booking->delete();

        return response()->json(null, 204);
    }
}
