<?php

namespace App\Http\Controllers;

use App\Models\RiskTreatment;
use App\Models\RiskTreatmentRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RiskTreatmentController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/risk-treatments",
     *     tags={"Risk Treatments"},
     *     summary="Get all risk treatments",
     *     description="Mendapatkan daftar semua risk treatment dengan relasi, dengan filter status opsional",
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
     *         description="Berhasil mendapatkan data risk treatments",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="risiko_id", type="integer", example=1),
     *                     @OA\Property(property="strategi", type="string", example="Mitigasi"),
     *                     @OA\Property(property="pengendalian", type="string", example="Backup rutin"),
     *                     @OA\Property(property="penanggung_jawab_id", type="integer", example=1),
     *                     @OA\Property(property="target_tanggal", type="string", format="date", example="2025-12-31"),
     *                     @OA\Property(property="biaya", type="integer", example=5000000),
     *                     @OA\Property(property="probabilitas_akhir", type="integer", example=1),
     *                     @OA\Property(property="dampak_akhir", type="integer", example=2),
     *                     @OA\Property(property="level_residual", type="integer", example=2),
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
        $query = RiskTreatment::with(['risk.asset', 'penanggungjawab', 'rejection']);

        // Filter berdasarkan status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $riskTreatments = $query->get();

        return response()->json([
            'success' => true,
            'data' => $riskTreatments,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/risk-treatments/{id}",
     *     tags={"Risk Treatments"},
     *     summary="Get risk treatment by ID",
     *     description="Mendapatkan detail risk treatment berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk Treatment ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data risk treatment",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="risiko_id", type="integer", example=1),
     *                 @OA\Property(property="strategi", type="string", example="Mitigasi"),
     *                 @OA\Property(property="pengendalian", type="string", example="Backup rutin"),
     *                 @OA\Property(property="penanggung_jawab_id", type="integer", example=1),
     *                 @OA\Property(property="target_tanggal", type="string", format="date", example="2025-12-31"),
     *                 @OA\Property(property="biaya", type="integer", example=5000000),
     *                 @OA\Property(property="probabilitas_akhir", type="integer", example=1),
     *                 @OA\Property(property="dampak_akhir", type="integer", example=2),
     *                 @OA\Property(property="level_residual", type="integer", example=2),
     *                 @OA\Property(property="status", type="string", example="pending"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Risk treatment tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk treatment tidak ditemukan")
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
        $riskTreatment = RiskTreatment::with(['risk.asset', 'penanggungjawab', 'rejection'])->find($id);

        if (!$riskTreatment) {
            return response()->json([
                'success' => false,
                'message' => 'Risk treatment tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $riskTreatment,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/risk-treatments",
     *     tags={"Risk Treatments"},
     *     summary="Create new risk treatment",
     *     description="Membuat risk treatment baru dengan status otomatis pending",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"risiko_id", "strategi", "pengendalian", "penanggung_jawab_id", "target_tanggal", "biaya", "probabilitas_akhir", "dampak_akhir", "level_residual"},
     *             @OA\Property(property="risiko_id", type="integer", example=1),
     *             @OA\Property(property="strategi", type="string", example="Mitigasi"),
     *             @OA\Property(property="pengendalian", type="string", example="Backup rutin setiap hari"),
     *             @OA\Property(property="penanggung_jawab_id", type="integer", example=1),
     *             @OA\Property(property="target_tanggal", type="string", format="date", example="2025-12-31"),
     *             @OA\Property(property="biaya", type="integer", example=5000000),
     *             @OA\Property(property="probabilitas_akhir", type="integer", example=1),
     *             @OA\Property(property="dampak_akhir", type="integer", example=2),
     *             @OA\Property(property="level_residual", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Risk treatment berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Risk treatment berhasil dibuat"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="risiko_id", type="integer", example=1),
     *                 @OA\Property(property="strategi", type="string", example="Mitigasi"),
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
            'risiko_id' => 'required|exists:risks,id',
            'strategi' => 'required|string|max:255',
            'pengendalian' => 'required|string|max:255',
            'penanggung_jawab_id' => 'required|exists:penanggungjawabs,id',
            'target_tanggal' => 'required|date',
            'biaya' => 'required|integer|min:0',
            'probabilitas_akhir' => 'required|integer|min:1|max:5',
            'dampak_akhir' => 'required|integer|min:1|max:5',
            'level_residual' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $riskTreatment = RiskTreatment::create([
            'risiko_id' => $request->risiko_id,
            'strategi' => $request->strategi,
            'pengendalian' => $request->pengendalian,
            'penanggung_jawab_id' => $request->penanggung_jawab_id,
            'target_tanggal' => $request->target_tanggal,
            'biaya' => $request->biaya,
            'probabilitas_akhir' => $request->probabilitas_akhir,
            'dampak_akhir' => $request->dampak_akhir,
            'level_residual' => $request->level_residual,
            'status' => 'pending', // Status otomatis pending
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Risk treatment berhasil dibuat',
            'data' => $riskTreatment,
        ], 201);
    }

    /**
     * @OA\Post(
     *     path="/api/risk-treatments/{id}/reject",
     *     tags={"Risk Treatments"},
     *     summary="Reject a risk treatment",
     *     description="Menolak risk treatment dengan memberikan alasan",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk Treatment ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"alasan"},
     *             @OA\Property(property="alasan", type="string", example="Budget tidak mencukupi")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Risk treatment berhasil ditolak",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Risk treatment berhasil ditolak"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="status", type="string", example="rejected"),
     *                 @OA\Property(
     *                     property="rejection",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="alasan", type="string", example="Budget tidak mencukupi")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Risk treatment tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk treatment tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error atau status bukan pending",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk treatment hanya bisa ditolak jika statusnya pending")
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
        $riskTreatment = RiskTreatment::find($id);

        if (!$riskTreatment) {
            return response()->json([
                'success' => false,
                'message' => 'Risk treatment tidak ditemukan',
            ], 404);
        }

        if ($riskTreatment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Risk treatment hanya bisa ditolak jika statusnya pending',
            ], 422);
        }

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

        $riskTreatment->update(['status' => 'rejected']);

        RiskTreatmentRejected::create([
            'risk_treatment_id' => $riskTreatment->id,
            'alasan' => $request->alasan,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Risk treatment berhasil ditolak',
            'data' => $riskTreatment->load('rejection'),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/risk-treatments/{id}/approve",
     *     tags={"Risk Treatments"},
     *     summary="Approve a risk treatment",
     *     description="Menyetujui risk treatment",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk Treatment ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Risk treatment berhasil disetujui",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Risk treatment berhasil disetujui"),
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
     *         description="Risk treatment tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk treatment tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Status bukan pending",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Risk treatment hanya bisa disetujui jika statusnya pending")
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
        $riskTreatment = RiskTreatment::find($id);

        if (!$riskTreatment) {
            return response()->json([
                'success' => false,
                'message' => 'Risk treatment tidak ditemukan',
            ], 404);
        }

        if ($riskTreatment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Risk treatment hanya bisa disetujui jika statusnya pending',
            ], 422);
        }

        $riskTreatment->update(['status' => 'accepted']);

        return response()->json([
            'success' => true,
            'message' => 'Risk treatment berhasil disetujui',
            'data' => $riskTreatment,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/risk-treatments/statistics/by-residual-level",
     *     tags={"Risk Treatments"},
     *     summary="Get risk treatment statistics by residual level",
     *     description="Mendapatkan total risk treatment berdasarkan pengelompokan level residual (Low: 1-6, Medium: 7-14, High: 15-25)",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan statistik risk treatment",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="low",
     *                     type="object",
     *                     @OA\Property(property="range", type="string", example="1-6"),
     *                     @OA\Property(property="total", type="integer", example=10)
     *                 ),
     *                 @OA\Property(
     *                     property="medium",
     *                     type="object",
     *                     @OA\Property(property="range", type="string", example="7-14"),
     *                     @OA\Property(property="total", type="integer", example=15)
     *                 ),
     *                 @OA\Property(
     *                     property="high",
     *                     type="object",
     *                     @OA\Property(property="range", type="string", example="15-25"),
     *                     @OA\Property(property="total", type="integer", example=5)
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
    public function statisticsByResidualLevel()
    {
        $lowCount = RiskTreatment::whereBetween('level_residual', [1, 6])->count();
        $mediumCount = RiskTreatment::whereBetween('level_residual', [7, 14])->count();
        $highCount = RiskTreatment::whereBetween('level_residual', [15, 25])->count();

        return response()->json([
            'success' => true,
            'data' => [
                'low' => [
                    'range' => '1-6',
                    'total' => $lowCount,
                ],
                'medium' => [
                    'range' => '7-14',
                    'total' => $mediumCount,
                ],
                'high' => [
                    'range' => '15-25',
                    'total' => $highCount,
                ],
            ],
        ]);
    }
}
