<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class FavoritosController extends Controller
{
    public function index(Request $request)
    {
        $eventos = $request->user()
            ->eventosFavoritos()
            ->with(['recinto', 'accesibilidad'])
            ->get();

        return response()->json($eventos->map(fn($e) => $this->format($e)));
    }

    public function store(Request $request)
    {
        $request->validate(['evento' => 'required|array']);

        $eventoId = $request->evento['id'] ?? null;
        $evento   = Evento::find($eventoId)
                 ?? Evento::where('api_id', (string) $eventoId)->first();

        if (! $evento) {
            return response()->json(['error' => 'Evento no encontrado'], 404);
        }

        $request->user()->eventosFavoritos()->syncWithoutDetaching([$evento->id]);

        $favoritos = $request->user()
            ->eventosFavoritos()
            ->with(['recinto', 'accesibilidad'])
            ->get();

        return response()->json(['favoritos' => $favoritos->map(fn($e) => $this->format($e))]);
    }

    public function destroy(Request $request, string $eventoId)
    {
        $evento = Evento::find($eventoId)
               ?? Evento::where('api_id', $eventoId)->first();

        if ($evento) {
            $request->user()->eventosFavoritos()->detach($evento->id);
        }

        $favoritos = $request->user()
            ->eventosFavoritos()
            ->with(['recinto', 'accesibilidad'])
            ->get();

        return response()->json(['favoritos' => $favoritos->map(fn($e) => $this->format($e))]);
    }

    private function format(Evento $e): array
    {
        Carbon::setLocale('es');
        return [
            'id'        => $e->id,
            'title'     => $e->titulo,
            'cat'       => $e->categoria,
            'date'      => $e->fecha_inicio?->locale('es')->isoFormat('D [de] MMMM [de] YYYY'),
            'dateShort' => $e->fecha_inicio ? strtoupper($e->fecha_inicio->locale('es')->isoFormat('D MMM')) : '',
            'timeStr'   => $e->fecha_inicio?->format('H:i') !== '00:00' ? $e->fecha_inicio?->format('H:i') . ' h' : '',
            'venue'     => $e->recinto?->nombre ?? 'Madrid',
            'district'  => $e->recinto?->distrito ?? 'Madrid',
            'price'     => $e->precio,
            'access'    => $e->accesibilidad->pluck('tipo')->toArray(),
            'image'     => $e->imagen_url,
            'url'       => $e->url_externo,
            'descFull'  => $e->descripcion,
        ];
    }
}
