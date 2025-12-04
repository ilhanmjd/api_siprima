<?php

namespace App\Http\Controllers;

use App\Models\SubKategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubKategoriController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/sub-kategoris",
     *     tags={"Sub Kategori"},
     *     summary="Get all sub kategoris",
     *     description="Mendapatkan daftar semua sub kategori dengan relasi kategori",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="kategori_id",
     *         in="query",
     *         description="Filter berdasarkan kategori ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan data sub kategoris",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="kategori_id", type="integer", example=1),
     *                     @OA\Property(property="nama", type="string", example="Laptop"),
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
    public function index(Request $request)
    {
        $query = SubKategori::with(['kategori']);

        // Filter berdasarkan kategori
        if ($request->has('kategori_id')) {
            $query->where('kategori_id', $request->kategori_id);
        }

        $subKategoris = $query->get();

        return response()->json([
            'success' => true,
            'data' => $subKategoris,
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/sub-kategoris",
     *     tags={"Sub Kategori"},
     *     summary="Create new sub kategori",
     *     description="Membuat sub kategori baru",
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"kategori_id", "nama"},
     *             @OA\Property(property="kategori_id", type="integer", example=1),
     *             @OA\Property(property="nama", type="string", example="Laptop")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Sub kategori berhasil dibuat",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Sub kategori berhasil dibuat"),
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
            'kategori_id' => 'required|exists:kategoris,id',
            'nama' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subKategori = SubKategori::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Sub kategori berhasil dibuat',
            'data' => $subKategori->load(['kategori']),
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/sub-kategoris/{id}",
     *     tags={"Sub Kategori"},
     *     summary="Get sub kategori by ID",
     *     description="Mendapatkan detail sub kategori berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Sub Kategori ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Berhasil mendapatkan detail sub kategori",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Sub kategori tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Sub kategori tidak ditemukan")
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
        $subKategori = SubKategori::with(['kategori'])->find($id);

        if (!$subKategori) {
            return response()->json([
                'success' => false,
                'message' => 'Sub kategori tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $subKategori,
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/sub-kategoris/{id}",
     *     tags={"Sub Kategori"},
     *     summary="Update sub kategori",
     *     description="Mengupdate data sub kategori berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Sub Kategori ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="kategori_id", type="integer", example=1),
     *             @OA\Property(property="nama", type="string", example="Laptop")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Sub kategori berhasil diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Sub kategori berhasil diupdate"),
     *             @OA\Property(property="data", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Sub kategori tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Sub kategori tidak ditemukan")
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
        $subKategori = SubKategori::find($id);

        if (!$subKategori) {
            return response()->json([
                'success' => false,
                'message' => 'Sub kategori tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'kategori_id' => 'sometimes|required|exists:kategoris,id',
            'nama' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subKategori->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Sub kategori berhasil diupdate',
            'data' => $subKategori->load(['kategori']),
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/sub-kategoris/{id}",
     *     tags={"Sub Kategori"},
     *     summary="Delete sub kategori",
     *     description="Menghapus sub kategori berdasarkan ID",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Sub Kategori ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Sub kategori berhasil dihapus",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Sub kategori berhasil dihapus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Sub kategori tidak ditemukan",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Sub kategori tidak ditemukan")
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
        $subKategori = SubKategori::find($id);

        if (!$subKategori) {
            return response()->json([
                'success' => false,
                'message' => 'Sub kategori tidak ditemukan',
            ], 404);
        }

        $subKategori->delete();

        return response()->json([
            'success' => true,
            'message' => 'Sub kategori berhasil dihapus',
        ]);
    }
}
