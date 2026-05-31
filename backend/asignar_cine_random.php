<?php
$db = new PDO('sqlite:C:/xampp/htdocs/TFG 1/backend/database/database.sqlite');
$imgDir = 'C:/xampp/htdocs/TFG 1/img/eventos';

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

$ids = ['50307948','50311507','50249704','50220775','50174283','50324649','50316499','50317387','12593032','50317407','50314807','50315220','50316855','50315889','50316249','50316833','50317389','50316835','50316501','50145548','50315343','50317416','50316503','50316848','50313489','50317396','50324247','50317401','50324811','50316808','50314810','50169608','50320346','50316497','50314812','50317382','50325155','50317392','50320419','50317380','50315530','50315847','50317421','50316856','50315845','50317411','50316852','50315963','50323894','50310984','50324085','50324090','50324101','50315884','50324048','50324064'];

$idx = 0;
$asignados = [];
foreach ($ids as $apiId) {
    $img = $todasImagenes[$idx % count($todasImagenes)];
    $idx++;
    $upd = $db->prepare("UPDATE eventos SET imagen_url = ? WHERE api_id = ? AND (imagen_url IS NULL OR imagen_url = '')");
    $upd->execute([$img, $apiId]);
    $asignados[$apiId] = $img;
}
echo 'Asignados: ' . count($asignados) . PHP_EOL;

file_put_contents(__DIR__ . '/nuevos_mapeos_cine.json', json_encode($asignados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo 'Guardado en nuevos_mapeos_cine.json' . PHP_EOL;
