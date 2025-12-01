<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\SubKategori;
use Illuminate\Http\Request;

class DataMasterController extends Controller
{
    public function kategori()
    {
        $kategori = Kategori::all();
        return response()->json([
            'success' => true,
            'data' => $kategori,
        ]);
    }

    public function subKategori()
    {
        $subKategori = SubKategori::all();
        return response()->json([
            'success' => true,
            'data' => $subKategori,
        ]);
    }
}
