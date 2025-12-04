<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SsoController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/sso/callback",
     *     tags={"SSO Authentication"},
     *     summary="Handle SSO Callback",
     *     description="Menangani callback dari SSO server, membuat atau mengupdate user, dan generate token",
     *     @OA\Parameter(
     *         name="token",
     *         in="query",
     *         description="Token dari SSO server",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful authentication",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="user",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Admin Kota"),
     *                     @OA\Property(property="email", type="string", example="admin.kota@example.com"),
     *                     @OA\Property(property="email_verified_at", type="string", format="date-time", example="2025-11-27T22:05:05.000000Z"),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2025-11-27T22:05:05.000000Z"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-11-27T22:05:05.000000Z")
     *                 ),
     *                 @OA\Property(property="token", type="string", example="1|abcdefghijklmnopqrstuvwxyz123456"),
     *                 @OA\Property(
     *                     property="menu",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="name", type="string", example="Asset Management"),
     *                         @OA\Property(property="url", type="string", example="http://127.0.0.1:8000/api/v1/auth/sso/direct-login?redirect=/"),
     *                         @OA\Property(property="logo", type="string", example="siprima.png"),
     *                         @OA\Property(property="description", type="string", example="Aset Management System")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Authentication failed",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Failed to authenticate with SSO")
     *         )
     *     )
     * )
     */
    public function handleCallback(Request $request)
    {   
        $token = $request->token;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get('https://api.bispro.digitaltech.my.id/api/v2/auth/me');

        if (!$response->successful()) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to authenticate with SSO'
            ], 401);
        }

        $ssoData = $response->json();
        
        if (!isset($ssoData['success']) || !$ssoData['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid SSO response'
            ], 401);
        }

        $userData = $ssoData['data']['user'];

        // Cari atau buat user baru
        $user = User::updateOrCreate(
            ['email' => $userData['email']], // Cari berdasarkan email
            [
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => bcrypt(Str::random(32)), // Random password untuk SSO user
                'email_verified_at' => $userData['email_verified_at'] ?? now(),
                'dinas_id' => $userData['dinas_id'] ?? 1, // Default ke dinas_id 1 jika tidak ada
                'unit_kerja_id' => $userData['unit_kerja_id'] ?? 1, // Default ke unit_kerja_id 1 jika tidak ada
                'role_id' => $userData['role_id'] ?? 1, // Default ke role_id 1 jika tidak ada
            ]
        );

        // Buat token untuk user
        $userToken = $user->createToken('sso-token')->plainTextToken;

        // Redirect ke frontend dengan token
        $frontendUrl = 'https://siprima.digitaltech.my.id/';
        $redirectUrl = $frontendUrl . '?token=' . urlencode($userToken);
        
        return redirect($redirectUrl);
    }
}
