<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use WeDevs\PM\Role\Models\Role;
use \WeDevs\PM\Settings\Models\Settings;
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
        $user = wp_get_current_user();

        if (!Role::count()) {
            Role::insert([
                [
                    'title'       => __( 'Manager', 'wedevs-project-manager' ),
                    'slug'        => 'manager',
                    'description' => __( 'Manager is a person who manages the project.', 'wedevs-project-manager' ),
                    'status'      => 1,
                    'created_by'  => $user->ID,
                    'updated_by'  => $user->ID,
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now(),
                ],
                [
                    'title'       => __( 'Co-Worker', 'wedevs-project-manager' ),
                    'slug'        => 'co_worker',
                    'description' => __( 'Co-worker is person who works under a project.', 'wedevs-project-manager' ),
                    'status'      => 1,
                    'created_by'  => $user->ID,
                    'updated_by'  => $user->ID,
                    'created_at'  => Carbon::now(),
                    'updated_at'  => Carbon::now(),
                ],
            ]);
        }
        $mc = Settings::where( 'key', 'managing_capability' )->get();
        $pcc = Settings::where( 'key', 'project_create_capability' )->get();
        if ( $mc->isEmpty() ){
            Settings::firstOrCreate([
                'key'   => 'managing_capability',
                'value' => array('administrator', 'editor', 'author')
            ]);
        }
        if ( $pcc->isEmpty() ) {
            Settings::firstOrCreate([
                'key'   => 'project_create_capability',
                'value' => array('administrator', 'editor', 'author')
            ]);
        }
        
    }

}