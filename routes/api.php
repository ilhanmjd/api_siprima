<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\DinasController;
use App\Http\Controllers\UnitKerjaController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\SubKategoriController;
use App\Http\Controllers\PenanggungjawabController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\SsoController;
use App\Http\Controllers\RiskController;
use App\Http\Controllers\RiskTreatmentController;
use App\Http\Controllers\RiskRejectedController;
use App\Http\Controllers\RiskTreatmentRejectedController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\AssetDeletionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StatisticsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/sso/callback', [SsoController::class, 'handleCallback']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::prefix('assets')->group(function () {
        Route::get('/', [AssetController::class, 'index']);
        Route::get('/active', [AssetController::class, 'getActive']);
        Route::post('/', [AssetController::class, 'store']);
        Route::get('/{id}', [AssetController::class, 'show']);
        Route::put('/{id}', [AssetController::class, 'update']);
        // Route::delete('/{id}', [AssetController::class, 'destroy']);
        Route::post('/{id}/pengajuan-delete', [AssetController::class, 'pengajuanDelete']);
       
        Route::get('/all/asset-deletions', [AssetController::class, 'getAllAssetDeletions']);
        Route::post('/{id}/delete-diskominfo', [AssetController::class, 'diskominfo']);

    });

    Route::prefix('asset-deletions')->group(function () {
        Route::get('/', [AssetDeletionController::class, 'index']);
        Route::post('/', [AssetDeletionController::class, 'store']);
        Route::get('/{id}', [AssetDeletionController::class, 'show']);
        Route::put('/{id}/review', [AssetDeletionController::class, 'review']);
        Route::delete('/{id}', [AssetDeletionController::class, 'destroy']);
        Route::post('/{id}/accepted', [AssetController::class, 'acceptedDelete']);
        Route::post('/{id}/rejected', [AssetController::class, 'rejectedDelete']);
        
    });

    Route::prefix('kategoris')->group(function () {
        Route::get('/', [KategoriController::class, 'index']);
        Route::post('/', [KategoriController::class, 'store']);
        Route::get('/{id}', [KategoriController::class, 'show']);
        Route::put('/{id}', [KategoriController::class, 'update']);
        Route::delete('/{id}', [KategoriController::class, 'destroy']);
    });

    Route::prefix('sub-kategoris')->group(function () {
        Route::get('/', [SubKategoriController::class, 'index']);
        Route::post('/', [SubKategoriController::class, 'store']);
        Route::get('/{id}', [SubKategoriController::class, 'show']);
        Route::put('/{id}', [SubKategoriController::class, 'update']);
        Route::delete('/{id}', [SubKategoriController::class, 'destroy']);
    });

    Route::prefix('penanggungjawabs')->group(function () {
        Route::get('/', [PenanggungjawabController::class, 'index']);
        Route::post('/', [PenanggungjawabController::class, 'store']);
        Route::get('/{id}', [PenanggungjawabController::class, 'show']);
        Route::put('/{id}', [PenanggungjawabController::class, 'update']);
        Route::delete('/{id}', [PenanggungjawabController::class, 'destroy']);
    });

    Route::prefix('lokasis')->group(function () {
        Route::get('/', [LokasiController::class, 'index']);
        Route::post('/', [LokasiController::class, 'store']);
        Route::get('/{id}', [LokasiController::class, 'show']);
        Route::put('/{id}', [LokasiController::class, 'update']);
        Route::delete('/{id}', [LokasiController::class, 'destroy']);
    });

    Route::prefix('dinas')->group(function () {
        Route::get('/', [DinasController::class, 'index']);
        Route::post('/', [DinasController::class, 'store']);
        Route::get('/{id}', [DinasController::class, 'show']);
        Route::put('/{id}', [DinasController::class, 'update']);
        Route::delete('/{id}', [DinasController::class, 'destroy']);
    });

    Route::prefix('unit-kerjas')->group(function () {
        Route::get('/', [UnitKerjaController::class, 'index']);
        Route::post('/', [UnitKerjaController::class, 'store']);
        Route::get('/{id}', [UnitKerjaController::class, 'show']);
        Route::put('/{id}', [UnitKerjaController::class, 'update']);
        Route::delete('/{id}', [UnitKerjaController::class, 'destroy']);
    });

    Route::prefix('risks')->group(function () {
        Route::get('/', [RiskController::class, 'index']);
        Route::post('/', [RiskController::class, 'store']);
        Route::get('/{id}', [RiskController::class, 'show']);
        Route::post('/{id}/reject', [RiskController::class, 'reject']);
        Route::post('/{id}/approve', [RiskController::class, 'approve']);
    });

    Route::prefix('risk-treatments')->group(function () {
        Route::get('/', [RiskTreatmentController::class, 'index']);
        Route::post('/', [RiskTreatmentController::class, 'store']);
        Route::get('/statistics/by-residual-level', [RiskTreatmentController::class, 'statisticsByResidualLevel']);
        Route::get('/{id}', [RiskTreatmentController::class, 'show']);
        Route::post('/{id}/reject', [RiskTreatmentController::class, 'reject']);
        Route::post('/{id}/approve', [RiskTreatmentController::class, 'approve']);
    });

    Route::prefix('maintenances')->group(function () {
        Route::get('/', [MaintenanceController::class, 'index']);
        Route::post('/', [MaintenanceController::class, 'store']);
        Route::get('/{id}', [MaintenanceController::class, 'show']);
        Route::put('/{id}', [MaintenanceController::class, 'update']);
        Route::post('/{id}/approve', [MaintenanceController::class, 'approve']);
        Route::post('/{id}/reject', [MaintenanceController::class, 'reject']);
        Route::post('/{id}/set-maintenance', [MaintenanceController::class, 'setMaintenance']);
        Route::post('/{id}/set-selesai', [MaintenanceController::class, 'setSelesai']);
    });

    Route::prefix('asset-deletions')->group(function () {
        Route::get('/', [AssetDeletionController::class, 'index']);
        Route::post('/', [AssetDeletionController::class, 'store']);
        Route::get('/{id}', [AssetDeletionController::class, 'show']);
        Route::put('/{id}/review', [AssetDeletionController::class, 'review']);
        Route::delete('/{id}', [AssetDeletionController::class, 'destroy']);
    });

    Route::prefix('users')->group(function () {
        Route::get('/by-dinas/{dinas_id}', [UserController::class, 'getByDinas']);
    });

    Route::prefix('risk-rejecteds')->group(function () {
        Route::get('/', [RiskRejectedController::class, 'index']);
        Route::get('/{id}', [RiskRejectedController::class, 'show']);
    });

    Route::prefix('risk-treatment-rejecteds')->group(function () {
        Route::get('/', [RiskTreatmentRejectedController::class, 'index']);
        Route::get('/{id}', [RiskTreatmentRejectedController::class, 'show']);
    });

    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/diskominfo', [DashboardController::class, 'diskominfo']);
        Route::get('/auditor', [DashboardController::class, 'auditor']);
        Route::get('/dinas/{dinas_id}', [DashboardController::class, 'dinas']);
    });

    // Statistics routes
    Route::prefix('statistics')->group(function () {
        Route::get('/summary', [StatisticsController::class, 'summary']);
        Route::get('/risk-heatmap', [StatisticsController::class, 'riskHeatmap']);
        Route::get('/trends', [StatisticsController::class, 'trends']);
    });
});