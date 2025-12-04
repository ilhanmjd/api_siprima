<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'staff'],
            ['name' => 'kepala_seksi'],
            ['name' => 'admin_kota'],
            ['name' => 'auditor'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
