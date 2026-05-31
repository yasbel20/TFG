<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class ImagenesCineSeeder extends Seeder
{
    public function run(): void
    {
        $imagenes = [
            '50307948' => '/img/eventos/cine/Capítulo XXXII Recuerdo de Aram Slobodian (una poética de la desaparición).jpg',
            '50315898' => '/img/eventos/cine/Change the Battery Pack (LAV 2026).jpeg',
            '50290944' => '/img/eventos/cine/El recuerdo de Marnie.jpg',
            '50285684' => '/img/eventos/cine/A River\'s Gaze.jpg',
            '50324289' => '/img/eventos/cine/El vídeo de Benny.jpg',
            '12593032' => '/img/eventos/musica/Bon Odori x Jota.jpg',
            '50066674' => '/img/eventos/cine/Cinefórum IVÁNdVARGAS.png',
            '50145548' => '/img/eventos/exposicion/Anatomía del desgaste.jpg',
            '50169608' => '/img/eventos/teatro/Campamento del Price 2026 (11 y 12 AÑOS).jpeg',
            '50174283' => '/img/eventos/musica/Armonía coral participativa.jpg',
            '50220775' => '/img/eventos/danza/Compañía Nacional de Danza  Luz Arcas  Kor\'sia.png',
            '50249704' => '/img/eventos/exposicion/Visita Guiada al Museo del IES San Isidro y a la Exposición `Raíces de la Ciencia´.jpeg',
            '50271008' => '/img/eventos/cine/Cine de tijeras - Vicalvaro.png',
            '50312887' => '/img/eventos/musica/Ciclo Clásica a la Puerta. Concierto Primavera.jpg',
            '50314805' => '/img/eventos/cine/Bowl + Galaxy.jpg',
            '50315220' => '/img/eventos/exposicion/Fotografía Inclusiva.jpg',
            '50315339' => '/img/eventos/cine/Cinefórum \'Captain Fantastic\'.jpg',
            '50315343' => '/img/eventos/exposicion/Exposición de fotografía de los alumnos Centro Cultural Miguel de Cervantes.jpg',
            '50315530' => '/img/eventos/exposicion/Exposición colectiva de pintura de los alumnos de Destrezas Artísticas del Colegio Santa María la Blanca.jpg',
            '50315845' => '/img/eventos/cultura/4 escenas, 4 estilos.jpeg',
            '50315873' => '/img/eventos/exposicion/Limpiar y ordenar.jpg',
            '50316249' => '/img/eventos/cine/Cupido confuso.jpg',
            '50316497' => '/img/eventos/musica/Doce hombres y mujeres sin piedad.jpg',
            '50316501' => '/img/eventos/cine/Escape.jpg',
            '50316503' => '/img/eventos/cultura/Actividades deportivas para mayores.jpg',
            '50317387' => '/img/eventos/musica/Dramaturbo. Taller de teatro infantil.jpg',
            '50317407' => '/img/eventos/cine/A Rivers Gaze.jpg',
            '50317409' => '/img/eventos/cine/Escape.jpg',
            '50323146' => '/img/eventos/cine/El nombre.jpg',
            '50323894' => '/img/eventos/teatro/Certamen de expresión dramática.jpg',
            '50324247' => '/img/eventos/cine/Ciclo Fernando Trueba. La niña de tus ojos.jpg',
            '50324649' => '/img/eventos/cine/Cinefórum IVÁNdVARGAS.png',
            '50324811' => '/img/eventos/musica/DecirSioNo.jpeg',
            '50325172' => '/img/eventos/cine/Este cuerpo es mío.jpg',
            '50311507' => '/img/eventos/danza/Ballet Accesible Madrid.jpg',
            '50316499' => '/img/eventos/exposicion/Apertura extraordinariaNoche en blanco.jpg',
            '50314807' => '/img/eventos/exposicion/Limpiar y ordenar.jpg',
            '50316855' => '/img/eventos/musica/30 may CV FIGUE 2026_6 x 4 & CUEROS.jpg',
            '50315889' => '/img/eventos/danza/Jornadas gratuitas. Ritmos latinos y bailes americanos (nivel medio).jpg',
            '50316833' => '/img/eventos/musica/Delirium.png',
            '50317389' => '/img/eventos/danza/Israel Galván.jpg',
            '50316835' => '/img/eventos/exposicion/Picasso Miradas Múltiples.jpg',
            '50317416' => '/img/eventos/cine/El vídeo de Benny.jpg',
            '50316848' => '/img/eventos/musica/Comedia `Aquelarre de Humor´.jpg',
            '50313489' => '/img/eventos/musica/Concierto Flamenco Accesible.jpg',
            '50317396' => '/img/eventos/cultura/A lápiz o pincel.jpg',
            '50317401' => '/img/eventos/danza/Festival 4 estaciones.jpg',
            '50316808' => '/img/eventos/cine/Cine con Audiodescripción.jpg',
            '50314810' => '/img/eventos/musica/1306Amamos.jpg',
            '50320346' => '/img/eventos/musica/Cine en concierto.jpg',
            '50314812' => '/img/eventos/exposicion/Inauguración Exposición Colectiva Bachillerato de Artes del IES. Juan Ramón Jiménez.jpg',
            '50317382' => '/img/eventos/teatro/Campamento de verano de inglés y teatro.jpeg',
            '50325155' => '/img/eventos/musica/Bye Bye Blues.jpg',
            '50317392' => '/img/eventos/cine/Edipo esclavo.jpg',
            '50320419' => '/img/eventos/musica/Claroscuro en tela de saco.jpg',
            '50317380' => '/img/eventos/exposicion/Exposición.jpg',
            '50315847' => '/img/eventos/danza/DanzaLos sueños de Tessa 3. Mestizaje.jpg',
            '50317421' => '/img/eventos/teatro/Alicia en el País de las Maravillas.jpg',
            '50316856' => '/img/eventos/musica/Algunas veces ganas y otras aprendes.jpg',
            '50317411' => '/img/eventos/exposicion/Árboles de El Retiro2.jpg',
            '50316852' => '/img/eventos/musica/Antología de la Zarzuela.jpg',
            '50315963' => '/img/eventos/teatro/Algunas veces ganas y otras aprendes.jpg',
            '50310984' => '/img/eventos/exposicion/Triángulo rosa 1933 - 1945.jpg',
            '50324085' => '/img/eventos/cine/El príncipe de Nanawa.jpg',
            '50324090' => '/img/eventos/cultura/Aprende a identificar las mariposas de Madrid.jpg',
            '50324101' => '/img/eventos/exposicion/Exposición de pintura y fotografía.jpg',
            '50315884' => '/img/eventos/cine/Drinking and Driving.jpg',
            '50324048' => '/img/eventos/cine/Este cuerpo es mío.jpg',
            '50324064' => '/img/eventos/musica/Atrévete a cantar y actuar.jpg',
        ];

        foreach ($imagenes as $apiId => $url) {
            Evento::where('api_id', $apiId)->whereNull('imagen_url')->update(['imagen_url' => $url]);
        }

        $this->command->info('Imágenes de cine asignadas: ' . count($imagenes));
    }
}
