<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Asset extends Model
{
    protected $fillable = [
        'kategori_id',
        'subkategori_id',
        'lokasi_id',
        'penanggungjawab_id',
        'nama',
        'deskripsi',
        'tgl_perolehan',
        'nilai_perolehan',
        'kondisi',
        'lampiran_bukti',
        'is_usage',
        'status',
    ];

    protected $casts = [
        'tgl_perolehan' => 'datetime',
    ];

    /**
     * Get the kategori that owns the asset.
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }

    /**
     * Get the subkategori that owns the asset.
     */
    public function subkategori(): BelongsTo
    {
        return $this->belongsTo(SubKategori::class);
    }

    /**
     * Get the lokasi that owns the asset.
     */
    public function lokasi(): BelongsTo
    {
        return $this->belongsTo(Lokasi::class);
    }

    /**
     * Get the penanggungjawab that owns the asset.
     */
    public function penanggungjawab(): BelongsTo
    {
        return $this->belongsTo(Penanggungjawab::class);
    }
}
