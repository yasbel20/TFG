<?php

namespace App\Console\Commands;

use App\Models\Evento;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SyncImagenesEventos extends Command
{
    protected $signature   = 'eventos:sync-imagenes';
    protected $description = 'Sincroniza imágenes de img/eventos (con subcarpetas) con la base de datos';

    public function handle(): int
    {
        $src  = base_path('../img/eventos');
        $dest = base_path('../public/img/eventos');

        if (!File::exists($src)) {
            $this->error("Carpeta no encontrada: {$src}");
            return Command::FAILURE;
        }

        File::ensureDirectoryExists($dest);

        // Escanear recursivamente todas las imágenes
        $files = File::allFiles($src);

        if (empty($files)) {
            $this->info('No hay imágenes en img/eventos.');
            return Command::SUCCESS;
        }

        $ok = $noMatch = $copied = 0;
        $this->info('Sincronizando ' . count($files) . ' imágenes...');

        foreach ($files as $file) {
            $filename    = $file->getFilename();
            $nameOnly    = pathinfo($filename, PATHINFO_FILENAME);
            // Ruta relativa desde img/eventos (ej: musica/Andrés Suárez.jpg)
            $relPath     = $file->getRelativePathname();
            $destFile    = $dest . DIRECTORY_SEPARATOR . $relPath;
            $publicUrl   = '/img/eventos/' . str_replace('\\', '/', $relPath);

            // Crear subcarpeta en public si hace falta
            File::ensureDirectoryExists(dirname($destFile));
            File::copy($file->getPathname(), $destFile);
            $copied++;

            $evento = Evento::where('titulo', $nameOnly)->first()
                ?? Evento::where('titulo', 'like', '%' . $nameOnly . '%')->first()
                ?? Evento::where('titulo', 'like', '%' . mb_substr($nameOnly, 0, 20) . '%')->first();

            if ($evento) {
                $evento->update(['imagen_url' => $publicUrl]);
                $this->line("  ✓ <info>{$relPath}</info> → {$evento->titulo}");
                $ok++;
            } else {
                $this->line("  ✗ <comment>{$relPath}</comment> — sin coincidencia en BD");
                $noMatch++;
            }
        }

        $this->newLine();
        $this->info("Copiadas: {$copied} | Asignadas: {$ok} | Sin coincidencia: {$noMatch}");

        return Command::SUCCESS;
    }
}
