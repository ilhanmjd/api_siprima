<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetDeletion;
use App\Models\Maintenance;
use App\Models\Risk;
use App\Models\RiskTreatment;
use Dompdf\Dompdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AssetController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/assets",
     *     tags={"Assets"},
     *     summary="Get all assets",
     *     description="Mendapatkan daftar semua asset dengan relasi kategori, subkategori, lokasi, dan penanggung jawab",
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Pencarian berdasarkan nama asset, kode BMD, atau deskripsi",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
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
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Asset::with(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab', 'risks.riskTreatments', 'maintenance', 'assetDeletions']);

        // Search berdasarkan nama, kode BMD, atau deskripsi
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('nama', 'like', '%' . $searchTerm . '%')
                  ->orWhere('kode_bmd', 'like', '%' . $searchTerm . '%')
                  ->orWhere('deskripsi', 'like', '%' . $searchTerm . '%');
            });
        }

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
     *     )
     * )
     */
    public function show($id)
    {
        $query = Asset::with(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab', 'risks.riskTreatments', 'maintenance', 'assetDeletions']);

        $asset = $query->find($id);

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
     *             @OA\Property(property="status", type="string", enum={"pending", "diterima", "ditolak", "pemeliharaan"}, example="diterima"),
     *             @OA\Property(property="alasan_ditolak", type="string", example="Dokumen tidak lengkap")
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
            'alasan_ditolak' => 'nullable|string',
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

    /**
     * @OA\Get(
     *     path="/api/assets/active",
     *     tags={"Assets"},
     *     summary="Get all active assets",
     *     description="Mendapatkan daftar semua asset dengan is_usage = active",
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
     *         description="Berhasil mendapatkan data active assets",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="total", type="integer", example=150),
     *                 @OA\Property(
     *                     property="assets",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="dinas_id", type="integer", example=1),
     *                         @OA\Property(property="nama", type="string", example="Laptop Dell Latitude 5420"),
     *                         @OA\Property(property="is_usage", type="string", example="active"),
     *                         @OA\Property(property="status", type="string", example="diterima")
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function getActive(Request $request)
    {
        $query = Asset::with(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab'])
            ->where('is_usage', 'active');

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
            'data' => [
                'total' => $assets->count(),
                'assets' => $assets,
            ],
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/assets/{id}/pengajuan-delete",
     *     tags={"Assets"},
     *     summary="Mengajukan penghapusan asset",
     *     description="Membuat pengajuan penghapusan asset",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID Asset",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"alasan_penghapusan"},
     *             @OA\Property(property="alasan_penghapusan", type="string", example="Asset sudah rusak berat dan tidak dapat diperbaiki"),
     *             @OA\Property(property="lampiran", type="string", example="dokumen_penghapusan.pdf")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Pengajuan penghapusan berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Pengajuan penghapusan asset berhasil dibuat"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Asset tidak ditemukan"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function pengajuanDelete(Request $request, $id)
    {
        $asset = Asset::find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'alasan_penghapusan' => 'required|string',
            'lampiran' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $assetDeletion = AssetDeletion::create([
            'asset_id' => $asset->id,
            'alasan_penghapusan' => $request->alasan_penghapusan,
            'lampiran' => $request->lampiran,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan penghapusan asset berhasil dibuat',
            'data' => $assetDeletion->load('asset'),
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/asset-deletions/{id}/accepted",
     *     tags={"Assets"},
     *     summary="Menerima pengajuan penghapusan asset",
     *     description="Menerima pengajuan penghapusan asset, menghapus permanent asset dan mengubah status menjadi 'dihapus'",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID AssetDeletion",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Pengajuan penghapusan diterima",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Pengajuan penghapusan asset diterima dan asset telah dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pengajuan penghapusan tidak ditemukan"
     *     )
     * )
     */
    public function acceptedDelete($id)
    {
        $assetDeletion = AssetDeletion::find($id);

        if (!$assetDeletion) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan penghapusan tidak ditemukan',
            ], 404);
        }

        $asset = $assetDeletion->asset;

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset tidak ditemukan',
            ], 404);
        }

        // Update status pengajuan menjadi diterima
        $assetDeletion->update([
            'status' => 'accepted',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan penghapusan asset diterima dan asset telah dihapus',
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/asset-deletions/{id}/rejected",
     *     tags={"Assets"},
     *     summary="Menolak pengajuan penghapusan asset",
     *     description="Menolak pengajuan penghapusan asset dengan alasan tertentu",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID AssetDeletion",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"alasan_ditolak"},
     *             @OA\Property(property="alasan_ditolak", type="string", example="Asset masih dalam kondisi baik dan masih digunakan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Pengajuan penghapusan ditolak",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Pengajuan penghapusan asset ditolak")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pengajuan penghapusan tidak ditemukan"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function rejectedDelete(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'alasan_ditolak' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }
            $assetDeletion = AssetDeletion::find($id);
            if (!$assetDeletion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pengajuan penghapusan tidak ditemukan',
                ], 404);
            }

            $assetDeletion->update([
                'status' => 'rejected',
                'alasan_ditolak' => $request->alasan_ditolak,
            ]); 

            return response()->json([
                'success' => true,
                'message' => 'Pengajuan penghapusan asset ditolak',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/asset-deletions/accepted",
     *     tags={"Assets"},
     *     summary="Get accepted asset deletions",
     *     description="Mendapatkan daftar pengajuan penghapusan asset yang telah diterima",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data pengajuan penghapusan yang diterima",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="asset_id", type="integer", example=1),
     *                     @OA\Property(property="alasan_penghapusan", type="string", example="Asset sudah rusak berat"),
     *                     @OA\Property(property="lampiran", type="string", example="dokumen.pdf"),
     *                     @OA\Property(property="status", type="string", example="diterima"),
     *                     @OA\Property(property="alasan_ditolak", type="string", example=null),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function getAssetDeletions()
    {
        $assetDeletions = AssetDeletion::with('asset')->where('status', 'diterima')->get();

        return response()->json([
            'success' => true,
            'data' => $assetDeletions,
        ]);
    }
    /**
     * @OA\Delete(
     *     path="/api/assets/{id}/delete-diskominfo",
     *     tags={"Assets"},
     *     summary="Delete asset by Diskominfo (soft delete)",
     *     description="Menghapus asset secara soft delete oleh Diskominfo. Asset, Risk, dan Risk Treatment terkait akan dihapus.",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID Asset yang akan dihapus",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Asset berhasil dihapus secara soft delete",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Asset dengan id 1 telah dihapus secara soft delete")
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
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function deleteDiskominfo($id)
    {
        try {
            $asset = Asset::find($id);

            if (!$asset) {
                return response()->json([
                    'success' => false,
                    'message' => 'Asset tidak ditemukan',
                ], 404);
            }

            // Get all risks related to this asset
            $risks = Risk::where('asset_id', $asset->id)->get();
            
            // Soft delete risk treatments for each risk
            foreach ($risks as $risk) {
                RiskTreatment::where('risiko_id', $risk->id)->delete();
            }

            // Soft delete related risks
            Risk::where('asset_id', $asset->id)->delete();
            Maintenance::where('asset_id', $asset->id)->delete();

            AssetDeletion::where('asset_id', $asset->id)->delete();
            $asset->delete();

            return response()->json([
                'success' => true,
                'message' => "Asset dengan id {$id} telah dihapus secara soft delete",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/assets/{id}/download",
     *     tags={"Assets"},
     *     summary="Generate dan download lampiran asset",
     *     description="Generate file lampiran untuk asset dan simpan ke storage, kemudian update field lampiran_url di database dengan path file yang digenerate",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID asset yang akan digenerate lampirannya",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="File berhasil digenerate dan URL disimpan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="File berhasil digenerate dan disimpan"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="lampiran_url", type="string", example="assets/lampiran/asset-123-20251215-143022.pdf"),
     *                 @OA\Property(property="download_url", type="string", example="/storage/assets/lampiran/asset-123-20251215-143022.pdf"),
     *                 @OA\Property(property="full_url", type="string", example="http://localhost/storage/assets/lampiran/asset-123-20251215-143022.pdf")
     *             )
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
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Terjadi kesalahan: [error message]")
     *         )
     *     )
     * )
     */
    public function download($id)
    {
        try {
            $asset = Asset::with(['dinas', 'kategori', 'subkategori', 'lokasi', 'penanggungjawab'])->find($id);

            if (!$asset) {
                return response()->json([
                    'success' => false,
                    'message' => 'Asset tidak ditemukan',
                ], 404);
            }

            // Generate filename
            $filename = 'asset-' . $asset->id . '-' . date('Ymd-His') . '.pdf';
            $filepath = 'assets/lampiran/' . $filename;

            // Generate konten PDF dengan Dompdf
            $html = view('pdf.asset', ['asset' => $asset])->render();

            $dompdf = new Dompdf();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            $pdfContent = $dompdf->output();

            // Simpan file ke storage (disk public -> storage/app/public)
            Storage::disk('public')->put($filepath, $pdfContent);

            // Update lampiran_url di database
            $asset->lampiran_url = $filepath;
            $asset->save();

            return response()->json([
                'success' => true,
                'message' => 'File berhasil digenerate dan disimpan',
                'data' => [
                    'lampiran_url' => $filepath,
                    'download_url' => Storage::disk('public')->url($filepath),
                    'full_url' => url(Storage::disk('public')->url($filepath)),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
