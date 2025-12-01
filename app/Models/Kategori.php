<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategoris';

    protected $fillable = [
        'nama',
    ];

    public function subKategori()
    {
        return $this->hasMany(SubKategori::class, 'kategori_id');
    }
}
