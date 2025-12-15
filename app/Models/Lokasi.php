<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lokasi extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'nama',
        'alamat',
        'latitude',
        'longitude',
    ];

    /**
     * Get the assets for the lokasi.
     */
    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }
}
