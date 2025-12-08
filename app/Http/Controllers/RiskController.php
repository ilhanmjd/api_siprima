<?php

namespace App\Http\Controllers;

use App\Models\Risk;
use App\Models\RiskRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RiskController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/risks",
     *     tags={"Risks"},
     *     summary="Get all risks",
     *     description="Mendapatkan daftar semua risk dengan relasi asset, dengan filter status opsional",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         description="Filter berdasarkan status (pending, rejected, accepted)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"pending", "rejected", "accepted"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data risks",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="asset_id", type="integer", example=1),
     *                     @OA\Property(property="judul", type="string", example="Risiko Kerusakan Hardware"),
     *                     @OA\Property(property="deskripsi", type="string", example="Potensi kerusakan pada komponen hardware"),
     *                     @OA\Property(property="penyebab", type="string", example="Usia perangkat sudah tua"),
     *                     @OA\Property(property="dampak", type="string", example="Gangguan operasional"),
     *                     @OA\Property(property="probabilitas", type="integer", example=3),
     *                     @OA\Property(property="nilai_dampak", type="integer", example=4),
     *                     @OA\Property(property="level_risiko", type="integer", example=12),
     *                     @OA\Property(property="kriteria", type="string", example="High"),
     *                     @OA\Property(property="prioritas", type="string", example="High"),
     *                     @OA\Property(property="status", type="string", example="pending"),
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
        $query = Risk::with(['asset', 'rejection']);

        // Filter berdasarkan status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $risks = $query->get();

        return response()->json([
            'success' => true,
            'data' => $risks,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/risks/{id}",
     *     tags={"Risks"},
     *     summary="Get risk by ID",
     *     description="Mendapatkan detail risk berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data risk",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="judul", type="string", example="Risiko Kerusakan Hardware"),
     *                 @OA\Property(property="deskripsi", type="string", example="Potensi kerusakan pada komponen hardware"),
     *                 @OA\Property(property="penyebab", type="string", example="Usia perangkat sudah tua"),
     *                 @OA\Property(property="dampak", type="string", example="Gangguan operasional"),
     *                 @OA\Property(property="probabilitas", type="integer", example=3),
     *                 @OA\Property(property="nilai_dampak", type="integer", example=4),
     *                 @OA\Property(property="level_risiko", type="integer", example=12),
     *                 @OA\Property(property="kriteria", type="string", example="High"),
     *                 @OA\Property(property="prioritas", type="string", example="High"),
     *                 @OA\Property(property="status", type="string", example="pending"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Risk tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk tidak ditemukan")
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
        $risk = Risk::with(['asset', 'rejection'])->find($id);

        if (!$risk) {
            return response()->json([
                'success' => false,
                'message' => 'Risk tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $risk,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/risks",
     *     tags={"Risks"},
     *     summary="Create new risk",
     *     description="Membuat risk baru dengan status otomatis pending",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"asset_id", "judul", "deskripsi", "penyebab", "dampak", "probabilitas", "nilai_dampak", "level_risiko", "kriteria", "prioritas"},
     *             @OA\Property(property="asset_id", type="integer", example=1),
     *             @OA\Property(property="judul", type="string", example="Risiko Kerusakan Hardware"),
     *             @OA\Property(property="deskripsi", type="string", example="Potensi kerusakan pada komponen hardware"),
     *             @OA\Property(property="penyebab", type="string", example="Usia perangkat sudah tua"),
     *             @OA\Property(property="dampak", type="string", example="Gangguan operasional"),
     *             @OA\Property(property="probabilitas", type="integer", example=3),
     *             @OA\Property(property="nilai_dampak", type="integer", example=4),
     *             @OA\Property(property="level_risiko", type="integer", example=12),
     *             @OA\Property(property="kriteria", type="string", enum={"Low", "Medium", "High"}, example="High"),
     *             @OA\Property(property="prioritas", type="string", enum={"Low", "Medium", "High"}, example="High")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Risk berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Risk berhasil dibuat"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="asset_id", type="integer", example=1),
     *                 @OA\Property(property="judul", type="string", example="Risiko Kerusakan Hardware"),
     *                 @OA\Property(property="status", type="string", example="pending")
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
            'asset_id' => 'required|exists:assets,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string|max:255',
            'penyebab' => 'required|string|max:255',
            'dampak' => 'required|string|max:255',
            'probabilitas' => 'required|integer',
            'nilai_dampak' => 'required|integer',
            'level_risiko' => 'required|integer',
            'kriteria' => 'required|in:Low,Medium,High',
            'prioritas' => 'required|in:Low,Medium,High',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        $data['status'] = 'pending'; // Status otomatis pending

        $risk = Risk::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Risk berhasil dibuat',
            'data' => $risk,
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/risks/{id}/reject",
     *     tags={"Risks"},
     *     summary="Reject a risk",
     *     description="Mengubah status risk menjadi rejected dengan alasan",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"alasan"},
     *             @OA\Property(property="alasan", type="string", example="Risiko tidak relevan dengan kondisi aset saat ini")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Risk berhasil ditolak",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Risk berhasil ditolak"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status", type="string", example="rejected"),
     *                 @OA\Property(
     *                     property="rejection",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="risk_id", type="integer", example=1),
     *                     @OA\Property(property="alasan", type="string", example="Risiko tidak relevan dengan kondisi aset saat ini")
     *                 )
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
     *         description="Risk tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk tidak ditemukan")
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
            'alasan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $risk = Risk::find($id);

        if (!$risk) {
            return response()->json([
                'success' => false,
                'message' => 'Risk tidak ditemukan',
            ], 404);
        }

        $risk->update(['status' => 'rejected']);

        // Create or update rejection reason
        RiskRejected::updateOrCreate(
            ['risk_id' => $risk->id],
            ['alasan' => $request->alasan]
        );

        $risk->load('rejection');

        return response()->json([
            'success' => true,
            'message' => 'Risk berhasil ditolak',
            'data' => $risk,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/risks/{id}/approve",
     *     tags={"Risks"},
     *     summary="Approve a risk",
     *     description="Mengubah status risk menjadi accepted",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Risk berhasil disetujui",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Risk berhasil disetujui"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status", type="string", example="accepted")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Risk tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk tidak ditemukan")
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
        $risk = Risk::find($id);

        if (!$risk) {
            return response()->json([
                'success' => false,
                'message' => 'Risk tidak ditemukan',
            ], 404);
        }

        $risk->update(['status' => 'accepted']);

        return response()->json([
            'success' => true,
            'message' => 'Risk berhasil disetujui',
            'data' => $risk,
        ]);
    }
}
