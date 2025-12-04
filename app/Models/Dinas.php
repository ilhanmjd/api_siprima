<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dinas extends Model
{
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
