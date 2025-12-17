<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Asset extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kode_bmd',
        'dinas_id',
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
        'lampiran_url',
        'is_usage',
        'status',
        'alasan_ditolak',
        'created_by',
    ];

    /**
     * Boot method untuk auto-generate kode_bmd saat create asset
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($asset) {
            if (empty($asset->kode_bmd)) {
                $asset->kode_bmd = self::generateKodeBmd($asset);
            }
        });
    }

    /**
     * Generate kode BMD dengan format: {KATEGORI}.{SUBKATEGORI_ID}.{TAHUN}.{URUT}
     * Contoh: TI.001.2025.00001 atau NTI.045.2025.00123
     */
    public static function generateKodeBmd($asset): string
    {
        // Get kategori name untuk prefix
        $kategori = Kategori::find($asset->kategori_id);
        $kategoriCode = $kategori ? self::getKategoriCode($kategori->nama) : 'XXX';

        // Format subkategori_id dengan padding 3 digit
        $subkategoriCode = str_pad($asset->subkategori_id, 3, '0', STR_PAD_LEFT);

        // Get tahun dari tgl_perolehan atau tahun sekarang
        $tahun = $asset->tgl_perolehan 
            ? date('Y', strtotime($asset->tgl_perolehan)) 
            : date('Y');

        // Get nomor urut berdasarkan kategori dan tahun
        $lastAsset = self::where('kode_bmd', 'like', "{$kategoriCode}.%.{$tahun}.%")
            ->orderBy(DB::raw('CAST(SUBSTRING_INDEX(kode_bmd, ".", -1) AS UNSIGNED)'), 'desc')
            ->first();

        if ($lastAsset) {
            $lastNumber = (int) substr($lastAsset->kode_bmd, -5);
            $urut = $lastNumber + 1;
        } else {
            $urut = 1;
        }

        // Format nomor urut dengan padding 5 digit
        $urutCode = str_pad($urut, 5, '0', STR_PAD_LEFT);

        return "{$kategoriCode}.{$subkategoriCode}.{$tahun}.{$urutCode}";
    }

    /**
     * Get kode kategori dari nama kategori
     */
    private static function getKategoriCode(string $nama): string
    {
        $nama = strtolower($nama);
        
        if (str_contains($nama, 'non')) {
            return 'NTI';
        } elseif (str_contains($nama, 'ti')) {
            return 'TI';
        }
        
        // Default: ambil 3 karakter pertama uppercase
        return strtoupper(substr($nama, 0, 3));
    }

    protected $casts = [
        'tgl_perolehan' => 'datetime',
    ];

    /**
     * Get the dinas that owns the asset.
     */
    public function dinas(): BelongsTo
    {
        return $this->belongsTo(Dinas::class);
    }

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

    /**
     * Get the risks for the asset.
     */
    public function risks(): HasMany
    {
        return $this->hasMany(Risk::class, 'asset_id');
    }

    /**
     * Get the risk treatment for the asset.
     */
    public function riskTreatment(): HasMany
    {
        return $this->hasMany(RiskTreatment::class, 'asset_id');
    }

    /**
     * Get the asset deletions for the asset.
     */
    public function assetDeletions(): HasMany
    {
        return $this->hasMany(AssetDeletion::class, 'asset_id');
    }

    /**
     * Get the user who created the asset.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the maintenances for the asset.
     */
    public function maintenance(): HasMany
    {
        return $this->hasMany(Maintenance::class, 'asset_id');
    }
}
