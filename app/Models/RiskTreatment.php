<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiskTreatment extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'risiko_id',
        'strategi',
        'pengendalian',
        'penanggung_jawab_id',
        'target_tanggal',
        'biaya',
        'probabilitas_akhir',
        'dampak_akhir',
        'level_residual',
        'status',
    ];

    protected $casts = [
        'target_tanggal' => 'date',
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
    /**
     * Get the risk that owns the treatment.
     */
    public function risk(): BelongsTo
    {
        return $this->belongsTo(Risk::class, 'risiko_id');
    }

    /**
     * Get the penanggung jawab for the treatment.
     */
    public function penanggungjawab(): BelongsTo
    {
        return $this->belongsTo(Penanggungjawab::class, 'penanggung_jawab_id');
    }

    /**
     * Get the rejection reason for the treatment.
     */
    public function rejection(): HasOne
    {
        return $this->hasOne(RiskTreatmentRejected::class);
    }

    /**
     * Get the maintenances for the risk treatment.
     */
    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }
}
