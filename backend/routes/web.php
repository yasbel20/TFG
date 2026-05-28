<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

// Madrid API proxy — mirrors the Vite dev proxy so production calls work the same way
// Frontend fetches /api-madrid/... which gets forwarded to datos.madrid.es/...
Route::get('/api-madrid/{path}', function (string $path) {
    $url = 'https://datos.madrid.es/' . $path;
    $query = request()->getQueryString();
    if ($query) $url .= '?' . $query;

    $response = Http::timeout(15)->get($url);
    return response($response->body(), $response->status())
        ->header('Content-Type', 'application/json')
        ->header('Access-Control-Allow-Origin', '*');
})->where('path', '.*');

// SPA catch-all — React Router handles all frontend routes
Route::get('/{any}', fn () => view('spa'))->where('any', '.*');
