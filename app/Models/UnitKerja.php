<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitKerja extends Model
{
    use SoftDeletes;
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
