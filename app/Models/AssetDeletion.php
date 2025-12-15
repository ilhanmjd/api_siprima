<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssetDeletion extends Model
{
    use SoftDeletes;

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
