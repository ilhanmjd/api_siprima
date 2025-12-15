<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiskTreatmentRejected extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'risk_treatment_id',
        'alasan',
    ];

    /**
     * Get the risk treatment that owns the rejection.
     */
    public function riskTreatment(): BelongsTo
    {
        return $this->belongsTo(RiskTreatment::class);
    }
}
