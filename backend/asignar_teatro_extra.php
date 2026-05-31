<?php
$db = new PDO('sqlite:C:/xampp/htdocs/TFG 1/backend/database/database.sqlite');
$imgDir = 'C:/xampp/htdocs/TFG 1/img/eventos/teatro';

$imagenes = [];
foreach (scandir($imgDir) as $f) {
    $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
    if (in_array($ext, ['jpg', 'jpeg', 'png'])) $imagenes[] = '/img/eventos/teatro/' . $f;
}
shuffle($imagenes);
echo 'Imágenes de teatro: ' . count($imagenes) . PHP_EOL;

$ids = ['50256343','12816548','12816542','50196300','12816511','50270064','50270070','50002573','50270067','50286078','50286072','50316805','12816515','50270061'];

$asignados = [];
$idx = 0;
foreach ($ids as $apiId) {
    $img = $imagenes[$idx % count($imagenes)];
    $idx++;
    $upd = $db->prepare("UPDATE eventos SET imagen_url = ? WHERE api_id = ? AND (imagen_url IS NULL OR imagen_url = '')");
    $upd->execute([$img, $apiId]);
    $asignados[$apiId] = $img;
    echo $apiId . ' → ' . $img . PHP_EOL;
}
echo PHP_EOL . 'Asignados: ' . count($asignados) . PHP_EOL;
