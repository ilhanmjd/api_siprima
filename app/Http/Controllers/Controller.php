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
 * 
 * @OA\Tag(
 *     name="SSO Authentication",
 *     description="Endpoint untuk Single Sign-On authentication"
 * )
 * @OA\Tag(
 *     name="Authentication",
 *     description="Endpoint untuk autentikasi user"
 * )
 * @OA\Tag(
 *     name="Data Master",
 *     description="Endpoint untuk data master (kategori, subkategori, lokasi, penanggung jawab)"
 * )
 * @OA\Tag(
 *     name="Assets",
 *     description="Endpoint untuk manajemen asset"
 * )
 * @OA\Tag(
 *     name="Dinas",
 *     description="Endpoint untuk manajemen dinas"
 * )
 * @OA\Tag(
 *     name="Unit Kerja",
 *     description="Endpoint untuk manajemen unit kerja"
 * )
 * @OA\Tag(
 *     name="Lokasi",
 *     description="Endpoint untuk manajemen lokasi"
 * )
 * @OA\Tag(
 *     name="Sub Kategori",
 *     description="Endpoint untuk manajemen sub kategori"
 * )
 * @OA\Tag(
 *     name="Penanggungjawab",
 *     description="Endpoint untuk manajemen penanggung jawab"
 * )
 */
abstract class Controller
{
    //
}
