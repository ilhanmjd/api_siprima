<?php

namespace App\Http\Controllers;

use App\Models\RiskTreatmentRejected;
use Illuminate\Http\Request;

class RiskTreatmentRejectedController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/risk-treatment-rejecteds",
     *     tags={"Risk Treatment Rejecteds"},
     *     summary="Get all rejected risk treatments",
     *     description="Mendapatkan daftar semua risk treatment yang ditolak beserta alasannya",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="risk_treatment_id",
     *         in="query",
     *         description="Filter berdasarkan risk treatment ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data rejected risk treatments",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data rejected risk treatments berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="risk_treatment_id", type="integer", example=3),
     *                     @OA\Property(property="alasan", type="string", example="Penanganan tidak efektif dan perlu revisi"),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time"),
     *                     @OA\Property(
     *                         property="risk_treatment",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=3),
     *                         @OA\Property(property="jenis_penanganan", type="string", example="mitigate"),
     *                         @OA\Property(property="deskripsi_penanganan", type="string", example="Implementasi firewall"),
     *                         @OA\Property(property="status", type="string", example="rejected")
     *                     )
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
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Gagal mengambil data rejected risk treatments"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        try {
            $query = RiskTreatmentRejected::with('riskTreatment');

            // Filter berdasarkan risk_treatment_id
            if ($request->has('risk_treatment_id')) {
                $query->where('risk_treatment_id', $request->risk_treatment_id);
            }

            $rejectedTreatments = $query->get();

            return response()->json([
                'success' => true,
                'message' => 'Data rejected risk treatments berhasil diambil',
                'data' => $rejectedTreatments
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data rejected risk treatments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/risk-treatment-rejecteds/{id}",
     *     tags={"Risk Treatment Rejecteds"},
     *     summary="Get rejected risk treatment by ID",
     *     description="Mendapatkan detail rejected risk treatment berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk Treatment Rejected ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan detail rejected risk treatment",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data rejected risk treatment berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="risk_treatment_id", type="integer", example=3),
     *                 @OA\Property(property="alasan", type="string", example="Penanganan tidak efektif dan perlu revisi"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time"),
     *                 @OA\Property(
     *                     property="risk_treatment",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=3),
     *                     @OA\Property(property="jenis_penanganan", type="string", example="mitigate")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Rejected risk treatment tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Rejected risk treatment tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Gagal mengambil data rejected risk treatment"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $rejectedTreatment = RiskTreatmentRejected::with('riskTreatment')->find($id);

            if (!$rejectedTreatment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rejected risk treatment tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data rejected risk treatment berhasil diambil',
                'data' => $rejectedTreatment
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data rejected risk treatment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
