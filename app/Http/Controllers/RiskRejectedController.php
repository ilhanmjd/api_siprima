<?php

namespace App\Http\Controllers;

use App\Models\RiskRejected;
use Illuminate\Http\Request;

class RiskRejectedController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/risk-rejecteds",
     *     tags={"Risk Rejecteds"},
     *     summary="Get all rejected risks",
     *     description="Mendapatkan daftar semua risk yang ditolak beserta alasannya",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="risk_id",
     *         in="query",
     *         description="Filter berdasarkan risk ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data rejected risks",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data rejected risks berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="risk_id", type="integer", example=5),
     *                     @OA\Property(property="alasan", type="string", example="Data tidak lengkap dan tidak sesuai dengan standar"),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time"),
     *                     @OA\Property(
     *                         property="risk",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=5),
     *                         @OA\Property(property="nama_risiko", type="string", example="Risiko Keamanan Data"),
     *                         @OA\Property(property="deskripsi", type="string", example="Potensi kebocoran data"),
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
     *             @OA\Property(property="message", type="string", example="Gagal mengambil data rejected risks"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        try {
            $query = RiskRejected::with('risk');

            // Filter berdasarkan risk_id
            if ($request->has('risk_id')) {
                $query->where('risk_id', $request->risk_id);
            }

            $rejectedRisks = $query->get();

            return response()->json([
                'success' => true,
                'message' => 'Data rejected risks berhasil diambil',
                'data' => $rejectedRisks
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data rejected risks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/risk-rejecteds/{id}",
     *     tags={"Risk Rejecteds"},
     *     summary="Get rejected risk by ID",
     *     description="Mendapatkan detail rejected risk berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Risk Rejected ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan detail rejected risk",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data rejected risk berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="risk_id", type="integer", example=5),
     *                 @OA\Property(property="alasan", type="string", example="Data tidak lengkap dan tidak sesuai dengan standar"),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time"),
     *                 @OA\Property(
     *                     property="risk",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=5),
     *                     @OA\Property(property="nama_risiko", type="string", example="Risiko Keamanan Data")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Rejected risk tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Rejected risk tidak ditemukan")
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
     *             @OA\Property(property="message", type="string", example="Gagal mengambil data rejected risk"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $rejectedRisk = RiskRejected::with('risk')->find($id);

            if (!$rejectedRisk) {
                return response()->json([
                    'success' => false,
                    'message' => 'Rejected risk tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data rejected risk berhasil diambil',
                'data' => $rejectedRisk
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data rejected risk',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
