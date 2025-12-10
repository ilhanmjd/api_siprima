<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'risk_id',
        'alasan_pemeliharaan',
        'status_pemeliharaan',
        'status_review',
        'bukti_lampiran',
        'alasan_ditolak',
    ];

    /**
     * Get the asset associated with this maintenance.
     */
    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * Get the risk associated with this maintenance.
     */
    public function risk()
    {
        return $this->belongsTo(Risk::class);
    }
}
