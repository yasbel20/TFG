<?php
$db = new PDO('sqlite:C:/xampp/htdocs/TFG 1/backend/database/database.sqlite');
$imgDir = 'C:/xampp/htdocs/TFG 1/img/eventos';

// Recoger todas las imágenes disponibles (excluir .mp4)
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
echo 'Imágenes disponibles: ' . count($todasImagenes) . PHP_EOL;

// Eventos de Teatro sin imagen
$stmt = $db->query("SELECT id, api_id, titulo FROM eventos WHERE categoria = 'Teatro' AND (imagen_url IS NULL OR imagen_url = '')");
$eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo 'Eventos Teatro sin imagen: ' . count($eventos) . PHP_EOL;

// También detectar eventos que el frontend ve como Teatro pero están en otra categoría
// (misma lógica que el frontend: /teatro|obra|ballet|ópera/)
$stmt2 = $db->query("SELECT id, api_id, titulo FROM eventos WHERE categoria != 'Teatro' AND (imagen_url IS NULL OR imagen_url = '') AND (titulo LIKE '%teatro%' OR titulo LIKE '%obra%' OR titulo LIKE '%ballet%' OR titulo LIKE '%ópera%' OR titulo LIKE '%opera%')");
$extra = $stmt2->fetchAll(PDO::FETCH_ASSOC);
echo 'Eventos extra (otra cat, título teatro): ' . count($extra) . PHP_EOL;

$todos = array_merge($eventos, $extra);
echo 'Total a asignar: ' . count($todos) . PHP_EOL;

// Asignar imágenes únicas rotando el array
$asignados = [];
$imgIdx = 0;
$totalImgs = count($todasImagenes);

foreach ($todos as $ev) {
    $img = $todasImagenes[$imgIdx % $totalImgs];
    $imgIdx++;
    $upd = $db->prepare('UPDATE eventos SET imagen_url = ? WHERE id = ?');
    $upd->execute([$img, $ev['id']]);
    $asignados[$ev['api_id']] = $img;
}

echo 'Asignados: ' . count($asignados) . PHP_EOL;

// Guardar para el seeder
file_put_contents(__DIR__ . '/nuevos_mapeos_teatro.json', json_encode($asignados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo 'Guardado en nuevos_mapeos_teatro.json' . PHP_EOL;
