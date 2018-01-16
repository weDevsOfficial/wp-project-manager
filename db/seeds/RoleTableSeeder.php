<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use WeDevs\PM\Role\Models\Role;
use Carbon\Carbon;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (!Role::count()) {
            Role::insert([
                [
                    'title'       => 'Manager',
                    'slug'        => 'manager',
                    'description' => 'Manager is a person who manages the project.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now(),
                ],
                [
                    'title'       => 'Co Worker',
                    'slug'        => 'co_worker',
                    'description' => 'Co-worker is person who works under a project.',
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now(),
                ],
            ]);
        }
    }

}