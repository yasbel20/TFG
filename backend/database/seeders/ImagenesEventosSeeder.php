<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class ImagenesEventosSeeder extends Seeder
{
    public function run(): void
    {
        $imagenes = [
            '50325246' => '/img/eventos/exposicion/Exposición alumnos del taller de pintura.jpg',
            '50294157' => '/img/eventos/exposicion/Exposición colectiva de caligrafía japonesa Shodo con Michi.jpg',
            '50318523' => '/img/eventos/exposicion/Exposición de alumnos y alumnas de Artes Plásticas y Fotografía del CSC ValleInclán Curso 20252026.jpg',
            '50292259' => '/img/eventos/exposicion/Exposición de pintura La belleza de los sueños.jpg',
            '50249814' => '/img/eventos/exposicion/Exposición Compositoras españolas medio siglo de creación musical.jpg',
            '50307511' => '/img/eventos/exposicion/Exposición Madrid entre épocas.png',
            '50182471' => '/img/eventos/exposicion/Exposición Miscelánea talleres pintura, acuarela y dibujo, curso 20252026.jpg',
            '50323774' => '/img/eventos/musica/Música Asociación cultural trovada.jpg',
            '50317673' => '/img/eventos/musica/Conferencia El Palacio Perdido arte y esplendor en el Buen Retiro.png',
            '50318516' => '/img/eventos/musica/Conferencia \'María Blanchard\'.jpg',
            '50315898' => '/img/eventos/cine/Encuadres LAV %2307 - Inquietudes.jpg',
            '50268143' => '/img/eventos/cultura/Árboles pasado, presente y futuro de un Madrid envuelto en ramas.jpg',
            '50173939' => '/img/eventos/cultura/Arte botánico taller de estampado vegetal.jpg',
            '50047743' => '/img/eventos/cultura/Astronautas investigando en el espacio para toda la humanidad.jpg',
            '50325158' => '/img/eventos/cine/Blind Love.jpg',
            '50317380' => '/img/eventos/cultura/Tal vez.jpg',
            '50325147' => '/img/eventos/cultura/Tal vez.jpg',
            '50316435' => '/img/eventos/cultura/Clase magistral alma en movimiento.jpg',
            '50321375' => '/img/eventos/cultura/Charla Soledad emocional, entre la conexión y la ausencia por Diana Esteban.jpg',
            '50317683' => '/img/eventos/danza/Danza El sueño de bailar.jpg',
            '50320031' => '/img/eventos/teatro/Algunas veces ganas y otras aprendes.jpg',
            '50323790' => '/img/eventos/teatro/Algunas veces ganas y otras aprendes.jpg',
            '50317690' => '/img/eventos/musica/Baile sevillanas y flamenco.jpg',
            '50320744' => '/img/eventos/musica/CINECONCIERTO. I Ciclo \'Joyas del cine mudo\' con Jorge Gil Zulueta.jpg',
            '50323999' => '/img/eventos/exposicion/Visita Guiada al Museo del IES San Isidro y a la Exposición `Raíces de la Ciencia´.jpeg',
            '50324011' => '/img/eventos/exposicion/Visita Guiada al Museo del IES San Isidro y a la Exposición `Raíces de la Ciencia´.jpeg',
            '50295875' => '/img/eventos/exposicion/Exposición de Dibujo y Pintura.jpg',
            '50315517' => '/img/eventos/exposicion/Exposición de Dibujo y Pintura.jpg',
            '50324010' => '/img/eventos/exposicion/Aluciflipante.jpg',
            '50320054' => '/img/eventos/exposicion/Exposición.jpg',
            '50317696' => '/img/eventos/exposicion/Exposición.jpg',
            '50299419' => '/img/eventos/exposicion/El Madrid de Olga Ramos.jpg',
            '50297819' => '/img/eventos/exposicion/Entrega de los XXI Premios Puerta de Madrid.jpg',
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
            '50303632' => '/img/eventos/danza/Actividades lúdico deportivas.jpg',
            '50322526' => '/img/eventos/exposicion/Apertura extraordinariaNoche en blanco.jpg',
            '50108251' => '/img/eventos/danza/Compañía Nacional de Danza  Luz Arcas  Kor\'sia.png',
            '50319726' => '/img/eventos/danza/DanzaLos sueños de Tessa 3. Mestizaje.jpg',
            '50322287' => '/img/eventos/danza/Espacio Sevillanas Primera Sesión.jpg',
            '50322252' => '/img/eventos/danza/Espectáculo de Danza `La Costumbre de la Apatía.jpg',
            '50235568' => '/img/eventos/danza/Festival 4 estaciones.jpg',
            '50108229' => '/img/eventos/danza/Israel Galván.jpg',
            '50257645' => '/img/eventos/cultura/4 escenas, 4 estilos.jpeg',
            '50319880' => '/img/eventos/cultura/80 Aniversario de la revista Ínsula.jpg',
            '50303712' => '/img/eventos/cultura/Actividades deportivas para mayores.jpg',
            '50292188' => '/img/eventos/cultura/Allegro ma non troppo. Cía 3 Notas.jpg',
            '12791885' => '/img/eventos/cultura/Amores a ciegas.jpg',
            '50316069' => '/img/eventos/cultura/Antología poética y Concurso de relatos de libros Mablaz.jpg',
        ];

        foreach ($imagenes as $apiId => $url) {
            Evento::where('api_id', $apiId)->update(['imagen_url' => $url]);
        }

        $this->command->info('Imágenes de eventos actualizadas: ' . count($imagenes));
    }
}
