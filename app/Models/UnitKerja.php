<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitKerja extends Model
{
    protected $fillable = [
        'name',
        'dinas_id',
    ];

    /**
     * Get the dinas that owns the unit kerja.
     */
    public function dinas()
    {
        return $this->belongsTo(Dinas::class);
    }
}
