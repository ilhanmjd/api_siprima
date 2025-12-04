<?php

use App\Http\Controllers\SsoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sso/callback', [SsoController::class, 'handleCallback']);