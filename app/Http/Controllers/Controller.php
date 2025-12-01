<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="SIPRIMA API Documentation",
 *     version="1.0.0",
 *     description="API Documentation untuk Sistem Informasi Prima (SIPRIMA)",
 *     @OA\Contact(
 *         email="support@siprima.com"
 *     )
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Masukkan token dengan format: Bearer {token}"
 * )
 * 
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="API Server"
 * )
 */
abstract class Controller
{
    //
}
