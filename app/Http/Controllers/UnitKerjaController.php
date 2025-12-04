<?php

namespace App\Http\Controllers;

use App\Models\UnitKerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UnitKerjaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/unit-kerjas",
     *     tags={"Unit Kerja"},
     *     summary="Get all unit kerjas",
     *     description="Mendapatkan daftar semua unit kerja dengan relasi dinas",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data unit kerja",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data unit kerja berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Bidang Pendidikan Dasar"),
     *                     @OA\Property(property="dinas_id", type="integer", example=1),
     *                     @OA\Property(
     *                         property="dinas",
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="name", type="string", example="Dinas Pendidikan")
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
     *             @OA\Property(property="message", type="string", example="Gagal mengambil data unit kerja"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $unitKerjas = UnitKerja::with('dinas')->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Data unit kerja berhasil diambil',
                'data' => $unitKerjas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data unit kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/unit-kerjas",
     *     tags={"Unit Kerja"},
     *     summary="Create new unit kerja",
     *     description="Membuat unit kerja baru",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "dinas_id"},
     *             @OA\Property(property="name", type="string", example="Bidang Pendidikan Dasar"),
     *             @OA\Property(property="dinas_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Unit kerja berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data unit kerja berhasil ditambahkan"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Bidang Pendidikan Dasar"),
     *                 @OA\Property(property="dinas_id", type="integer", example=1),
     *                 @OA\Property(
     *                     property="dinas",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Dinas Pendidikan")
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validasi gagal"),
     *             @OA\Property(property="errors", type="object")
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
     *             @OA\Property(property="message", type="string", example="Gagal menambahkan data unit kerja"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'dinas_id' => 'required|exists:dinas,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $unitKerja = UnitKerja::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Data unit kerja berhasil ditambahkan',
                'data' => $unitKerja->load('dinas')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan data unit kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/unit-kerjas/{id}",
     *     tags={"Unit Kerja"},
     *     summary="Get unit kerja by ID",
     *     description="Mendapatkan detail unit kerja berdasarkan ID dengan relasi dinas",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID unit kerja",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data unit kerja",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data unit kerja berhasil diambil"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Bidang Pendidikan Dasar"),
     *                 @OA\Property(property="dinas_id", type="integer", example=1),
     *                 @OA\Property(
     *                     property="dinas",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Dinas Pendidikan")
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Data tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Data unit kerja tidak ditemukan")
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
     *             @OA\Property(property="message", type="string", example="Gagal mengambil data unit kerja"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $unitKerja = UnitKerja::with('dinas')->find($id);

            if (!$unitKerja) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data unit kerja tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data unit kerja berhasil diambil',
                'data' => $unitKerja
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data unit kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/unit-kerjas/{id}",
     *     tags={"Unit Kerja"},
     *     summary="Update unit kerja",
     *     description="Memperbarui data unit kerja berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID unit kerja",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "dinas_id"},
     *             @OA\Property(property="name", type="string", example="Bidang Pendidikan Dasar"),
     *             @OA\Property(property="dinas_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Unit kerja berhasil diperbarui",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data unit kerja berhasil diperbarui"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Bidang Pendidikan Dasar"),
     *                 @OA\Property(property="dinas_id", type="integer", example=1),
     *                 @OA\Property(
     *                     property="dinas",
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Dinas Pendidikan")
     *                 ),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Data tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Data unit kerja tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validasi gagal"),
     *             @OA\Property(property="errors", type="object")
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
     *             @OA\Property(property="message", type="string", example="Gagal memperbarui data unit kerja"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $unitKerja = UnitKerja::find($id);

            if (!$unitKerja) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data unit kerja tidak ditemukan'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'dinas_id' => 'required|exists:dinas,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $unitKerja->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Data unit kerja berhasil diperbarui',
                'data' => $unitKerja->load('dinas')
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data unit kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/unit-kerjas/{id}",
     *     tags={"Unit Kerja"},
     *     summary="Delete unit kerja",
     *     description="Menghapus data unit kerja berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID unit kerja",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Unit kerja berhasil dihapus",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Data unit kerja berhasil dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Data tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Data unit kerja tidak ditemukan")
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
     *             @OA\Property(property="message", type="string", example="Gagal menghapus data unit kerja"),
     *             @OA\Property(property="error", type="string")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        try {
            $unitKerja = UnitKerja::find($id);

            if (!$unitKerja) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data unit kerja tidak ditemukan'
                ], 404);
            }

            $unitKerja->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data unit kerja berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data unit kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
