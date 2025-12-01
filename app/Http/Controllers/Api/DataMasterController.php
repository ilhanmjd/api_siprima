<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\SubKategori;
use Illuminate\Http\Request;

class DataMasterController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/data-master/kategori",
     *     tags={"Data Master"},
     *     summary="Get all kategori",
     *     description="Mendapatkan daftar semua kategori (TI dan Non-TI)",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data kategori",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="TI"),
     *                     @OA\Property(property="created_at", type="string", format="datetime"),
     *                     @OA\Property(property="updated_at", type="string", format="datetime")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function kategori()
    {
        $kategori = Kategori::all();
        return response()->json([
            'success' => true,
            'data' => $kategori,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/data-master/sub-kategori",
     *     tags={"Data Master"},
     *     summary="Get all sub-kategori",
     *     description="Mendapatkan daftar semua sub-kategori dengan relasi ke kategori",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data sub-kategori",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="Laptop"),
     *                     @OA\Property(property="kategori_id", type="integer", example=1),
     *                     @OA\Property(property="created_at", type="string", format="datetime"),
     *                     @OA\Property(property="updated_at", type="string", format="datetime")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function subKategori()
    {
        $subKategori = SubKategori::all();
        return response()->json([
            'success' => true,
            'data' => $subKategori,
        ]);
    }
}
