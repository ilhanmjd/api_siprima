<?php

namespace App\Http\Controllers;

use App\Models\Penanggungjawab;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PenanggungjawabController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/penanggungjawabs",
     *     tags={"Penanggungjawab"},
     *     summary="Get all penanggungjawabs",
     *     description="Mendapatkan daftar semua penanggungjawab",
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data penanggungjawabs",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="John Doe"),
     *                     @OA\Property(property="jabatan", type="string", example="Manager IT"),
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
        $penanggungjawabs = Penanggungjawab::all();

        return response()->json([
            'success' => true,
            'data' => $penanggungjawabs,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/penanggungjawabs",
     *     tags={"Penanggungjawab"},
     *     summary="Create new penanggungjawab",
     *     description="Membuat penanggungjawab baru",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"nama", "jabatan"},
     *             @OA\Property(property="nama", type="string", example="John Doe"),
     *             @OA\Property(property="jabatan", type="string", example="Manager IT")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Penanggungjawab berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Penanggungjawab berhasil dibuat"),
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
            'jabatan' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $penanggungjawab = Penanggungjawab::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Penanggungjawab berhasil dibuat',
            'data' => $penanggungjawab,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/penanggungjawabs/{id}",
     *     tags={"Penanggungjawab"},
     *     summary="Get penanggungjawab by ID",
     *     description="Mendapatkan detail penanggungjawab berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Penanggungjawab ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan detail penanggungjawab",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Penanggungjawab tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Penanggungjawab tidak ditemukan")
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
        $penanggungjawab = Penanggungjawab::find($id);

        if (!$penanggungjawab) {
            return response()->json([
                'success' => false,
                'message' => 'Penanggungjawab tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $penanggungjawab,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/penanggungjawabs/{id}",
     *     tags={"Penanggungjawab"},
     *     summary="Update penanggungjawab",
     *     description="Mengupdate data penanggungjawab berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Penanggungjawab ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="nama", type="string", example="John Doe"),
     *             @OA\Property(property="jabatan", type="string", example="Manager IT")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Penanggungjawab berhasil diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Penanggungjawab berhasil diupdate"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Penanggungjawab tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Penanggungjawab tidak ditemukan")
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
        $penanggungjawab = Penanggungjawab::find($id);

        if (!$penanggungjawab) {
            return response()->json([
                'success' => false,
                'message' => 'Penanggungjawab tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|required|string|max:255',
            'jabatan' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $penanggungjawab->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Penanggungjawab berhasil diupdate',
            'data' => $penanggungjawab,
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/penanggungjawabs/{id}",
     *     tags={"Penanggungjawab"},
     *     summary="Delete penanggungjawab",
     *     description="Menghapus penanggungjawab berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Penanggungjawab ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Penanggungjawab berhasil dihapus",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Penanggungjawab berhasil dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Penanggungjawab tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Penanggungjawab tidak ditemukan")
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
        $penanggungjawab = Penanggungjawab::find($id);

        if (!$penanggungjawab) {
            return response()->json([
                'success' => false,
                'message' => 'Penanggungjawab tidak ditemukan',
            ], 404);
        }

        $penanggungjawab->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penanggungjawab berhasil dihapus',
        ]);
    }
}
