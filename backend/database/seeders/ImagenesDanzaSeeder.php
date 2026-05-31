<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class ImagenesDanzaSeeder extends Seeder
{
    public function run(): void
    {
        $imagenes = [
            '12006112' => '/img/eventos/musica/Concerto Jacballet.jpg',
            '12366746' => '/img/eventos/danza/Espectáculo de Danza `La Costumbre de la Apatía.jpg',
            '12776973' => '/img/eventos/cultura/80 Aniversario de la revista Ínsula.jpg',
            '50039885' => '/img/eventos/danza/Jornadas gratuitas. Ritmos latinos y bailes americanos (nivel medio).jpg',
            '50108251' => '/img/eventos/danza/Compañía Nacional de Danza  Luz Arcas  Kor\'sia.png',
            '50145704' => '/img/eventos/danza/XVI Festival de Danza.jpg',
            '50265834' => '/img/eventos/musica/Bon Odori x Jota.jpg',
            '50293817' => '/img/eventos/exposicion/Exposición semana de mayores de 2026.jpeg',
            '50296462' => '/img/eventos/exposicion/Exposición Compositoras españolas medio siglo de creación musical.jpg',
            '50297218' => '/img/eventos/musica/Ciclo Clásica a la Puerta. Concierto Primavera.jpg',
            '50303632' => '/img/eventos/danza/Actividades lúdico deportivas.jpg',
            '50307620' => '/img/eventos/cine/Capítulo XXXII Recuerdo de Aram Slobodian (una poética de la desaparición).png',
            '50315366' => '/img/eventos/danza/Areia, el agua encuentra la tierra.jpg',
            '50316124' => '/img/eventos/danza/Ballet Accesible Madrid.jpg',
            '50317683' => '/img/eventos/danza/Danza El sueño de bailar.jpg',
            '50318370' => '/img/eventos/danza/Tango Argentino.jpg',
            '50318506' => '/img/eventos/danza/Espectáculo de Variedades.jpg',
            '50319726' => '/img/eventos/danza/DanzaLos sueños de Tessa 3. Mestizaje.jpg',
            '50320734' => '/img/eventos/musica/Afroboy – Talento vallecano entre el pop punk y la música urbana.jpg',
            '50322242' => '/img/eventos/musica/Carmen Massanet.jpg',
            '50322252' => '/img/eventos/danza/Espectáculo de Danza `La Costumbre de la Apatía.jpg',
            '50322274' => '/img/eventos/danza/Taller de Sevillanas (2ª parte).jpg',
            '50322287' => '/img/eventos/danza/Espacio Sevillanas Primera Sesión.jpg',
            '50322497' => '/img/eventos/danza/Showcase de Hip-Hop Freestyle `Partyéndolo´.jpg',
            '50323673' => '/img/eventos/danza/Danza contemporánea en la biblioteca Tejido Conectivo.jpg',
            '50324109' => '/img/eventos/danza/Showcase de Hip-Hop Freestyle `Partyéndolo´.jpg',
            '50324941' => '/img/eventos/danza/Primer festival Celebrando al Sol.jpg',
            '50325146' => '/img/eventos/musica/Bye Bye Blues.jpg',
        ];

        foreach ($imagenes as $apiId => $url) {
            Evento::where('api_id', $apiId)->whereNull('imagen_url')->update(['imagen_url' => $url]);
        }

        $this->command->info('Imágenes de Danza asignadas: ' . count($imagenes));
    }
}
