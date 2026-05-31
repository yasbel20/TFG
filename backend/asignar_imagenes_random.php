<?php
$imgDir = 'C:/xampp/htdocs/TFG 1/img/eventos';
$db = new PDO('sqlite:C:/xampp/htdocs/TFG 1/backend/database/database.sqlite');

// Recoger todas las imágenes disponibles
$imagenes = [];
$iter = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($imgDir, FilesystemIterator::SKIP_DOTS)
);
foreach ($iter as $file) {
    if ($file->isDir()) continue;
    $ext = strtolower($file->getExtension());
    if (!in_array($ext, ['jpg', 'jpeg', 'png'])) continue;
    $rel = str_replace('\\', '/', str_replace($imgDir, '', $file->getPathname()));
    $imagenes[] = '/img/eventos' . $rel;
}
echo 'Imágenes disponibles: ' . count($imagenes) . PHP_EOL;

// Eventos de música sin imagen
$stmt = $db->query("SELECT id, api_id, titulo FROM eventos WHERE categoria = 'Música' AND (imagen_url IS NULL OR imagen_url = '')");
$eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo 'Eventos a asignar: ' . count($eventos) . PHP_EOL;

// Asignar imagen aleatoria a cada uno
$asignados = [];
foreach ($eventos as $ev) {
    $img = $imagenes[array_rand($imagenes)];
    $upd = $db->prepare('UPDATE eventos SET imagen_url = ? WHERE id = ?');
    $upd->execute([$img, $ev['id']]);
    $asignados[$ev['api_id']] = $img;
}
echo 'Asignados: ' . count($asignados) . PHP_EOL;

// Guardar mapeos en JSON para añadir al seeder
file_put_contents(__DIR__ . '/nuevos_mapeos_musica.json', json_encode($asignados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo 'Mapeos guardados en nuevos_mapeos_musica.json' . PHP_EOL;
