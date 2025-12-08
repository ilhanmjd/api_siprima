<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Risk extends Model
{
    protected $fillable = [
        'asset_id',
        'judul',
        'deskripsi',
        'penyebab',
        'dampak',
        'probabilitas',
        'nilai_dampak',
        'level_risiko',
        'kriteria',
        'prioritas',
        'status',
    ];

    /**
     * Get the asset that owns the risk.
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * Get the rejection reason for the risk.
     */
    public function rejection(): HasOne
    {
        return $this->hasOne(RiskRejected::class);
    }

    /**
     * Get the risk treatments for the risk.
     */
    public function riskTreatments(): HasMany
    {
        return $this->hasMany(RiskTreatment::class, 'risiko_id');
    }
}
