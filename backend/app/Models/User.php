<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property string $role
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 *
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'id';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'id_user', 'id');
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
