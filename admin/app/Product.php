<?php namespace App;
use Illuminate\Database\Eloquent\Model;
class Product extends Model {
    protected $table = 'product';
    protected $primaryKey = 'product_id';
    protected $fillable = [
        'type',
        'name',
        'price',
        'quantity_on_hand',
        'clinic_id'
    ];

    /**
     * Scope a query to only include low stock levels.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAll()
    {
        return \DB::table('product')
                    ->orderBy('country_name', 'asc')
                    ->orderBy('clinic_name', 'asc')
                    ->orderBy('name', 'asc')
                    ->join('clinic', 'clinic.clinic_id', '=', 'product.clinic_id')
                    ->join('country', 'country.country_id', '=', 'clinic.country_id')
                    ->select('product.*', 'clinic.name as clinic_name', 'country.name as country_name')
                    ->get();
    }

    /**
     * Scope a query to return all products sortec by clinic.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeProductByClinicID($clinic_id)
    {
        return \DB::table('product')
                    ->orderBy('name', 'asc')
                    ->orderBy('quantity_on_hand', 'asc')
                    ->where('clinic_id', '=', $clinic_id)
                    ->select('product.*')
                    ->get();
    }

    /**
     * Scope a query to only include low stock levels.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLowStock($quantity)
    {
        return \DB::table('product')
                    ->orderBy('country_name', 'asc')
                    ->orderBy('clinic_name', 'asc')
                    ->orderBy('name', 'asc')
                    ->join('clinic', 'clinic.clinic_id', '=', 'product.clinic_id')
                    ->join('country', 'country.country_id', '=', 'clinic.country_id')
                    ->where('quantity_on_hand', '<', $quantity)
                    ->select('product.*', 'clinic.name as clinic_name', 'country.name as country_name')
                    ->get();
    }
}