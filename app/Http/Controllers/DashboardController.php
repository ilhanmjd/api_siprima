<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetDeletion;
use App\Models\Dinas;
use App\Models\Maintenance;
use App\Models\Risk;
use App\Models\RiskTreatment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/dashboard/diskominfo",
     *     tags={"Dashboard"},
     *     summary="Dashboard statistics for Diskominfo role",
     *     description="Get system-wide statistics for IT department oversight",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard statistics retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */
    public function diskominfo()
    {
        $data = [
            'assets' => [
                'total' => Asset::count(),
                'by_status' => [
                    'pending' => Asset::where('status', 'pending')->count(),
                    'diterima' => Asset::where('status', 'diterima')->count(),
                    'ditolak' => Asset::where('status', 'ditolak')->count(),
                    'pemeliharaan' => Asset::where('status', 'pemeliharaan')->count(),
                ],
                'by_kondisi' => [
                    'baik' => Asset::where('kondisi', 'baik')->count(),
                    'rusak_ringan' => Asset::where('kondisi', 'rusak-ringan')->count(),
                    'rusak_berat' => Asset::where('kondisi', 'rusak-berat')->count(),
                ],
                'by_usage' => [
                    'active' => Asset::where('is_usage', 'active')->count(),
                    'inactive' => Asset::where('is_usage', 'inactive')->count(),
                ],
            ],
            'risks' => [
                'total' => Risk::count(),
                'by_prioritas' => [
                    'Low' => Risk::where('prioritas', 'Low')->count(),
                    'Medium' => Risk::where('prioritas', 'Medium')->count(),
                    'High' => Risk::where('prioritas', 'High')->count(),
                ],
                'by_status' => [
                    'pending' => Risk::where('status', 'pending')->count(),
                    'accepted' => Risk::where('status', 'accepted')->count(),
                    'rejected' => Risk::where('status', 'rejected')->count(),
                ],
            ],
            'deletions' => [
                'pending' => AssetDeletion::where('status', 'pending')->count(),
                'accepted' => AssetDeletion::where('status', 'accepted')->count(),
                'rejected' => AssetDeletion::where('status', 'rejected')->count(),
                'awaiting_final_delete' => AssetDeletion::where('status', 'accepted')
                    ->whereHas('asset')
                    ->count(),
            ],
            'maintenances' => [
                'total' => Maintenance::count(),
                'pending' => Maintenance::where('status_review', 'pending')->count(),
                'accepted' => Maintenance::where('status_review', 'accepted')->count(),
                'rejected' => Maintenance::where('status_review', 'rejected')->count(),
            ],
            'total_nilai_aset' => Asset::sum('nilai_perolehan'),
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/dashboard/auditor",
     *     tags={"Dashboard"},
     *     summary="Dashboard statistics for Auditor role",
     *     description="Get comprehensive system-wide monitoring and analytics",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard statistics retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */
    public function auditor()
    {
        // Overview statistics
        $overview = [
            'total_dinas' => Dinas::count(),
            'total_assets' => Asset::count(),
            'total_risks' => Risk::count(),
            'total_maintenances' => Maintenance::count(),
            'total_nilai_aset' => Asset::sum('nilai_perolehan'),
        ];

        // Assets by dinas
        $assetsByDinas = Dinas::select('dinas.id', 'dinas.nama')
            ->leftJoin('assets', 'dinas.id', '=', 'assets.dinas_id')
            ->selectRaw('COUNT(assets.id) as total_assets')
            ->selectRaw('COALESCE(SUM(assets.nilai_perolehan), 0) as total_nilai')
            ->selectRaw('SUM(CASE WHEN assets.status = "pending" THEN 1 ELSE 0 END) as pending')
            ->selectRaw('SUM(CASE WHEN assets.status = "diterima" THEN 1 ELSE 0 END) as diterima')
            ->selectRaw('SUM(CASE WHEN assets.status = "pemeliharaan" THEN 1 ELSE 0 END) as pemeliharaan')
            ->groupBy('dinas.id', 'dinas.nama')
            ->get()
            ->map(function ($item) {
                return [
                    'dinas_id' => $item->id,
                    'dinas_nama' => $item->nama,
                    'total_assets' => (int) $item->total_assets,
                    'total_nilai' => (int) $item->total_nilai,
                    'pending' => (int) $item->pending,
                    'diterima' => (int) $item->diterima,
                    'pemeliharaan' => (int) $item->pemeliharaan,
                ];
            });

        // Risks by priority
        $risksByPriority = [
            'Low' => Risk::where('prioritas', 'Low')->count(),
            'Medium' => Risk::where('prioritas', 'Medium')->count(),
            'High' => Risk::where('prioritas', 'High')->count(),
        ];

        // Risks by dinas (through assets)
        $risksByDinas = Dinas::select('dinas.id', 'dinas.nama')
            ->leftJoin('assets', 'dinas.id', '=', 'assets.dinas_id')
            ->leftJoin('risks', 'assets.id', '=', 'risks.asset_id')
            ->selectRaw('SUM(CASE WHEN risks.prioritas = "Low" THEN 1 ELSE 0 END) as low')
            ->selectRaw('SUM(CASE WHEN risks.prioritas = "Medium" THEN 1 ELSE 0 END) as medium')
            ->selectRaw('SUM(CASE WHEN risks.prioritas = "High" THEN 1 ELSE 0 END) as high')
            ->groupBy('dinas.id', 'dinas.nama')
            ->get()
            ->map(function ($item) {
                return [
                    'dinas_id' => $item->id,
                    'dinas_nama' => $item->nama,
                    'low' => (int) $item->low,
                    'medium' => (int) $item->medium,
                    'high' => (int) $item->high,
                ];
            });

        // Risk treatments by residual level
        $riskTreatmentsByResidual = [
            'low' => [
                'range' => '1-6',
                'total' => RiskTreatment::whereBetween('level_residual', [1, 6])->count(),
            ],
            'medium' => [
                'range' => '7-14',
                'total' => RiskTreatment::whereBetween('level_residual', [7, 14])->count(),
            ],
            'high' => [
                'range' => '15-25',
                'total' => RiskTreatment::whereBetween('level_residual', [15, 25])->count(),
            ],
        ];

        // Maintenances timeline (last 6 months)
        $maintenancesTimeline = Maintenance::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as total'),
            DB::raw('SUM(CASE WHEN status_review = "pending" THEN 1 ELSE 0 END) as pending'),
            DB::raw('SUM(CASE WHEN status_review = "accepted" THEN 1 ELSE 0 END) as accepted'),
            DB::raw('SUM(CASE WHEN status_review = "rejected" THEN 1 ELSE 0 END) as rejected')
        )
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'total' => (int) $item->total,
                    'pending' => (int) $item->pending,
                    'accepted' => (int) $item->accepted,
                    'rejected' => (int) $item->rejected,
                ];
            });

        // Recent activities (last 10)
        $recentActivities = collect();

        // Get recent assets
        $recentAssets = Asset::with('dinas')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($asset) {
                return [
                    'type' => 'asset',
                    'action' => 'created',
                    'dinas_nama' => $asset->dinas->nama ?? 'Unknown',
                    'description' => $asset->nama,
                    'timestamp' => $asset->created_at->toIso8601String(),
                ];
            });

        // Get recent risks
        $recentRisks = Risk::with(['asset.dinas'])
            ->where('status', '!=', 'pending')
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($risk) {
                return [
                    'type' => 'risk',
                    'action' => $risk->status === 'accepted' ? 'approved' : 'rejected',
                    'dinas_nama' => $risk->asset->dinas->nama ?? 'Unknown',
                    'description' => $risk->judul,
                    'timestamp' => $risk->updated_at->toIso8601String(),
                ];
            });

        $recentActivities = $recentAssets->concat($recentRisks)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();

        $data = [
            'overview' => $overview,
            'assets_by_dinas' => $assetsByDinas,
            'risks_by_priority' => $risksByPriority,
            'risks_by_dinas' => $risksByDinas,
            'risk_treatments_by_residual' => $riskTreatmentsByResidual,
            'maintenances_timeline' => $maintenancesTimeline,
            'recent_activities' => $recentActivities,
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/dashboard/dinas/{dinas_id}",
     *     tags={"Dashboard"},
     *     summary="Dashboard statistics for specific Dinas",
     *     description="Get detailed statistics for a specific dinas",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="dinas_id",
     *         in="path",
     *         description="ID Dinas",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dashboard statistics retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Dinas not found"
     *     )
     * )
     */
    public function dinas($dinas_id)
    {
        $dinas = Dinas::find($dinas_id);

        if (!$dinas) {
            return response()->json([
                'success' => false,
                'message' => 'Dinas tidak ditemukan',
            ], 404);
        }

        // Assets by kategori
        $assetsByKategori = Asset::select('kategoris.id as kategori_id', 'kategoris.nama as kategori_nama')
            ->join('kategoris', 'assets.kategori_id', '=', 'kategoris.id')
            ->where('assets.dinas_id', $dinas_id)
            ->selectRaw('COUNT(assets.id) as total')
            ->groupBy('kategoris.id', 'kategoris.nama')
            ->get()
            ->map(function ($item) {
                return [
                    'kategori_id' => $item->kategori_id,
                    'kategori_nama' => $item->kategori_nama,
                    'total' => (int) $item->total,
                ];
            });

        $data = [
            'dinas' => [
                'id' => $dinas->id,
                'nama' => $dinas->nama,
            ],
            'assets' => [
                'total' => Asset::where('dinas_id', $dinas_id)->count(),
                'by_kategori' => $assetsByKategori,
                'by_status' => [
                    'pending' => Asset::where('dinas_id', $dinas_id)->where('status', 'pending')->count(),
                    'diterima' => Asset::where('dinas_id', $dinas_id)->where('status', 'diterima')->count(),
                    'ditolak' => Asset::where('dinas_id', $dinas_id)->where('status', 'ditolak')->count(),
                    'pemeliharaan' => Asset::where('dinas_id', $dinas_id)->where('status', 'pemeliharaan')->count(),
                ],
                'total_nilai' => Asset::where('dinas_id', $dinas_id)->sum('nilai_perolehan'),
            ],
            'risks' => [
                'total' => Risk::whereHas('asset', function ($query) use ($dinas_id) {
                    $query->where('dinas_id', $dinas_id);
                })->count(),
                'by_prioritas' => [
                    'Low' => Risk::whereHas('asset', function ($query) use ($dinas_id) {
                        $query->where('dinas_id', $dinas_id);
                    })->where('prioritas', 'Low')->count(),
                    'Medium' => Risk::whereHas('asset', function ($query) use ($dinas_id) {
                        $query->where('dinas_id', $dinas_id);
                    })->where('prioritas', 'Medium')->count(),
                    'High' => Risk::whereHas('asset', function ($query) use ($dinas_id) {
                        $query->where('dinas_id', $dinas_id);
                    })->where('prioritas', 'High')->count(),
                ],
            ],
            'maintenances' => [
                'total' => Maintenance::whereHas('asset', function ($query) use ($dinas_id) {
                    $query->where('dinas_id', $dinas_id);
                })->count(),
                'pending' => Maintenance::whereHas('asset', function ($query) use ($dinas_id) {
                    $query->where('dinas_id', $dinas_id);
                })->where('status_review', 'pending')->count(),
                'accepted' => Maintenance::whereHas('asset', function ($query) use ($dinas_id) {
                    $query->where('dinas_id', $dinas_id);
                })->where('status_review', 'accepted')->count(),
                'rejected' => Maintenance::whereHas('asset', function ($query) use ($dinas_id) {
                    $query->where('dinas_id', $dinas_id);
                })->where('status_review', 'rejected')->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
