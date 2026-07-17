<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_booking
 * @property int $seats_count
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property int $id_user
 * @property int $id_screening
 * @property \Illuminate\Support\Carbon $created_at
 * @property \Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Screening $screening
 *
 * @method static \Database\Factories\BookingFactory factory($count = null, $state = [])
 */
class Booking extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_booking';

    protected $fillable = [
        'seats_count',
        'status',
        'expires_at',
        'id_user',
        'id_screening',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function screening()
    {
        return $this->belongsTo(Screening::class, 'id_screening', 'id_screening');
    }
}
