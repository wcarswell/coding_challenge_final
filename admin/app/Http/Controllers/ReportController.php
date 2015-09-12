<?php namespace App\Http\Controllers;

use DB;
use Config;
use App\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReportController extends Controller 
{
	
    public function lowStock()
    {
		// Return all countries alphabetically
        $product = new Product;
		return $product->scopeLowStock( getenv('LOW_STOCK') );
    }

    public function productList()
    {
	   // Return all countries alphabetically
       $product = new Product;
	   return $product->scopeAll();
    }

    public function updateProduct($product_id, Request $request) 
    {   
        // Do we have a valid table key?
        if(!is_numeric($product_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }

        // Fetch Posted country variables
        $product = $request->input('product');

        // Modify entry
        if( !empty($product['name']) ) {
            $data  = [
                'name'              => $product['name'],
                'quantity_on_hand'  => $product['quantity_on_hand']
            ];

            Product::where('product_id', $product_id)
                ->update($data);

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name value not set'
            );
        }      
    }

    public function addProduct(Request $request)
    {
        // Fetch Posted country variables
        $product = $request->input('product');

        // Insert new country
        if( !empty($product['name']) && !empty($product['clinic_id']) ) {
            // Check if country name is unique
            if( Product::where('name', $product['name'])
                    ->where('clinic_id', $product['clinic_id'])
                    ->count() > 0 ) {
                return response()->json(
                    array('status' => 'fail','message' => 'Product Exist for Clinic exists')
                );
            }
        
            // Initialise country object
            $product = new Product(
                array(
                    'name' => $product['name'],
                    'quantity_on_hand'  => $product['quantity_on_hand'],
                    'clinic_id' => $product['clinic_id']
                )
            );

            // Save new country
            $product->save();

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Clinic value not set'
            );
        }

        return response()->json($return);
    }

    public function deleteProduct($product_id) 
    {
        // Do we have a valid table key?
        if(!is_numeric($product_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }

        // @Todo: save into temp table
        DB::table('product')->where('product_id', $product_id)->delete();

        $return = array(
            'status' => 'succcess'
        );
    }

}