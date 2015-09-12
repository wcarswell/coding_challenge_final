<?php namespace App;
use Illuminate\Database\Eloquent\Model;
class Clinic extends Model {
	protected $primaryKey = 'clinic_id';
    protected $table = 'clinic';
    public $fillable = [
        'name',
        'country_id',
        'street',
		'city', 
		'province',  
		'post_code', 	
		'telephone_number',
		'fax_number',
		'country_id',
		'clinic_number'
    ];
}