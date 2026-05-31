<?php
$db = new PDO('sqlite:C:/xampp/htdocs/TFG 1/backend/database/database.sqlite');

$categorias = [
    'Cultura'    => 'ImagenesCulturaSeeder',
    'Danza'      => 'ImagenesDanzaSeeder',
    'Exposición' => 'ImagenesExposicionSeeder',
];

foreach ($categorias as $cat => $className) {
    $stmt = $db->query("SELECT api_id, imagen_url FROM eventos WHERE categoria = '$cat' AND imagen_url IS NOT NULL AND imagen_url NOT LIKE '%.mp4' ORDER BY api_id");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $lines = [];
    foreach ($rows as $r) {
        $img = str_replace("'", "\\'", $r['imagen_url']);
        $lines[] = "            '{$r['api_id']}' => '{$img}',";
    }

    $content = "<?php

namespace Database\\Seeders;

use App\\Models\\Evento;
use Illuminate\\Database\\Seeder;

class {$className} extends Seeder
{
    public function run(): void
    {
        \$imagenes = [
" . implode(PHP_EOL, $lines) . "
        ];

        foreach (\$imagenes as \$apiId => \$url) {
            Evento::where('api_id', \$apiId)->whereNull('imagen_url')->update(['imagen_url' => \$url]);
        }

        \$this->command->info('Imágenes de {$cat} asignadas: ' . count(\$imagenes));
    }
}
";
    file_put_contents("C:/xampp/htdocs/TFG 1/backend/database/seeders/{$className}.php", $content);
    echo "{$className} creado con " . count($lines) . " entradas" . PHP_EOL;
}
