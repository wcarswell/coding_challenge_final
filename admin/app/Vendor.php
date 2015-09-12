<?php namespace App;
use Illuminate\Database\Eloquent\Model;
class Vendor extends Model {
	protected $primaryKey = 'vendor_id';
    protected $table = 'vendor';
    public $fillable = [
        'name',
        'address',
        'phone',
        'contact',
        'fax',
        'email',
        'notes'
    ];
}