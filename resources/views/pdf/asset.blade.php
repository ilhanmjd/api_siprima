<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Lampiran Asset #{{ $asset->id }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 4px 6px; }
        th { width: 30%; }
        .section-title { margin-top: 15px; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Lampiran Asset</h1>
    <p>Tanggal cetak: {{ now()->format('d-m-Y H:i:s') }}</p>

    <table>
        <tr>
            <th>Kode BMD</th>
            <td>{{ $asset->kode_bmd }}</td>
        </tr>
        <tr>
            <th>Nama</th>
            <td>{{ $asset->nama }}</td>
        </tr>
        <tr>
            <th>Dinas</th>
            <td>{{ optional($asset->dinas)->nama }}</td>
        </tr>
        <tr>
            <th>Kategori</th>
            <td>{{ optional($asset->kategori)->nama }}</td>
        </tr>
        <tr>
            <th>Sub Kategori</th>
            <td>{{ optional($asset->subkategori)->nama }}</td>
        </tr>
        <tr>
            <th>Lokasi</th>
            <td>{{ optional($asset->lokasi)->nama }}</td>
        </tr>
        <tr>
            <th>Penanggung Jawab</th>
            <td>{{ optional($asset->penanggungjawab)->nama }}</td>
        </tr>
        <tr>
            <th>Tanggal Perolehan</th>
            <td>{{ optional($asset->tgl_perolehan)->format('d-m-Y') }}</td>
        </tr>
        <tr>
            <th>Nilai Perolehan</th>
            <td>{{ number_format((float) $asset->nilai_perolehan, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <th>Kondisi</th>
            <td>{{ $asset->kondisi }}</td>
        </tr>
        <tr>
            <th>Status</th>
            <td>{{ $asset->status }}</td>
        </tr>
    </table>
</body>
</html>

