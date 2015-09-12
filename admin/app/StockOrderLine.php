<?php namespace App;
use Illuminate\Database\Eloquent\Model;
class StockOrderLine extends Model {
	protected $table = 'stock_order_line';
    public $fillable = [
        'stock_order_id',
        'product_id',
		'order_id',
        'quantity'
    ];

}