<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoritosController;
use App\Models\Evento;
use Illuminate\Support\Facades\Route;

Route::get('/imagenes-eventos', function () {
    $src  = base_path('../img/eventos');
    $dest = base_path('../public/img/eventos');

    if (is_dir($src)) {
        if (!is_dir($dest)) mkdir($dest, 0755, true);

        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($src, \FilesystemIterator::SKIP_DOTS));
        foreach ($iterator as $file) {
            if ($file->isDir()) continue;

            $relPath  = ltrim(str_replace($src, '', $file->getPathname()), DIRECTORY_SEPARATOR);
            $destFile = $dest . DIRECTORY_SEPARATOR . $relPath;
            $publicUrl = '/img/eventos/' . str_replace('\\', '/', $relPath);

            if (!file_exists($destFile) || $file->getMTime() > filemtime($destFile)) {
                $destDir = dirname($destFile);
                if (!is_dir($destDir)) mkdir($destDir, 0755, true);
                copy($file->getPathname(), $destFile);

                $nameOnly = pathinfo($file->getFilename(), PATHINFO_FILENAME);
                $evento = Evento::where('titulo', $nameOnly)->first()
                    ?? Evento::where('titulo', 'like', '%' . $nameOnly . '%')->first()
                    ?? Evento::where('titulo', 'like', '%' . mb_substr($nameOnly, 0, 20) . '%')->first();

                if ($evento) {
                    $evento->update(['imagen_url' => $publicUrl]);
                }
            }
        }
    }

    $map = Evento::whereNotNull('imagen_url')
        ->whereNotNull('api_id')
        ->pluck('imagen_url', 'api_id');
    return response()->json($map);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',              [AuthController::class, 'logout']);
    Route::get('/perfil',               [AuthController::class, 'perfil']);
    Route::put('/perfil',               [AuthController::class, 'actualizarPerfil']);
    Route::put('/perfil/preferencias',  [AuthController::class, 'guardarPreferencias']);
    Route::get('/recomendaciones',      [AuthController::class, 'recomendaciones']);
    Route::get('/favoritos',            [FavoritosController::class, 'index']);
    Route::post('/favoritos',           [FavoritosController::class, 'store']);
    Route::delete('/favoritos/{id}',    [FavoritosController::class, 'destroy']);
});
