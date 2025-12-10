<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssetController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/assets",
     *     tags={"Assets"},
     *     summary="Get all assets",
     *     description="Mendapatkan daftar semua asset dengan relasi kategori, subkategori, lokasi, dan penanggung jawab",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="dinas_id",
     *         in="query",
     *         description="Filter berdasarkan dinas ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="kategori_id",
     *         in="query",
     *         description="Filter berdasarkan kategori ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter berdasarkan status (pending, diterima, ditolak, pemeliharaan)",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data assets",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="dinas_id", type="integer", example=1),
     *                     @OA\Property(property="kategori_id", type="integer", example=1),
     *                     @OA\Property(property="subkategori_id", type="integer", example=1),
     *                     @OA\Property(property="lokasi_id", type="integer", example=1),
     *                     @OA\Property(property="penanggungjawab_id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="Laptop Dell Latitude 5420"),
     *                     @OA\Property(property="deskripsi", type="string", example="Laptop untuk keperluan kerja"),
     *                     @OA\Property(property="tgl_perolehan", type="string", format="date-time"),
     *                     @OA\Property(property="nilai_perolehan", type="integer", example=12000000),
     *                     @OA\Property(property="kondisi", type="string", example="baik"),
     *                     @OA\Property(property="lampiran_bukti", type="string", example=null),
     *                     @OA\Property(property="is_usage", type="string", example="active"),
     *                     @OA\Property(property="status", type="string", example="diterima"),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time")
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
    public function index(Request $request)
    {
        $query = Asset::with(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab']);

        // Filter berdasarkan dinas
        if ($request->has('dinas_id')) {
            $query->where('dinas_id', $request->dinas_id);
        }

        // Filter berdasarkan kategori
        if ($request->has('kategori_id')) {
            $query->where('kategori_id', $request->kategori_id);
        }

        // Filter berdasarkan status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $assets = $query->get();

        return response()->json([
            'success' => true,
            'data' => $assets,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/assets",
     *     tags={"Assets"},
     *     summary="Create new asset",
     *     description="Membuat asset baru",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"dinas_id", "kategori_id", "subkategori_id", "lokasi_id", "penanggungjawab_id", "nama"},
     *             @OA\Property(property="dinas_id", type="integer", example=1),
     *             @OA\Property(property="kategori_id", type="integer", example=1),
     *             @OA\Property(property="subkategori_id", type="integer", example=1),
     *             @OA\Property(property="lokasi_id", type="integer", example=1),
     *             @OA\Property(property="penanggungjawab_id", type="integer", example=1),
     *             @OA\Property(property="nama", type="string", example="Laptop Dell Latitude 5420"),
     *             @OA\Property(property="deskripsi", type="string", example="Laptop untuk keperluan kerja"),
     *             @OA\Property(property="tgl_perolehan", type="string", format="date-time", example="2024-06-01 10:00:00"),
     *             @OA\Property(property="nilai_perolehan", type="integer", example=12000000),
     *             @OA\Property(property="kondisi", type="string", enum={"baik", "rusak-ringan", "rusak-berat"}, example="baik"),
     *             @OA\Property(property="lampiran_bukti", type="string", example="bukti.pdf"),
     *             @OA\Property(property="is_usage", type="string", enum={"active", "inactive"}, example="active"),
     *             @OA\Property(property="status", type="string", enum={"pending", "diterima", "ditolak", "pemeliharaan"}, example="pending")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Asset berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Asset berhasil dibuat"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(property="errors", type="object")
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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'dinas_id' => 'required|exists:dinas,id',
            'kategori_id' => 'required|exists:kategoris,id',
            'subkategori_id' => 'required|exists:sub_kategoris,id',
            'lokasi_id' => 'required|exists:lokasis,id',
            'penanggungjawab_id' => 'required|exists:penanggungjawabs,id',
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tgl_perolehan' => 'nullable|date',
            'nilai_perolehan' => 'nullable|integer',
            'kondisi' => 'nullable|in:baik,rusak-ringan,rusak-berat',
            'lampiran_bukti' => 'nullable|string',
            'is_usage' => 'nullable|in:active,inactive',
            'status' => 'nullable|in:pending,diterima,ditolak,pemeliharaan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        $data['created_by'] = $request->user()->id;
        
        $asset = Asset::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Asset berhasil dibuat',
            'data' => $asset->load(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab', 'createdBy']),
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/assets/{id}",
     *     tags={"Assets"},
     *     summary="Get asset by ID",
     *     description="Mendapatkan detail asset berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Asset ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan detail asset",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Asset tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Asset tidak ditemukan")
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
    public function show($id)
    {
        $asset = Asset::with(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab'])->find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $asset,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/assets/{id}",
     *     tags={"Assets"},
     *     summary="Update asset",
     *     description="Mengupdate data asset berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Asset ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="dinas_id", type="integer", example=1),
     *             @OA\Property(property="kategori_id", type="integer", example=1),
     *             @OA\Property(property="subkategori_id", type="integer", example=1),
     *             @OA\Property(property="lokasi_id", type="integer", example=1),
     *             @OA\Property(property="penanggungjawab_id", type="integer", example=1),
     *             @OA\Property(property="nama", type="string", example="Laptop Dell Latitude 5420"),
     *             @OA\Property(property="deskripsi", type="string", example="Laptop untuk keperluan kerja"),
     *             @OA\Property(property="tgl_perolehan", type="string", format="date-time", example="2024-06-01 10:00:00"),
     *             @OA\Property(property="nilai_perolehan", type="integer", example=12000000),
     *             @OA\Property(property="kondisi", type="string", enum={"baik", "rusak-ringan", "rusak-berat"}, example="baik"),
     *             @OA\Property(property="lampiran_bukti", type="string", example="bukti.pdf"),
     *             @OA\Property(property="is_usage", type="string", enum={"active", "inactive"}, example="active"),
     *             @OA\Property(property="status", type="string", enum={"pending", "diterima", "ditolak", "pemeliharaan"}, example="diterima")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asset berhasil diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Asset berhasil diupdate"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Asset tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Asset tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(property="errors", type="object")
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
    public function update(Request $request, $id)
    {
        $asset = Asset::find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'dinas_id' => 'sometimes|required|exists:dinas,id',
            'kategori_id' => 'sometimes|required|exists:kategoris,id',
            'subkategori_id' => 'sometimes|required|exists:sub_kategoris,id',
            'lokasi_id' => 'sometimes|required|exists:lokasis,id',
            'penanggungjawab_id' => 'sometimes|required|exists:penanggungjawabs,id',
            'nama' => 'sometimes|required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tgl_perolehan' => 'nullable|date',
            'nilai_perolehan' => 'nullable|integer',
            'kondisi' => 'nullable|in:baik,rusak-ringan,rusak-berat',
            'lampiran_bukti' => 'nullable|string',
            'is_usage' => 'nullable|in:active,inactive',
            'status' => 'nullable|in:pending,diterima,ditolak,pemeliharaan',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $asset->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Asset berhasil diupdate',
            'data' => $asset->load(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab']),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/assets/{id}",
     *     tags={"Assets"},
     *     summary="Delete asset",
     *     description="Menghapus asset berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Asset ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asset berhasil dihapus",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Asset berhasil dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Asset tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Asset tidak ditemukan")
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
    public function destroy($id)
    {
        $asset = Asset::find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset tidak ditemukan',
            ], 404);
        }

        $asset->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asset berhasil dihapus',
        ]);
    }
}
