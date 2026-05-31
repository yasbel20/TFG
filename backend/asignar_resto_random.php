<?php
$db = new PDO('sqlite:C:/xampp/htdocs/TFG 1/backend/database/database.sqlite');
$imgDir = 'C:/xampp/htdocs/TFG 1/img/eventos';

// Recoger todas las imágenes disponibles
$todasImagenes = [];
$iter = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($imgDir, FilesystemIterator::SKIP_DOTS)
);
foreach ($iter as $file) {
    $ext = strtolower($file->getExtension());
    if (!in_array($ext, ['jpg', 'jpeg', 'png'])) continue;
    $rel = str_replace('\\', '/', str_replace($imgDir, '', $file->getPathname()));
    $todasImagenes[] = '/img/eventos' . $rel;
}
shuffle($todasImagenes);
$total = count($todasImagenes);
echo 'Imágenes disponibles: ' . $total . PHP_EOL;

// Eventos sin imagen de todas las categorías restantes
$stmt = $db->query("SELECT id, api_id, categoria, titulo FROM eventos WHERE (imagen_url IS NULL OR imagen_url = '') ORDER BY categoria, id");
$eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo 'Total a asignar: ' . count($eventos) . PHP_EOL;

$idx = 0;
$asignados = [];
foreach ($eventos as $ev) {
    $img = $todasImagenes[$idx % $total];
    $idx++;
    $db->prepare('UPDATE eventos SET imagen_url = ? WHERE id = ?')->execute([$img, $ev['id']]);
    $asignados[$ev['categoria']][$ev['api_id']] = $img;
}

foreach ($asignados as $cat => $map) {
    echo $cat . ': ' . count($map) . ' asignados' . PHP_EOL;
}

file_put_contents(__DIR__ . '/mapeos_resto.json', json_encode($asignados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo 'Guardado en mapeos_resto.json' . PHP_EOL;
