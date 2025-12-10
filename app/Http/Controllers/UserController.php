<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/users/by-dinas/{dinas_id}",
     *     tags={"Users"},
     *     summary="Get users by dinas",
     *     description="Mendapatkan daftar user berdasarkan dinas_id",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="dinas_id",
     *         in="path",
     *         description="ID dari dinas",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data user",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data user berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="John Doe"),
     *                     @OA\Property(property="email", type="string", example="john@example.com"),
     *                     @OA\Property(property="nip", type="string", example="123456789"),
     *                     @OA\Property(property="jenis_kelamin", type="string", example="L"),
     *                     @OA\Property(property="dinas_id", type="integer", example=1),
     *                     @OA\Property(property="unit_kerja_id", type="integer", example=1),
     *                     @OA\Property(property="role_id", type="integer", example=1),
     *                     @OA\Property(
     *                         property="dinas",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Dinas Pendidikan")
     *                     ),
     *                     @OA\Property(
     *                         property="unit_kerja",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Unit IT")
     *                     ),
     *                     @OA\Property(
     *                         property="role",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Admin")
     *                     ),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time")
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
     *             @OA\Property(property="message", type="string", example="Gagal mengambil data user"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function getByDinas($dinas_id)
    {
        try {
            $users = User::with(['dinas', 'unitKerja', 'role'])
                ->where('dinas_id', $dinas_id)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data user berhasil diambil',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
