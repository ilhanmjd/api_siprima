<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            // Seed master data first
            DinasSeeder::class,
            UnitKerjaSeeder::class,
            RoleSeeder::class,
            
            // Then seed users
            UserSeeder::class,
            
            // Then seed other data
            KategoriSeeder::class,
            SubKategoriSeeder::class,
            LokasiSeeder::class,
            PenanggungjawabSeeder::class,
            AssetSeeder::class,
        ]);
    }
}
