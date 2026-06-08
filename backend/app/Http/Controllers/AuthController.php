<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;

class AuthController extends Controller
{
    // Crea un nuevo usuario y devuelve su token de acceso (201)
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user  = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('inclugo')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    // Verifica credenciales y devuelve un token Sanctum si son correctas
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no son correctas.'],
            ]);
        }

        $token = $user->createToken('inclugo')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    // Elimina el token actual del servidor (el cliente debe borrar el suyo en localStorage)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada']);
    }

    // Devuelve los datos del usuario autenticado por el token Bearer
    public function perfil(Request $request)
    {
        return response()->json($request->user());
    }

    // Actualiza nombre y/o avatar del usuario
    public function actualizarPerfil(Request $request)
    {
        $request->validate([
            'name'   => 'sometimes|string|max:255',
            'avatar' => 'sometimes|nullable|string',
        ]);

        $user = $request->user();
        $user->update($request->only(['name', 'avatar']));

        return response()->json($user->fresh());
    }

    // Guarda las preferencias del onboarding y marca el proceso como completado
    public function guardarPreferencias(Request $request)
    {
        $request->validate([
            'categorias_favoritas'      => 'array',
            'categorias_favoritas.*'    => 'string',
            'accesibilidad_preferida'   => 'array',
            'accesibilidad_preferida.*' => 'string|in:silla,signos,podo,bucle',
        ]);

        // Normaliza nombres con tilde por si el cliente envía sin tilde
        $normCats = ['Musica'=>'Música','Exposicion'=>'Exposición','Danza'=>'Danza','Teatro'=>'Teatro','Cine'=>'Cine','Cultura'=>'Cultura','Música'=>'Música','Exposición'=>'Exposición'];
        $categorias = array_map(fn($c) => $normCats[$c] ?? $c, $request->categorias_favoritas ?? []);

        $user = $request->user();
        $user->update([
            'categorias_favoritas'    => $categorias,
            'accesibilidad_preferida' => $request->accesibilidad_preferida ?? [],
            'onboarding_completado'   => true,
        ]);

        return response()->json($user->fresh());
    }

    // Devuelve hasta 20 eventos futuros que coincidan con las preferencias del usuario.
    // Si el usuario no tiene preferencias, devuelve eventos sin filtrar (nunca vacío).
    public function recomendaciones(Request $request)
    {
        Carbon::setLocale('es');
        $user = $request->user();

        $categorias    = $user->categorias_favoritas    ?? [];
        $accesibilidad = $user->accesibilidad_preferida ?? [];

        // Base: solo eventos activos (fecha_fin futura o sin fecha_fin)
        $query = Evento::with(['recinto', 'accesibilidad'])
            ->where(function ($q) {
                $q->where('fecha_fin', '>=', now())
                  ->orWhereNull('fecha_fin');
            });

        if (!empty($categorias)) {
            $query->whereIn('categoria', $categorias);
        }

        // whereHas comprueba que exista al menos una fila en caracteristicas_accesibilidad
        // cuyo tipo esté en las preferencias del usuario
        if (!empty($accesibilidad)) {
            $query->whereHas('accesibilidad', function ($q) use ($accesibilidad) {
                $q->whereIn('tipo', $accesibilidad);
            });
        }

        $eventos = $query->orderBy('fecha_inicio')->limit(20)->get();

        return response()->json($eventos->map(fn($e) => [
            'id'         => $e->id,
            'title'      => $e->titulo,
            'cat'        => $e->categoria,
            'date'       => $e->fecha_inicio?->locale('es')->isoFormat('D [de] MMMM [de] YYYY'),
            'dateShort'  => $e->fecha_inicio ? strtoupper($e->fecha_inicio->locale('es')->isoFormat('D MMM')) : '',
            'timeStr'    => $e->fecha_inicio?->format('H:i') !== '00:00' ? $e->fecha_inicio?->format('H:i') . ' h' : '',
            'venue'      => $e->recinto?->nombre ?? 'Madrid',
            'district'   => $e->recinto?->distrito ?? 'Madrid',
            'price'      => $e->precio,
            'access'     => $e->accesibilidad->pluck('tipo')->toArray(),
            'image'      => $e->imagen_url,
            'url'        => $e->url_externo,
            'descFull'   => $e->descripcion,
        ]));
    }
}
