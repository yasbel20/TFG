<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoritosController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',              [AuthController::class, 'logout']);
    Route::get('/perfil',               [AuthController::class, 'perfil']);
    Route::put('/perfil/preferencias',  [AuthController::class, 'guardarPreferencias']);
    Route::get('/recomendaciones',      [AuthController::class, 'recomendaciones']);
    Route::get('/favoritos',            [FavoritosController::class, 'index']);
    Route::post('/favoritos',           [FavoritosController::class, 'store']);
    Route::delete('/favoritos/{id}',    [FavoritosController::class, 'destroy']);
});
