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
        $request->validate(['evento_id' => 'required|string']);

        $favoritos   = $request->user()->favoritos ?? [];
        $eventoId    = $request->evento_id;

        if (! in_array($eventoId, $favoritos)) {
            $favoritos[] = $eventoId;
            $request->user()->update(['favoritos' => $favoritos]);
        }

        return response()->json(['favoritos' => $favoritos]);
    }

    public function destroy(Request $request, string $eventoId)
    {
        $favoritos = $request->user()->favoritos ?? [];
        $favoritos = array_values(array_filter($favoritos, fn($id) => $id !== $eventoId));
        $request->user()->update(['favoritos' => $favoritos]);

        return response()->json(['favoritos' => $favoritos]);
    }
}
