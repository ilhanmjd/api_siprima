<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetDeletion extends Model
{
    protected $fillable = [
        'asset_id',
        'alasan_penghapusan',
        'lampiran',
        'status',
        'alasan_ditolak',
    ];

    /**
     * Relasi ke Asset
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
