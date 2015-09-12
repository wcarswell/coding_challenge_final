<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
// use Database\VehicleTableSeeder;
// use Database\BranchTableSeeder;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Model::unguard();

		// $this->call('UserTableSeeder');
		//$this->call('VehicleTableSeeder');
		//$this->call('BranchTableSeeder');
	}

}

class VehicleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('vehicle')->insert([
            'id' => str_random(10),
            'name' => 'a',
           // 'password' => bcrypt('secret'),
        ]);
    }
}

class BranchTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('branch')->insert([
            'id' => str_random(10),
            'name' => 'a',
           // 'password' => bcrypt('secret'),
        ]);

        DB::table('branch')->insert([
            'id' => str_random(10),
            'name' => 'b',
           // 'password' => bcrypt('secret'),
        ]);
    }
}
