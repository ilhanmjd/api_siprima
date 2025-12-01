<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DataMasterController;
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
    });
});