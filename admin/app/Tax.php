<?php namespace App;
use Illuminate\Database\Eloquent\Model;
class Tax extends Model {
	protected $primaryKey = 'tax_id';
    protected $table = 'tax';
    public $fillable = [
        'country_id',
        'percent'
    ];
}