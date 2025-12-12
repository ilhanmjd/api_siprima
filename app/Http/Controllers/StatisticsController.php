<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Maintenance;
use App\Models\Risk;
use App\Models\RiskTreatment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/statistics/summary",
     *     tags={"Statistics"},
     *     summary="Get summary statistics for dashboard widgets",
     *     description="Quick statistics for dashboard overview",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Summary statistics retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */
    public function summary()
    {
        $data = [
            'assets' => [
                'total' => Asset::count(),
                'pending_approval' => Asset::where('status', 'pending')->count(),
                'in_maintenance' => Asset::where('status', 'pemeliharaan')->count(),
            ],
            'risks' => [
                'total' => Risk::count(),
                'high_priority' => Risk::where('prioritas', 'High')->count(),
                'pending_approval' => Risk::where('status', 'pending')->count(),
            ],
            'maintenances' => [
                'total' => Maintenance::count(),
                'pending_review' => Maintenance::where('status_review', 'pending')->count(),
                'this_month' => Maintenance::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->count(),
            ],
            'risk_treatments' => [
                'total' => RiskTreatment::count(),
                'high_residual' => RiskTreatment::whereBetween('level_residual', [15, 25])->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/statistics/risk-heatmap",
     *     tags={"Statistics"},
     *     summary="Get risk heatmap data for visualization",
     *     description="5x5 matrix of risk probability vs impact distribution",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Risk heatmap data retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */
    public function riskHeatmap()
    {
        // Get all risk treatments with probability and impact
        $riskTreatments = RiskTreatment::select('probabilitas_residual', 'dampak_residual')
            ->get();

        // Initialize 5x5 matrix
        $matrix = array_fill(1, 5, array_fill(1, 5, 0));

        // Count risks for each cell
        foreach ($riskTreatments as $rt) {
            $prob = $rt->probabilitas_residual ?? 0;
            $impact = $rt->dampak_residual ?? 0;

            if ($prob >= 1 && $prob <= 5 && $impact >= 1 && $impact <= 5) {
                $matrix[$prob][$impact]++;
            }
        }

        // Calculate level for each cell (level = probability × impact)
        $heatmap = [];
        for ($prob = 1; $prob <= 5; $prob++) {
            for ($impact = 1; $impact <= 5; $impact++) {
                $level = $prob * $impact;
                $category = 'low';
                
                if ($level >= 15) {
                    $category = 'high';
                } elseif ($level >= 7) {
                    $category = 'medium';
                }

                $heatmap[] = [
                    'probabilitas' => $prob,
                    'dampak' => $impact,
                    'level' => $level,
                    'category' => $category,
                    'count' => $matrix[$prob][$impact],
                ];
            }
        }

        // Summary by category
        $summary = [
            'low' => RiskTreatment::whereBetween('level_residual', [1, 6])->count(),
            'medium' => RiskTreatment::whereBetween('level_residual', [7, 14])->count(),
            'high' => RiskTreatment::whereBetween('level_residual', [15, 25])->count(),
        ];

        $data = [
            'heatmap' => $heatmap,
            'summary' => $summary,
            'total' => RiskTreatment::count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/statistics/trends",
     *     tags={"Statistics"},
     *     summary="Get historical trends data",
     *     description="Timeline data for various metrics",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="type",
     *         in="query",
     *         description="Type of trend data",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"assets", "risks", "maintenances", "all"},
     *             default="all"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="period",
     *         in="query",
     *         description="Time period grouping",
     *         required=false,
     *         @OA\Schema(
     *             type="string",
     *             enum={"daily", "weekly", "monthly", "yearly"},
     *             default="monthly"
     *         )
     *     ),
     *     @OA\Parameter(
     *         name="start_date",
     *         in="query",
     *         description="Start date (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="end_date",
     *         in="query",
     *         description="End date (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Trends data retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     )
     * )
     */
    public function trends(Request $request)
    {
        $type = $request->input('type', 'all');
        $period = $request->input('period', 'monthly');
        $startDate = $request->input('start_date', now()->subYear()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Determine date format based on period
        $dateFormat = match ($period) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%Y-%u',
            'monthly' => '%Y-%m',
            'yearly' => '%Y',
            default => '%Y-%m',
        };

        $data = [];

        // Assets trends
        if ($type === 'all' || $type === 'assets') {
            $assetsTrends = Asset::select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status = "diterima" THEN 1 ELSE 0 END) as diterima'),
                DB::raw('SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending'),
                DB::raw('SUM(CASE WHEN status = "ditolak" THEN 1 ELSE 0 END) as ditolak')
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('period')
                ->orderBy('period', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'period' => $item->period,
                        'total' => (int) $item->total,
                        'diterima' => (int) $item->diterima,
                        'pending' => (int) $item->pending,
                        'ditolak' => (int) $item->ditolak,
                    ];
                });

            $data['assets'] = $assetsTrends;
        }

        // Risks trends
        if ($type === 'all' || $type === 'risks') {
            $risksTrends = Risk::select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN prioritas = "Low" THEN 1 ELSE 0 END) as low'),
                DB::raw('SUM(CASE WHEN prioritas = "Medium" THEN 1 ELSE 0 END) as medium'),
                DB::raw('SUM(CASE WHEN prioritas = "High" THEN 1 ELSE 0 END) as high')
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('period')
                ->orderBy('period', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'period' => $item->period,
                        'total' => (int) $item->total,
                        'low' => (int) $item->low,
                        'medium' => (int) $item->medium,
                        'high' => (int) $item->high,
                    ];
                });

            $data['risks'] = $risksTrends;
        }

        // Maintenances trends
        if ($type === 'all' || $type === 'maintenances') {
            $maintenancesTrends = Maintenance::select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN status_review = "pending" THEN 1 ELSE 0 END) as pending'),
                DB::raw('SUM(CASE WHEN status_review = "accepted" THEN 1 ELSE 0 END) as accepted'),
                DB::raw('SUM(CASE WHEN status_review = "rejected" THEN 1 ELSE 0 END) as rejected')
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('period')
                ->orderBy('period', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'period' => $item->period,
                        'total' => (int) $item->total,
                        'pending' => (int) $item->pending,
                        'accepted' => (int) $item->accepted,
                        'rejected' => (int) $item->rejected,
                    ];
                });

            $data['maintenances'] = $maintenancesTrends;
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'type' => $type,
                'period' => $period,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
