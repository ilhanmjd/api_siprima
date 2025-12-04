<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DataMasterController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\DinasController;
use App\Http\Controllers\UnitKerjaController;
use App\Http\Controllers\SubKategoriController;
use App\Http\Controllers\PenanggungjawabController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\SsoController;
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


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    route::prefix('data-master')->group(function () {        
        Route::get('/kategori', [DataMasterController::class, 'kategori']);
        Route::get('/sub-kategori', [DataMasterController::class, 'subKategori']);
        Route::get('/lokasi', [DataMasterController::class, 'lokasi']);
        Route::get('/penanggung-jawab', [DataMasterController::class, 'penanggungJawab']);
    });

    Route::prefix('assets')->group(function () {
        Route::get('/', [AssetController::class, 'index']);
        Route::post('/', [AssetController::class, 'store']);
        Route::get('/{id}', [AssetController::class, 'show']);
        Route::put('/{id}', [AssetController::class, 'update']);
        Route::delete('/{id}', [AssetController::class, 'destroy']);
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
});