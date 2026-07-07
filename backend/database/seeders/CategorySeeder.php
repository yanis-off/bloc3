<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Action',
            'Comédie',
            'Drame',
            'Horreur',
            'Science-fiction',
            'Animation',
            'Thriller',
            'Romance',
            'Aventure',
            'Fantastique',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
