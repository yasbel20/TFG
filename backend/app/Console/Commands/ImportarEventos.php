<?php

namespace App\Console\Commands;

use App\Models\CaracteristicaAccesibilidad;
use App\Models\Evento;
use App\Models\Recinto;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

// Comando: php artisan eventos:importar
// Sincroniza el catálogo de eventos culturales desde la API del Ayuntamiento de Madrid.
// Puede programarse con el scheduler de Laravel para ejecutarse diariamente.
class ImportarEventos extends Command
{
    protected $signature   = 'eventos:importar';
    protected $description = 'Importa eventos culturales desde la API del Ayuntamiento de Madrid';

    private const API_URL = 'https://datos.madrid.es/egob/catalogo/206974-0-agenda-eventos-culturales-100.json';

    public function handle(): int
    {
        $this->info('Iniciando importación de eventos de Madrid...');

        $importados = 0;
        $errores    = 0;

        // Elimina eventos caducados antes de importar para no acumular datos obsoletos
        $eliminados = Evento::where(function ($q) {
            $q->where('fecha_fin', '<', now())
              ->orWhere(function ($q2) {
                  $q2->whereNull('fecha_fin')
                     ->whereDate('fecha_inicio', '<', now()->subDays(1));
              });
        })->delete();

        if ($eliminados > 0) {
            $this->line("  → {$eliminados} eventos caducados eliminados");
        }

        $this->line("  Descargando eventos de Madrid...");

        try {
            $response = Http::timeout(30)
                ->withoutVerifying()
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 INCLUGO-TFG/1.0'])
                ->get(self::API_URL);

            if (!$response->successful()) {
                $this->error("Error HTTP {$response->status()}");
                return Command::FAILURE;
            }

            // La API devuelve JSON-LD con los eventos en el campo @graph
            $items = $response->json('@graph') ?? [];
            $this->line("  " . count($items) . " eventos encontrados");

            foreach ($items as $item) {
                try {
                    $this->procesarEvento($item);
                    $importados++;
                } catch (\Exception $e) {
                    $errores++;
                    if ($errores === 1) $this->warn("Primer error: " . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            $this->error("Error de conexión: " . $e->getMessage());
            return Command::FAILURE;
        }

        $this->info("Importación completada: {$importados} eventos importados, {$errores} errores.");
        return Command::SUCCESS;
    }

    // Extrae la URL de imagen del evento (relativa o absoluta)
    private function extraerImagen(array $item): ?string
    {
        $BASE = 'https://www.madrid.es';
        $raw  = $item['media']['@id']  ?? $item['media']['url'] ?? $item['image'] ?? null;
        if (!$raw) return null;
        return str_starts_with($raw, 'http') ? $raw : $BASE . $raw;
    }

    private function procesarEvento(array $item): void
    {
        $apiId = $item['id'] ?? null;
        if (!$apiId) return;

        // Crea o reutiliza el recinto por nombre — evita duplicados
        $nombreRecinto = $item['organization']['organization-name']
            ?? $item['event-location']
            ?? 'Madrid';

        $direccion = $item['address']['area']['street-address'] ?? null;

        // Extrae el distrito del @id de la API (ej: ".../PuenteDeVallecas" → "Puente De Vallecas")
        $distritoBruto = $item['address']['district']['@id'] ?? '';
        $distrito = 'Madrid';
        if (preg_match('/\/([^\/]+)$/', $distritoBruto, $m)) {
            $distrito = preg_replace('/([A-Z])/', ' $1', $m[1]);
            $distrito = trim($distrito);
        }

        $recinto = Recinto::firstOrCreate(
            ['nombre' => mb_substr($nombreRecinto, 0, 255)],
            ['direccion' => $direccion, 'distrito' => $distrito, 'municipio' => 'Madrid']
        );

        // Infiere la categoría por palabras clave (misma lógica que parseEvent() en el frontend)
        $titulo = strtolower($item['title'] ?? '');
        $desc   = strtolower($item['description'] ?? '');
        $texto  = $titulo . ' ' . $desc;

        $categoria = 'Cultura';
        if (preg_match('/concierto|m[uú]sica|jazz|flamenco|rock|pop/', $texto))  $categoria = 'Música';
        elseif (preg_match('/teatro|obra|ballet|[oó]pera/', $texto))             $categoria = 'Teatro';
        elseif (preg_match('/exposici|muestra|exhibit|galer[ií]a/', $texto))     $categoria = 'Exposición';
        elseif (preg_match('/cine|film|pel[ií]cu/', $texto))                     $categoria = 'Cine';
        elseif (preg_match('/danza|baile/', $texto))                             $categoria = 'Danza';

        $rawPrecio = trim((string)($item['price'] ?? ''));
        $gratuito  = ($item['free'] ?? 1) != 0 || $rawPrecio === '';
        $precio    = 'Gratis';
        if (!$gratuito && $rawPrecio !== '') {
            $precio = preg_match('/^\d+([.,]\d+)?$/', $rawPrecio)
                ? 'Desde ' . str_replace(',', '.', $rawPrecio) . ' €'
                : mb_substr($rawPrecio, 0, 255);
        }

        // updateOrCreate por api_id: actualiza si ya existe, crea si no — evita duplicados
        $evento = Evento::updateOrCreate(
            ['api_id' => (string) $apiId],
            [
                'titulo'       => mb_substr($item['title'] ?? 'Evento sin título', 0, 255),
                'descripcion'  => strip_tags($item['description'] ?? ''),
                'categoria'    => $categoria,
                'fecha_inicio' => isset($item['dtstart']) ? date('Y-m-d H:i:s', strtotime($item['dtstart'])) : null,
                'fecha_fin'    => isset($item['dtend'])   ? date('Y-m-d H:i:s', strtotime($item['dtend']))   : null,
                'precio'       => $precio,
                'gratuito'     => $gratuito,
                'imagen_url'   => $this->extraerImagen($item),
                'url_externo'  => $item['link'] ?? null,
                'recinto_id'   => $recinto->id,
            ]
        );

        // Recrea las características de accesibilidad (borra las viejas y reinserta)
        // para reflejar cambios en la API sin acumular duplicados
        $evento->accesibilidad()->delete();
        $accRaw = (string)($item['organization']['accesibility'] ?? '');
        $codes  = array_filter(array_map('trim', explode(',', $accRaw)));

        // Mismos códigos que parseEvent() en el frontend: 1/2→silla, 4→signos, 5→podo, 6→bucle
        $tiposMap  = ['1' => 'silla', '2' => 'silla', '4' => 'signos', '5' => 'podo', '6' => 'bucle'];
        $insertados = [];
        foreach ($codes as $code) {
            $tipo = $tiposMap[$code] ?? null;
            if ($tipo && !in_array($tipo, $insertados)) {
                CaracteristicaAccesibilidad::create(['evento_id' => $evento->id, 'tipo' => $tipo]);
                $insertados[] = $tipo;
            }
        }
    }
}
