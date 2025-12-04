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
            ['name' => 'user_dinas'],
            ['name' => 'verifikator'],
            ['name' => 'admin_dinas'],
            ['name' => 'auditor'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
