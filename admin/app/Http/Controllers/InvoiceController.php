<?php namespace App\Http\Controllers;

use DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InvoiceController extends Controller 
{
	public function invoiceList()
    {
        return DB::table('invoice')
            //->join('country', 'country.country_id', '=', 'clinic.country_id')
            ->select('invoice.*')
            ->get();
    }
}