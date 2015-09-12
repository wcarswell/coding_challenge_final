<?php namespace App\Http\Controllers;

use DB;
use App\Country;
use App\Clinic;
use App\Tax;
use App\Vendor;
use App\StockOrder;
use App\StockOrderLine;
use App\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller 
{
	
    public function countryList()
    {
		// Return all countries alphabetically
		return Country::orderBy('name', 'asc')->get();
    }

    public function clinicList()
    {	
        return DB::table('clinic')
            ->join('country', 'country.country_id', '=', 'clinic.country_id')
            ->select('clinic.*', 'country.name as country_name')
            ->get();
    }

    public function taxList()
    {   
        return DB::table('tax')
            ->join('country', 'country.country_id', '=', 'tax.country_id')
            ->select('tax.*', 'country.name as country_name')
            ->get();
    }

    public function taxWithCurrencyList()
    {
        return DB::table('tax')
            ->join('country', 'country.country_id', '=', 'tax.country_id')
            ->select('tax.*', 'country.name as country_name', 'country.currency')
            ->get();
    }

    public function vendorList()
    {
        // Return all countries alphabetically
        return Vendor::orderBy('name', 'asc')->get();
    }

    public function stockList()
    {
        // Return all stock_orders
        $stockOrder = new StockOrder();
        return $stockOrder->scopeAll();
    }

    public function productList()
    {
        // Return all product, sorted by 
        $product = new Product;
        return $product->scopeProductByClinic();
    }

    public function productByClinicID($clinic_id)
    {
        // Return all product, sorted by 
        $product = new Product;
        return $product->scopeProductByClinicID($clinic_id);
    }

    public function updateOrder($order_id, Request $request)
    {
        // Fetch Posted country variables
        $order = $request->input('order');
        $orderLines = $request->input('orderlines');

        // Modify entry
        if( !empty($order['vendor_id']) && !empty($order['tax_id']) ) {
            
            // Initalise items_received and is_paid if not set
            if(!isset($order['items_received'])) $order['items_received'] = 'n';
            if(!isset($order['is_paid'])) $order['is_paid'] = 'n';

            // Set items_received to y if set
            if(1 == $order['items_received']) {
                $order['items_received'] = 'y';
            }

            // Set is_paid to y if set
            if(1 == $order['is_paid']) {
                $order['is_paid'] = 'y';
            }

            // Update stock order
            StockOrder::where('stock_order_id', $order_id)
                ->update([
                    'vendor_id' => $order['vendor_id'], 
                    'tax_id'         => $order['tax_id'],
                    'items_received' => $order['items_received'],
                    'is_paid'        => $order['is_paid']
                ]);

        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Vendor or Tax value not set'
            );
        } 

        // Save OrderLines
        if($orderLines) {
            foreach($orderLines as $orderLine) {
                $stockOrderLine = new StockOrderLine(
                    array(
                        'product_id'     => $orderLine['product_id'],
                        'stock_order_id' => $order_id,
                        'quantity'       => $orderLine['quantity_on_hand']
                    )
                );

                // Save new stock order line
                $stockOrderLine->save();

                // Amend product with new quantity on hand
                if(isset($order['items_received'])) {
                    if($order['items_received']) {
                        // Find product to update
                        $product = Product::find($orderLine['product_id']);

                        if(empty($product->quantity_on_hand)) {
                            $product->quantity_on_hand = 0;
                        }

                        $product->quantity_on_hand += $orderLine['quantity_on_hand'];
                        
                        $product->save();
                    }
                }

            }
        }

        $return = array(
            'status' => 'succcess'
        );
    }

    public function addOrder(Request $request)
    {
        // Fetch Posted country variables
        $order = $request->input('order');
        $orderLines = $request->input('orderlines');

        // Initialise country object
        if(!isset($order['items_received'])) $order['items_received'] = 'n';
        if(!isset($order['is_paid'])) $order['is_paid'] = 'n';

        if(1 == $order['items_received']) {
            $order['items_received'] = 'y';
        }

        if(1 == $order['is_paid']) {
            $order['is_paid'] = 'y';
        }

        $stockOrder = new StockOrder(
            array(
                'vendor_id'      => $order['vendor_id'],
                'tax_id'         => $order['tax_id'],
                'items_received' => $order['items_received'],
                'is_paid'        => $order['is_paid']
            )
        );

        // Save new stock order
        $stockOrder->save();

        // Save OrderLines
        if($orderLines) {
            foreach($orderLines as $orderLine) {
                $stockOrderLine = new StockOrderLine(
                    array(
                        'product_id'     => $orderLine['product_id'],
                        'stock_order_id' => $stockOrder->stock_order_id,
                        'quantity'       => $orderLine['quantity_on_hand']
                    )
                );

                // Save new stock order line
                $stockOrderLine->save();

                // Amend product with new quantity on hand
                if(isset($order['items_received'])) {
                    if($order['items_received']) {
                        // Find product to update
                        $product = Product::find($orderLine['product_id']);

                        if(empty($product->quantity_on_hand)) {
                            $product->quantity_on_hand = 0;
                        }

                        $product->quantity_on_hand += $orderLine['quantity_on_hand'];
                        
                        $product->save();
                    }
                }
            }
        }

        $return = array(
            'status' => 'succcess'
        );
    }

    public function addCountry(Request $request)
    {
        // Fetch Posted country variables
    	$country = $request->input('country');

        // Insert new country
        if( !empty($country['name']) && !empty($country['currency']) ) {
            // Check if country name is unique
            if( Country::where('name', $country['name'])->count() > 0 ) {
                return response()->json(
                    array('status' => 'fail','message' => 'Country exists')
                );
            }
    	
    		// Initialise country object
            $country = new Country(
                array(
                    'name' => $country['name'],
                    'currency' => $country['currency']
                )
            );

            // Save new country
            $country->save();

            $return = array(
                'status' => 'succcess'
            );
    	} else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Currency value not set'
            );
    	}

    	return response()->json($return);
    }

    public function updateCountry($country_id, Request $request) 
    {   
        // Do we have a valid table key?
        if(!is_numeric($country_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }

        // Fetch Posted country variables
        $country = $request->input('country');

        // Modify entry
        if( !empty($country['name']) && !empty($country['currency']) ) {
            Country::where('country_id', $country['country_id'])
                        ->update(['name' => $country['name'], 'currency' => $country['currency']]);

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Currency value not set'
            );
        }      
    }

    public function deleteCountry($country_id) 
    {
        // Do we have a valid table key?
        if(!is_numeric($country_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }

        // Check if country name is unique
        if( Clinic::where('country_id', $country_id)->count() > 0 ) {
            return response()->json(
                array('status' => 'fail','message' => 'Items still exist in clinic')
            );
        }

        // @Todo: save into temp table
        DB::table('country')->where('country_id', $country_id)->delete();

        $return = array(
            'status' => 'succcess'
        );
    }

    public function addClinic(Request $request)
    {
        // Fetch Posted country variables
        $clinic = $request->input('clinic');

        // Insert new clinic
        if( !empty($clinic['name']) && !empty($clinic['country_id']) ) {
            // Check if country name is unique
            if( Clinic::where('name', $clinic['name'])->count() > 0 ) {
                return response()->json(
                    array('status' => 'fail','message' => 'Clinic exists')
                );
            }
        
            // Initialise country object
            $clinic = new Clinic(
                array(
					'name' 				=> $clinic['name'],
					'street' 			=> $clinic['street'],
					'city' 				=> $clinic['city'],
					'province'  		=> $clinic['province'],
					'post_code' 		=> $clinic['post_code'],
					'telephone_number' 	=> $clinic['telephone_number'],
					'fax_number'		=> $clinic['fax_number'],
					'clinic_number'     => $clinic['clinic_number'],
					'country_id'		=> $clinic['country_id']
                )
            );

            // Save new country
            $clinic->save();

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Crountry_ID value not set'
            );
        }

        return response()->json($return);
    }

    public function updateClinic($clinic_id, Request $request) 
    {   
        // Do we have a valid table key?
        if(!is_numeric($clinic_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }

        // Fetch Posted country variables
        $clinic = $request->input('clinic');

        // Modify entry
        if( !empty($clinic['name']) && !empty($clinic['country_id']) ) {
            $data  = [
                'name' 				=> $clinic['name'],
                'street' 			=> $clinic['street'],
				'city' 				=> $clinic['city'],
				'province'  		=> $clinic['province'],
				'post_code' 		=> $clinic['post_code'],
				'telephone_number' 	=> $clinic['telephone_number'],
				'fax_number'		=> $clinic['fax_number'],
				'clinic_number'     => $clinic['clinic_number'],
				'country_id'		=> $clinic['country_id']
            ];

            Clinic::where('clinic_id', $clinic['clinic_id'])
                ->update($data);

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Country value not set'
            );
        }      
    }

    public function deleteClinic($clinic_id) 
    {
        // Do we have a valid table key?
        if(!is_numeric($clinic_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }
        
        // @Todo: save into temp table
        DB::table('clinic')->where('clinic_id', $clinic_id)->delete();

        $return = array(
            'status' => 'succcess'
        );
    }

    public function addTax(Request $request)
    {
        // Fetch Posted country variables
        $tax = $request->input('tax');

        // Insert new vendor
        if( !empty($tax['country_id']) && !empty($tax['percent']) ) {
            // Check if country name is unique
            if( Tax::where('country_id', $tax['country_id'])->count() > 0 ) {
                return response()->json(
                    array('status' => 'fail','message' => 'Tax Setup exists')
                );
            }
        
            // Initialise country object
            $tax = new Tax(
                array(
                    'country_id'           => $tax['country_id'],
                    'percent'              => $tax['percent'],
                )
            );

            // Save new country
            $tax->save();

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Tax ID value not set'
            );
        }

        return response()->json($return);
    }

    public function updateTax($tax_id, Request $request) 
    {   
        // Do we have a valid table key?
        if(!is_numeric($tax_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }

        // Fetch Posted country variables
        $tax = $request->input('tax');

        // Check if country name is unique
        if( Tax::where('country_id', $tax['country_id'])->count() > 0 ) {
            return response()->json(
                array('status' => 'fail','message' => 'Tax Setup exists')
            );
        }

        // Fetch Posted country variables
        $tax = $request->input('tax');

        // Modify entry
        if( !empty($tax['percent']) && !empty($tax['country_id']) ) {
            $data  = [
                'country_id'        => $tax['country_id'],
                'percent'           => $tax['percent']
            ];

            Tax::where('tax_id', $tax['tax_id'])
                ->update($data);

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Country value not set'
            );
        }      
    }

    public function deleteTax($tax_id) 
    {
        // Do we have a valid table key?
        if(!is_numeric($tax_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }
        
        // @Todo: save into temp table
        DB::table('tax')->where('tax_id', $tax_id)->delete();

        $return = array(
            'status' => 'succcess'
        );
    }

    public function addVendor(Request $request)
    {
        // Fetch Posted vendor variables
        $vendor = $request->input('vendor');

        // Insert new vendor
        if( !empty($vendor['name']) ) {
            // Check if vendor name is unique
            if( Vendor::where('name', $vendor['name'])->count() > 0 ) {
                return response()->json(
                    array('status' => 'fail','message' => 'Vendor exists')
                );
            }
        
            // Initialise country object
            $vendor = new Vendor(
                array(
                    'name'        => $vendor['name'],
                    'address'     => $vendor['address'],
                    'phone'       => $vendor['phone'],
                    'contact'     => $vendor['contact'],
                    'fax'         => $vendor['fax'],
                    'email'       => $vendor['email'],
                    'notes'       => $vendor['notes']
                )
            );

            // Save new country
            $vendor->save();

            $return = array(
                'status' => 'succcess'
            );
        } else {
            $return = array(
                'status' => 'fail',
                'message' => 'Name or Vendor ID value not set'
            );
        }

        return response()->json($return);
    }

    public function updateVendor($vendor_id, Request $request) 
    {   
        // Do we have a valid table key?
        if(!is_numeric($vendor_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }

        // Fetch Posted country variables
        $vendor = $request->input('vendor');

        // // Check if country name is unique
        // if( Vendor::where('name', $vendor['name'])->count() > 0 ) {
        //     return response()->json(
        //         array('status' => 'fail','message' => 'Vendor Setup exists')
        //     );
        // }

        // Fetch Posted country variables
        $vendor = $request->input('vendor');

        // Modify entry
        if( !empty($vendor['name'])) {
            $data  = [
                'name'        => $vendor['name'],
                'address'     => $vendor['address'],
                'phone'       => $vendor['phone'],
                'contact'     => $vendor['contact'],
                'fax'         => $vendor['fax'],
                'email'       => $vendor['email'],
                'notes'       => $vendor['notes']
            ];

            Vendor::where('vendor_id', $vendor['vendor_id'])
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

    public function deleteVendor($vendor_id) 
    {
        // Do we have a valid table key?
        if(!is_numeric($vendor_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }
        
        // @Todo: save into temp table
        DB::table('vendor')->where('vendor_id', $vendor_id)->delete();

        $return = array(
            'status' => 'succcess'
        );
    }

    public function deleteOrder($order_id) 
    {
        // Do we have a valid table key?
        if(!is_numeric($order_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }
        
        // @Todo: save into temp table
        DB::table('stock_order')->where('stock_order_id', $order_id)->delete();

        $return = array(
            'status' => 'succcess'
        );
    }

    public function deleteOrderLine($order_id)
    {
        // Do we have a valid table key?
        if(!is_numeric($order_id)) {
            return response()->json(
                array('status' => 'fail','message' => 'ID not numeric')
            );
        }
        
        // @Todo: save into temp table
        DB::table('stock_order_line')->where('stock_order_id', $order_id)->delete();

        $return = array(
            'status' => 'succcess'
        ); 
    }
}