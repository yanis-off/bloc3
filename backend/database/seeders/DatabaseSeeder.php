<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'first_name' => 'Admin',
            'last_name'  => 'Baobab',
            'email'      => 'admin@baobab.com',
            'password'   => Hash::make('password'),
            'role'       => 'admin',
        ]);

        // User de test
        User::create([
            'first_name' => 'Marie',
            'last_name'  => 'Grace',
            'email'      => 'user@baobab.com',
            'password'   => Hash::make('password'),
            'role'       => 'user',
        ]);

        $this->call([
            CategorySeeder::class,
            RoomSeeder::class,
            FilmSeeder::class,
            ScreeningSeeder::class,
        ]);
    }
}
