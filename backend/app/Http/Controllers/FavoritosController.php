<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FavoritosController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->favoritos ?? []);
    }

    public function store(Request $request)
    {
        $request->validate(['evento' => 'required|array']);

        $favoritos = $request->user()->favoritos ?? [];
        $evento    = $request->evento;
        $eventoId  = (string)($evento['id'] ?? '');

        $exists = collect($favoritos)->contains(fn($f) => (string)(is_array($f) ? ($f['id'] ?? '') : $f) === $eventoId);

        if (! $exists) {
            $favoritos[] = $evento;
            $request->user()->update(['favoritos' => $favoritos]);
        }

        return response()->json(['favoritos' => $favoritos]);
    }

    public function destroy(Request $request, string $eventoId)
    {
        $favoritos = $request->user()->favoritos ?? [];
        $favoritos = array_values(array_filter(
            $favoritos,
            fn($f) => (string)(is_array($f) ? ($f['id'] ?? '') : $f) !== $eventoId
        ));
        $request->user()->update(['favoritos' => $favoritos]);

        return response()->json(['favoritos' => $favoritos]);
    }
}
