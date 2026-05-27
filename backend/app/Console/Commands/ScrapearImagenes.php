<?php

namespace App\Console\Commands;

use App\Models\Evento;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ScrapearImagenes extends Command
{
    protected $signature   = 'eventos:scrapear-imagenes {--limit=50 : Máximo de eventos a procesar}';
    protected $description = 'Scrape imágenes de portada desde madrid.es para eventos sin imagen';

    public function handle(): int
    {
        $limit  = (int) $this->option('limit');
        $eventos = Evento::whereNull('imagen_url')
            ->whereNotNull('url_externo')
            ->where('url_externo', '!=', '')
            ->limit($limit)
            ->get();

        if ($eventos->isEmpty()) {
            $this->info('No hay eventos sin imagen.');
            return Command::SUCCESS;
        }

        $this->info("Scrapeando imágenes para {$eventos->count()} eventos...");
        $bar = $this->output->createProgressBar($eventos->count());
        $bar->start();

        $ok = 0;
        $fail = 0;

        foreach ($eventos as $evento) {
            $imagen = $this->scrapearImagen($evento->url_externo);
            if ($imagen) {
                $evento->update(['imagen_url' => $imagen]);
                $ok++;
            } else {
                $fail++;
            }
            $bar->advance();
            usleep(300000); // 300ms entre peticiones para no saturar el servidor
        }

        $bar->finish();
        $this->newLine();
        $this->info("Completado: {$ok} imágenes encontradas, {$fail} sin imagen.");
        return Command::SUCCESS;
    }

    private function scrapearImagen(string $url): ?string
    {
        try {
            $response = Http::timeout(10)
                ->withoutVerifying()
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 INCLUGO-TFG/1.0'])
                ->get($url);

            if (!$response->successful()) return null;

            $html = $response->body();

            // 1. Intentar og:image (más fiable)
            if (preg_match('/<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](https?:\/\/[^"\']+)["\']/', $html, $m)) {
                return $m[1];
            }
            if (preg_match('/<meta[^>]+content=["\'](https?:\/\/[^"\']+)["\'][^>]+property=["\']og:image["\']/', $html, $m)) {
                return $m[1];
            }

            // 2. Intentar imagen principal de madrid.es con DOMDocument
            $dom = new \DOMDocument();
            @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
            $xpath = new \DOMXPath($dom);

            // Selector típico de madrid.es para imagen de evento
            $nodos = $xpath->query('//div[contains(@class,"imagen-evento")]//img | //div[contains(@class,"event-image")]//img | //figure//img | //div[contains(@class,"cabecera")]//img');
            foreach ($nodos as $nodo) {
                $src = $nodo->getAttribute('src');
                if ($src && !str_contains($src, 'spacer') && !str_contains($src, 'pixel')) {
                    return str_starts_with($src, 'http') ? $src : 'https://www.madrid.es' . $src;
                }
            }

        } catch (\Exception $e) {
            // Fallo silencioso para no interrumpir el proceso
        }

        return null;
    }
}
