<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

/**
 * @OA\Schema(
 *     schema="Maintenance",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="asset_id", type="integer", example=1),
 *     @OA\Property(property="risk_id", type="integer", example=1, nullable=true),
 *     @OA\Property(property="risk_treatment_id", type="integer", example=1, nullable=true),
 *     @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin"),
 *     @OA\Property(property="status", type="string", enum={"pending", "penanganan", "selesai"}, example="pending"),
 *     @OA\Property(property="bukti_lampiran", type="string", example="maintenances/1234567890_bukti.pdf", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="asset", type="object"),
 *     @OA\Property(property="risk", type="object"),
 *     @OA\Property(property="risk_treatment", type="object")
 * )
 */
class MaintenanceController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/maintenances",
     *     tags={"Maintenances"},
     *     summary="Get all maintenances",
     *     description="Mendapatkan daftar semua pemeliharaan dengan relasi asset dan risk",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter berdasarkan status (pending, penanganan, selesai)",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data maintenances",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="asset_id", type="integer", example=1),
     *                     @OA\Property(property="risk_id", type="integer", example=1),
     *                     @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin"),
     *                     @OA\Property(property="status", type="string", example="pending"),
     *                     @OA\Property(property="bukti_lampiran", type="string", example="maintenances/1234567890_bukti.pdf"),
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
    public function index(Request $request)
    {
        $query = Maintenance::with(['asset', 'risk', 'riskTreatment']);

        // Filter berdasarkan status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $maintenances = $query->get();

        return response()->json([
            'success' => true,
            'data' => $maintenances,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/maintenances/{id}",
     *     tags={"Maintenances"},
     *     summary="Get maintenance by ID",
     *     description="Mendapatkan detail pemeliharaan berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID maintenance",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data maintenance",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="risk_id", type="integer", example=1),
     *                 @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin"),
     *                 @OA\Property(property="status", type="string", example="pending"),
     *                 @OA\Property(property="bukti_lampiran", type="string", example="maintenances/1234567890_bukti.pdf"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Maintenance tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Maintenance tidak ditemukan")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        $maintenance = Maintenance::with(['asset', 'risk', 'riskTreatment'])->find($id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $maintenance,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/maintenances",
     *     tags={"Maintenances"},
     *     summary="Create new maintenance",
     *     description="Membuat pemeliharaan baru. Jika status 'penanganan', akan update status asset menjadi 'pemeliharaan'",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="risk_id", type="integer", example=1, nullable=true),
     *                 @OA\Property(property="risk_treatment_id", type="integer", example=1, nullable=true),
     *                 @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin"),
     *                 @OA\Property(property="status", type="string", enum={"pending", "penanganan", "selesai"}, example="pending"),
     *                 @OA\Property(property="bukti_lampiran", type="string", format="binary", nullable=true)
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Maintenance berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Maintenance berhasil dibuat"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="risk_id", type="integer", example=1),
     *                 @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin"),
     *                 @OA\Property(property="status", type="string", example="pending"),
     *                 @OA\Property(property="bukti_lampiran", type="string", example="maintenances/1234567890_bukti.pdf"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_id' => 'required|exists:assets,id',
            'risk_id' => 'nullable|exists:risks,id',
            'risk_treatment_id' => 'nullable|exists:risk_treatments,id',
            'alasan_pemeliharaan' => 'required|string',
            'status_pemeliharaan' => 'nullable|in:pending,penanganan,selesai',
            'status_review' => 'required|in:pending,accepted,rejected',
            'bukti_lampiran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'alasan_ditolak' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        $data['status_review'] = 'pending';
        $data['status_pemeliharaan'] = null;

        // Upload bukti lampiran jika ada
        if ($request->hasFile('bukti_lampiran')) {
            $file = $request->file('bukti_lampiran');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('maintenances', $filename, 'public');
            $data['bukti_lampiran'] = $path;
        }

        $maintenance = Maintenance::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance berhasil dibuat',
            'data' => $maintenance->load(['asset', 'risk', 'riskTreatment']),
        ], 201);
    }

    /**
     * @OA\Put(
     *     path="/api/maintenances/{id}",
     *     tags={"Maintenances"},
     *     summary="Update maintenance",
     *     description="Mengupdate data pemeliharaan. Jika status diubah menjadi 'penanganan', akan update status asset menjadi 'pemeliharaan'",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID maintenance",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema(
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="risk_id", type="integer", example=1, nullable=true),
     *                 @OA\Property(property="risk_treatment_id", type="integer", example=1, nullable=true),
     *                 @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin"),
     *                 @OA\Property(property="status", type="string", enum={"pending", "penanganan", "selesai"}, example="penanganan")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Maintenance berhasil diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Maintenance berhasil diupdate"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="risk_id", type="integer", example=1),
     *                 @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin"),
     *                 @OA\Property(property="status", type="string", example="penanganan"),
     *                 @OA\Property(property="bukti_lampiran", type="string", example="maintenances/1234567890_bukti.pdf"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Maintenance tidak ditemukan"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $maintenance = Maintenance::find($id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'asset_id' => 'sometimes|required|exists:assets,id',
            'risk_id' => 'nullable|exists:risks,id',
            'risk_treatment_id' => 'nullable|exists:risk_treatments,id',
            'alasan_pemeliharaan' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:pending,penanganan,selesai',
            'bukti_lampiran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Upload bukti lampiran jika ada
        if ($request->hasFile('bukti_lampiran')) {
            // Hapus file lama jika ada
            if ($maintenance->bukti_lampiran) {
                Storage::disk('public')->delete($maintenance->bukti_lampiran);
            }

            $file = $request->file('bukti_lampiran');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('maintenances', $filename, 'public');
            $data['bukti_lampiran'] = $path;
        }

        $oldStatus = $maintenance->status;
        $maintenance->update($data);

        // Jika status berubah menjadi "penanganan", update status asset menjadi "pemeliharaan"
        if (isset($data['status']) && $data['status'] === 'penanganan' && $oldStatus !== 'penanganan') {
            $asset = Asset::find($maintenance->asset_id);
            if ($asset) {
                $asset->update(['status' => 'pemeliharaan']);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Maintenance berhasil diupdate',
            'data' => $maintenance->load(['asset', 'risk', 'riskTreatment']),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/maintenances/{id}/approve",
     *     tags={"Maintenances"},
     *     summary="Approve a maintenance",
     *     description="Mengubah status_review maintenance menjadi accepted",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Maintenance ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Maintenance berhasil disetujui",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Maintenance berhasil disetujui"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status_review", type="string", example="accepted")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Maintenance tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Maintenance tidak ditemukan")
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
    public function approve($id)
    {
        $maintenance = Maintenance::find($id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance tidak ditemukan',
            ], 404);
        }

        $maintenance->update([
            'status_review' => 'accepted',
            'alasan_ditolak' => null,
            'status_pemeliharaan' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance berhasil disetujui',
            'data' => $maintenance->load(['asset', 'risk', 'riskTreatment']),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/maintenances/{id}/reject",
     *     tags={"Maintenances"},
     *     summary="Reject a maintenance",
     *     description="Mengubah status_review maintenance menjadi rejected dengan alasan",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Maintenance ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"alasan_ditolak"},
     *             @OA\Property(property="alasan_ditolak", type="string", example="Pemeliharaan tidak diperlukan saat ini")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Maintenance berhasil ditolak",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Maintenance berhasil ditolak"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status_review", type="string", example="rejected"),
     *                 @OA\Property(property="alasan_ditolak", type="string", example="Pemeliharaan tidak diperlukan saat ini")
     *             )
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
     *         response=404,
     *         description="Maintenance tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Maintenance tidak ditemukan")
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
    public function reject(Request $request, $id)
    {
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

        $maintenance = Maintenance::find($id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance tidak ditemukan',
            ], 404);
        }

        $maintenance->update([
            'status_review' => 'rejected',
            'alasan_ditolak' => $request->alasan_ditolak
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Maintenance berhasil ditolak',
            'data' => $maintenance->load(['asset', 'risk', 'riskTreatment']),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/maintenances/{id}/set-maintenance",
     *     tags={"Maintenances"},
     *     summary="Set maintenance status to penanganan",
     *     description="Mengubah status_pemeliharaan maintenance menjadi 'penanganan' dan status asset menjadi 'pemeliharaan'",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Maintenance ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Status pemeliharaan berhasil diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Status pemeliharaan berhasil diupdate"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status_pemeliharaan", type="string", example="penanganan"),
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Maintenance tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Maintenance tidak ditemukan")
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
    public function setMaintenance($id)
    {
        $maintenance = Maintenance::find($id);
        $asset = Asset::find($maintenance->asset_id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance tidak ditemukan',
            ], 404);
        }

        $maintenance->update(['status_pemeliharaan' => 'penanganan']);
        $asset->update(['status' => 'pemeliharaan']);

        return response()->json([
            'success' => true,
            'message' => 'Status pemeliharaan berhasil diupdate',
            'data' => $maintenance,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/maintenances/{id}/set-selesai",
     *     tags={"Maintenances"},
     *     summary="Set maintenance status to selesai",
     *     description="Mengubah status_pemeliharaan maintenance menjadi 'selesai' dan status asset menjadi 'diterima'",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Maintenance ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Status pemeliharaan berhasil diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Status pemeliharaan berhasil diupdate"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status_pemeliharaan", type="string", example="selesai"),
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="alasan_pemeliharaan", type="string", example="Perbaikan rutin")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Maintenance tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Maintenance tidak ditemukan")
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
    public function setSelesai($id)
    {
        $maintenance = Maintenance::find($id);
        $asset = Asset::find($maintenance->asset_id);

        if (!$maintenance) {
            return response()->json([
                'success' => false,
                'message' => 'Maintenance tidak ditemukan',
            ], 404);
        }

        $maintenance->update(['status_pemeliharaan' => 'selesai']);
        $asset->update(['status' => 'diterima']);  

        return response()->json([
            'success' => true,
            'message' => 'Status pemeliharaan berhasil diupdate',
            'data' => $maintenance,
        ]);
    }
}
