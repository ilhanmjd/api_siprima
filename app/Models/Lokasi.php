<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lokasi extends Model
{
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
