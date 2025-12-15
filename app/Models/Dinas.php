<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Dinas extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'name',
    ];

    /**
     * Get the unit kerjas for the dinas.
     */
    public function unitKerjas()
    {
        return $this->hasMany(UnitKerja::class);
    }
}
