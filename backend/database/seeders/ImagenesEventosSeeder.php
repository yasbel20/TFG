<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class ImagenesEventosSeeder extends Seeder
{
    public function run(): void
    {
        $imagenes = [
            '50149771' => '/img/eventos/30 may CV FIGUE 2026_6 x 4 & CUEROS.jpg',
            '50297173' => '/img/eventos/teatro/75 años de dirección artística cinematográfica. Gil Parrondo, creador de sueños.png',
            '50294645' => '/img/eventos/2705Agrucha.jpg',
            '50295644' => '/img/eventos/2605_pulso.jpg',
            '50291112' => '/img/eventos/teatro/Alcanzar una estrella.jpg',
            '50291630' => '/img/eventos/teatro/Alicia en el País de las Maravillas.jpg',
            '50291138' => '/img/eventos/3105Alma.jpg',
            '50295654' => '/img/eventos/exposicion/Alumnos del I.E.S. Conde de Orgaz.jpg',
            '50289304' => '/img/eventos/Andrés Suárez.jpg',
            '50286319' => '/img/eventos/musica/Antología de la Zarzuela.jpg',
            '50297817' => '/img/eventos/exposicion/Aprender y plasmar.jpg',
            '11970704' => '/img/eventos/exposicion/Árboles de El Retiro2.jpg',
            '12048639' => '/img/eventos/exposicion/Árboles de El Retiro.jpg',
            '50291690' => '/img/eventos/musica/Armonía coral participativa.jpg',
            '11769516' => '/img/eventos/musica/Artes en el Retiro.jpg',
            '50302524' => '/img/eventos/musica/Atrévete a cantar y actuar.jpg',
            '50319779' => '/img/eventos/teatro/Bodas de sangre.jpg',
            '50275336' => '/img/eventos/teatro/Campamento de verano de inglés y teatro.jpeg',
            '50287980' => '/img/eventos/teatro/Campamento del Price 2026 (11 y 12 AÑOS).jpeg',
            '50287978' => '/img/eventos/teatro/Campamento del Price 2026 (9 y 10 AÑOS).jpeg',
            '50286882' => '/img/eventos/teatro/Caperucita y otros lobos.jpg',
            '50226881' => '/img/eventos/exposicion/Eduardo Chillida. Soñar el espacio.jpg',
            '50297188' => '/img/eventos/exposicion/El arte de la mediación.jpg',
            '50295931' => '/img/eventos/exposicion/El color del detalle.jpg',
            '50312683' => '/img/eventos/1306Amamos.jpg',
            '50319039' => '/img/eventos/teatro/Actúa.jpg',
            '50319782' => '/img/eventos/teatro/Algunas veces ganas y otras aprendes.jpg',
            '50319706' => '/img/eventos/teatro/Casa Madre.jpg',
            '50318475' => '/img/eventos/teatro/Certamen de expresión dramática.jpg',
            '50321933' => '/img/eventos/exposicion/Anatomía del desgaste.jpg',
            '50317419' => '/img/eventos/cine/A Rivers Gaze.jpg',
            '50314803' => '/img/eventos/cine/Abortion.jpg',
            '50316844' => '/img/eventos/cine/Animal Love.jpg',
            '50317384' => '/img/eventos/cine/Blind Love.jpg',
        ];

        foreach ($imagenes as $apiId => $url) {
            Evento::where('api_id', $apiId)->update(['imagen_url' => $url]);
        }

        $this->command->info('Imágenes de eventos actualizadas: ' . count($imagenes));
    }
}
