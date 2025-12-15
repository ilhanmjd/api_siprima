<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiskRejected extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'risk_id',
        'alasan',
    ];

    /**
     * Get the risk that owns this rejection.
     */
    public function risk(): BelongsTo
    {
        return $this->belongsTo(Risk::class);
    }
}
