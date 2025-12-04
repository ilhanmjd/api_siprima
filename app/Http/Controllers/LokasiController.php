<?php

namespace App\Http\Controllers;

use App\Models\Lokasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LokasiController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/lokasis",
     *     tags={"Lokasi"},
     *     summary="Get all lokasis",
     *     description="Mendapatkan daftar semua lokasi",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data lokasis",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="Gedung A"),
     *                     @OA\Property(property="alamat", type="string", example="Jl. Sudirman No. 123"),
     *                     @OA\Property(property="latitude", type="string", example="-6.200000"),
     *                     @OA\Property(property="longitude", type="string", example="106.816666"),
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
     *     )
     * )
     */
    public function index()
    {
        $lokasis = Lokasi::all();

        return response()->json([
            'success' => true,
            'data' => $lokasis,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/lokasis",
     *     tags={"Lokasi"},
     *     summary="Create new lokasi",
     *     description="Membuat lokasi baru",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nama", "alamat"},
     *             @OA\Property(property="nama", type="string", example="Gedung A"),
     *             @OA\Property(property="alamat", type="string", example="Jl. Sudirman No. 123"),
     *             @OA\Property(property="latitude", type="string", example="-6.200000"),
     *             @OA\Property(property="longitude", type="string", example="106.816666")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Lokasi berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Lokasi berhasil dibuat"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $lokasi = Lokasi::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil dibuat',
            'data' => $lokasi,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/lokasis/{id}",
     *     tags={"Lokasi"},
     *     summary="Get lokasi by ID",
     *     description="Mendapatkan detail lokasi berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Lokasi ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan detail lokasi",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lokasi tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Lokasi tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $lokasi,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/lokasis/{id}",
     *     tags={"Lokasi"},
     *     summary="Update lokasi",
     *     description="Mengupdate data lokasi berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Lokasi ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nama", type="string", example="Gedung A"),
     *             @OA\Property(property="alamat", type="string", example="Jl. Sudirman No. 123"),
     *             @OA\Property(property="latitude", type="string", example="-6.200000"),
     *             @OA\Property(property="longitude", type="string", example="106.816666")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lokasi berhasil diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Lokasi berhasil diupdate"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lokasi tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Lokasi tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation error"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|required|string|max:255',
            'alamat' => 'sometimes|required|string',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $lokasi->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil diupdate',
            'data' => $lokasi,
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/lokasis/{id}",
     *     tags={"Lokasi"},
     *     summary="Delete lokasi",
     *     description="Menghapus lokasi berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Lokasi ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lokasi berhasil dihapus",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Lokasi berhasil dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Lokasi tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Lokasi tidak ditemukan")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function destroy($id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi tidak ditemukan',
            ], 404);
        }

        $lokasi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lokasi berhasil dihapus',
        ]);
    }
}
