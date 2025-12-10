<?php

namespace App\Http\Controllers;

use App\Models\AssetDeletion;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

/**
 * @OA\Schema(
 *     schema="AssetDeletion",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="asset_id", type="integer", example=1),
 *     @OA\Property(property="alasan_penghapusan", type="string", example="Aset rusak berat dan tidak dapat diperbaiki"),
 *     @OA\Property(property="lampiran", type="string", example="asset_deletions/1234567890_bukti.pdf", nullable=true),
 *     @OA\Property(property="status", type="string", enum={"pending", "accepted", "rejected"}, example="pending"),
 *     @OA\Property(property="alasan_ditolak", type="string", example="Dokumentasi tidak lengkap", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="asset", type="object")
 * )
 */
class AssetDeletionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/asset-deletions",
     *     tags={"Asset Deletions"},
     *     summary="Get all asset deletion requests",
     *     description="Mendapatkan daftar semua pengajuan penghapusan aset",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter berdasarkan status (pending, accepted, rejected)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"pending", "accepted", "rejected"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data pengajuan penghapusan aset",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/AssetDeletion")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = AssetDeletion::with(['asset.dinas', 'asset.kategori', 'asset.subkategori', 'asset.lokasi']);

        // Filter berdasarkan status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $deletions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $deletions,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/asset-deletions/{id}",
     *     tags={"Asset Deletions"},
     *     summary="Get asset deletion request by ID",
     *     description="Mendapatkan detail pengajuan penghapusan aset berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID asset deletion",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan detail pengajuan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/AssetDeletion")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pengajuan tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Pengajuan penghapusan aset tidak ditemukan")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        $deletion = AssetDeletion::with(['asset.dinas', 'asset.kategori', 'asset.subkategori', 'asset.lokasi'])->find($id);

        if (!$deletion) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan penghapusan aset tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $deletion,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/asset-deletions",
     *     tags={"Asset Deletions"},
     *     summary="Create new asset deletion request",
     *     description="User dinas mengajukan penghapusan aset (status otomatis pending)",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"asset_id", "alasan_penghapusan"},
     *                 @OA\Property(property="asset_id", type="integer", example=1, description="ID aset yang akan dihapus"),
     *                 @OA\Property(property="alasan_penghapusan", type="string", example="Aset rusak berat dan tidak dapat diperbaiki"),
     *                 @OA\Property(property="lampiran", type="string", format="binary", description="File lampiran bukti (opsional)")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Pengajuan penghapusan berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Pengajuan penghapusan aset berhasil dibuat"),
     *             @OA\Property(property="data", ref="#/components/schemas/AssetDeletion")
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
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_id' => 'required|exists:assets,id',
            'alasan_penghapusan' => 'required|string',
            'lampiran' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ], [
            'asset_id.required' => 'ID aset harus diisi',
            'asset_id.exists' => 'Aset tidak ditemukan',
            'alasan_penghapusan.required' => 'Alasan penghapusan harus diisi',
            'lampiran.file' => 'Lampiran harus berupa file',
            'lampiran.mimes' => 'Lampiran harus berformat PDF, JPG, JPEG, atau PNG',
            'lampiran.max' => 'Ukuran lampiran maksimal 5MB',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check if asset already has pending deletion request
        $existingPending = AssetDeletion::where('asset_id', $request->asset_id)
            ->where('status', 'pending')
            ->first();

        if ($existingPending) {
            return response()->json([
                'success' => false,
                'message' => 'Aset ini sudah memiliki pengajuan penghapusan yang sedang diproses',
            ], 422);
        }

        $data = [
            'asset_id' => $request->asset_id,
            'alasan_penghapusan' => $request->alasan_penghapusan,
            'status' => 'pending',
        ];

        // Handle file upload
        if ($request->hasFile('lampiran')) {
            $file = $request->file('lampiran');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('asset_deletions', $filename, 'public');
            $data['lampiran'] = $path;
        }

        $deletion = AssetDeletion::create($data);
        $deletion->load(['asset.dinas', 'asset.kategori', 'asset.subkategori']);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan penghapusan aset berhasil dibuat',
            'data' => $deletion,
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/asset-deletions/{id}/review",
     *     tags={"Asset Deletions"},
     *     summary="Review asset deletion request (accept/reject)",
     *     description="Verifikator menerima atau menolak pengajuan penghapusan aset. Jika diterima, status aset akan diubah menjadi 'dihapus'",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID asset deletion",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"status"},
     *             @OA\Property(property="status", type="string", enum={"accepted", "rejected"}, example="accepted", description="Status review: accepted atau rejected"),
     *             @OA\Property(property="alasan_ditolak", type="string", example="Dokumentasi tidak lengkap", description="Alasan penolakan (required jika status=rejected)")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Review berhasil diproses",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Pengajuan penghapusan aset telah diterima"),
     *             @OA\Property(property="data", ref="#/components/schemas/AssetDeletion")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pengajuan tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Pengajuan tidak ditemukan")
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
     *     )
     * )
     */
    public function review(Request $request, $id)
    {
        $deletion = AssetDeletion::find($id);

        if (!$deletion) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan tidak ditemukan',
            ], 404);
        }

        // Check if already reviewed
        if ($deletion->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan sudah direview sebelumnya',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:accepted,rejected',
            'alasan_ditolak' => 'required_if:status,rejected|string',
        ], [
            'status.required' => 'Status review harus diisi',
            'status.in' => 'Status review harus accepted atau rejected',
            'alasan_ditolak.required_if' => 'Alasan ditolak harus diisi jika status rejected',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update status pengajuan
        $deletion->status = $request->status;
        
        if ($request->status === 'rejected') {
            $deletion->alasan_ditolak = $request->alasan_ditolak;
        }

        // Jika diterima, update status asset menjadi 'dihapus'
        if ($request->status === 'accepted') {
            $asset = Asset::find($deletion->asset_id);
            if ($asset) {
                $asset->status = 'dihapus';
                $asset->save();
            }
        }

        $deletion->save();
        $deletion->load(['asset.dinas', 'asset.kategori', 'asset.subkategori']);

        $message = $request->status === 'accepted' 
            ? 'Pengajuan penghapusan aset telah diterima dan status aset diubah menjadi dihapus'
            : 'Pengajuan penghapusan aset telah ditolak';

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $deletion,
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/asset-deletions/{id}",
     *     tags={"Asset Deletions"},
     *     summary="Delete asset deletion request",
     *     description="Menghapus pengajuan penghapusan aset (hanya untuk pengajuan yang masih pending)",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID asset deletion",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Pengajuan berhasil dihapus",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Pengajuan penghapusan aset berhasil dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Pengajuan tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Pengajuan tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Pengajuan sudah direview",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Tidak dapat menghapus pengajuan yang sudah direview")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        $deletion = AssetDeletion::find($id);

        if (!$deletion) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan tidak ditemukan',
            ], 404);
        }

        // Only allow deletion of pending requests
        if ($deletion->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus pengajuan yang sudah direview',
            ], 422);
        }

        // Delete file if exists
        if ($deletion->lampiran && Storage::disk('public')->exists($deletion->lampiran)) {
            Storage::disk('public')->delete($deletion->lampiran);
        }

        $deletion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan penghapusan aset berhasil dihapus',
        ]);
    }
}
