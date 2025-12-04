<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use App\Models\Lokasi;
use App\Models\Penanggungjawab;
use App\Models\SubKategori;

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

    /**
     * @OA\Get(
     *     path="/api/data-master/lokasi",
     *     tags={"Data Master"},
     *     summary="Get all lokasi",
     *     description="Mendapatkan daftar semua lokasi asset",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data lokasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="Kantor Pusat"),
     *                     @OA\Property(property="alamat", type="string", example="Jl. Sudirman No. 123, Jakarta Pusat"),
     *                     @OA\Property(property="latitude", type="number", format="float", example=-6.2088),
     *                     @OA\Property(property="longitude", type="number", format="float", example=106.8456),
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
    public function lokasi()
    {
        $lokasi = Lokasi::all();
        return response()->json([
            'success' => true,
            'data' => $lokasi,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/data-master/penanggungjawab",
     *     tags={"Data Master"},
     *     summary="Get all penanggungjawab",
     *     description="Mendapatkan daftar semua penanggung jawab asset",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data penanggung jawab",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="Budi Santoso"),
     *                     @OA\Property(property="jabatan", type="string", example="Kepala Divisi IT"),
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
    public function penanggungJawab()
    {
        $penanggungJawab = Penanggungjawab::all();
        return response()->json([
            'success' => true,
            'data' => $penanggungJawab,
        ]);
    }
}