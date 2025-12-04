<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penanggungjawab extends Model
{
    protected $fillable = [
        'nama',
        'jabatan',
    ];

    /**
     * Get the assets for the penanggungjawab.
     */
    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }
}
