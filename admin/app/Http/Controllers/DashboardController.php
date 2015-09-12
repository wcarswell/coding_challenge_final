<?php namespace App\Http\Controllers;

use App\Vehicle;
use App\Http\Controllers\Controller;

class DashboardController extends Controller 
{

    public function index()
    {
    	//@Todo authentication
    	return view('dashboard');
    }

}