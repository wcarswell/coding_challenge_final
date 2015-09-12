<?php namespace App;
use Illuminate\Database\Eloquent\Model;
class StockOrder extends Model {
	protected $primaryKey = 'stock_order_id';
    protected $table = 'stock_order';
    public $fillable = [
        'is_paid',
		'city', 
		'total',  
		'tax', 	
		'telephone_number',
		'vendor_id',
		'tax_id',
		'items_received'
    ];

    /**
     * Scope a query to only include stock line information.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAll()
    {   
        $orders = \DB::table('stock_order')
                    ->join('vendor', 'vendor.vendor_id', '=', 'stock_order.vendor_id')
                    ->join('tax', 'tax.tax_id', '=', 'stock_order.tax_id')
                    ->select('stock_order.*', 'vendor.name as vendor_name', 'tax.percent as tax_percent')
                    ->get();

        // Get stock orders for orders
        if($orders) {
            foreach($orders as &$order) {
                $orderLines = \DB::table('stock_order_line')
                    ->join('product', 'product.product_id', '=', 'stock_order_line.product_id')
                    ->join('clinic', 'product.clinic_id', '=', 'clinic.clinic_id')
                    ->where('stock_order_id', '=', $order->stock_order_id)
                    ->select('stock_order_line.*', 'product.name as product_name', 'clinic.name as clinic_name')
                    ->get();

                $order->orderLines = $orderLines;
            }
        }
        return $orders;
    }
}