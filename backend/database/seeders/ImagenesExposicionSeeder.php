<?php

namespace Database\Seeders;

use App\Models\Evento;
use Illuminate\Database\Seeder;

class ImagenesExposicionSeeder extends Seeder
{
    public function run(): void
    {
        $imagenes = [
            '11970704' => '/img/eventos/exposicion/Árboles de El Retiro2.jpg',
            '12048639' => '/img/eventos/exposicion/Árboles de El Retiro.jpg',
            '12459549' => '/img/eventos/exposicion/Un sueño de todos.jpg',
            '12728530' => '/img/eventos/musica/Bye Bye Blues.jpg',
            '50103201' => '/img/eventos/exposicion/Mayores Artistas.jpg',
            '50104191' => '/img/eventos/exposicion/Se está haciendo tarde.jpg',
            '50174902' => '/img/eventos/exposicion/La risa es un estadillo.jpg',
            '50182471' => '/img/eventos/exposicion/Exposición Miscelánea talleres pintura, acuarela y dibujo, curso 20252026.jpg',
            '50192919' => '/img/eventos/exposicion/Visita guiada a las instalaciones del CEAC Maris Stella y su exposición.jpg',
            '50196297' => '/img/eventos/exposicion/Visitas guiadas a las exposiciones.jpg',
            '50196742' => '/img/eventos/exposicion/\'Centenario Cuesta de Moyano\' Biblioteca Gerardo Diego.jpg',
            '50196778' => '/img/eventos/exposicion/\'Centenario Cuesta de Moyano\' Biblioteca José Hierro.jpg',
            '50231598' => '/img/eventos/cine/A Rivers Gaze.jpg',
            '50242355' => '/img/eventos/exposicion/EXPOSICIÓN FOTOGRÁFICA \'THE ANIMALS\' DE ESTELA DE CASTRO.jpg',
            '50263967' => '/img/eventos/exposicion/EXPOSICIÓN PELO DE TORMENTA - HOMENAJE A FRANCISCO NIEVA.jpg',
            '50264964' => '/img/eventos/exposicion/Exposición.jpg',
            '50265697' => '/img/eventos/exposicion/Visitas guiadas a las exposiciones.jpg',
            '50282595' => '/img/eventos/exposicion/Entrega de los XXI Premios Puerta de Madrid.jpg',
            '50291191' => '/img/eventos/exposicion/Exposición del Taller de pintura. Profesora Xilenis Colina.png',
            '50291871' => '/img/eventos/exposicion/Exposición de fotografías.jpg',
            '50291887' => '/img/eventos/exposicion/Rafael Canet Font y Josefina Coca.jpg',
            '50292259' => '/img/eventos/exposicion/Exposición de pintura La belleza de los sueños.jpg',
            '50293304' => '/img/eventos/exposicion/Life 4 pollinators. Salva los polinizadores de tu ciudad.jpg',
            '50294079' => '/img/eventos/exposicion/Exposición colectiva de pintura de los alumnos de Destrezas Artísticas del Colegio Santa María la Blanca.jpg',
            '50294157' => '/img/eventos/exposicion/Exposición colectiva de caligrafía japonesa Shodo con Michi.jpg',
            '50295654' => '/img/eventos/exposicion/Alumnos del I.E.S. Conde de Orgaz.jpg',
            '50295875' => '/img/eventos/exposicion/Exposición de Dibujo y Pintura.jpg',
            '50296121' => '/img/eventos/musica/Bye Bye Blues.jpg',
            '50297188' => '/img/eventos/exposicion/El arte de la mediación.jpg',
            '50297817' => '/img/eventos/exposicion/Aprender y plasmar.jpg',
            '50297819' => '/img/eventos/exposicion/Entrega de los XXI Premios Puerta de Madrid.jpg',
            '50300922' => '/img/eventos/exposicion/Exposición de Costura Creativa.png',
            '50301886' => '/img/eventos/teatro/Campamento del Price 2026 (9 y 10 AÑOS).jpeg',
            '50302110' => '/img/eventos/exposicion/Exposición de pintura y fotografía.jpg',
            '50307511' => '/img/eventos/exposicion/Exposición Madrid entre épocas.png',
            '50307965' => '/img/eventos/exposicion/Libros a la calle para los pequeños y jóvenes lectores.jpg',
            '50307967' => '/img/eventos/exposicion/Súper Zines 2026.jpg',
            '50315195' => '/img/eventos/exposicion/Exposición de Bolillos.jpg',
            '50315208' => '/img/eventos/exposicion/Exposición de Punto y Crochet.png',
            '50315354' => '/img/eventos/exposicion/Exposición talleres 20252026 del CC San Juan Bautista.jpg',
            '50315517' => '/img/eventos/exposicion/Exposición de Dibujo y Pintura.jpg',
            '50315790' => '/img/eventos/exposicion/Exposición de Pintura y Dibujo.jpg',
            '50315810' => '/img/eventos/exposicion/Exposición trabajo talleres gratuitos infantiles.jpg',
            '50316314' => '/img/eventos/exposicion/Exposición Miscelánea talleres pintura, acuarela y dibujo, curso 20252026.jpg',
            '50317696' => '/img/eventos/exposicion/Exposición.jpg',
            '50318523' => '/img/eventos/exposicion/Exposición de alumnos y alumnas de Artes Plásticas y Fotografía del CSC ValleInclán Curso 20252026.jpg',
            '50319009' => '/img/eventos/exposicion/Exposición de fotografía y pintura..jpg',
            '50319904' => '/img/eventos/exposicion/Exposición de pintura a cargo de los grupos de adultos del Centro Cultural Buero Vallejo.jpg',
            '50320054' => '/img/eventos/exposicion/Exposición.jpg',
            '50320063' => '/img/eventos/exposicion/Exposición de alumnos y alumnas de Artes Plásticas y Fotografía del CSC ValleInclán Curso 20252026.jpg',
            '50321933' => '/img/eventos/exposicion/Anatomía del desgaste.jpg',
            '50322249' => '/img/eventos/exposicion/Exposición de fotografía de los alumnos Centro Cultural Miguel de Cervantes.jpg',
            '50322526' => '/img/eventos/exposicion/Apertura extraordinariaNoche en blanco.jpg',
            '50322617' => '/img/eventos/exposicion/Inauguración Exposición Colectiva Bachillerato de Artes del IES. Juan Ramón Jiménez.jpg',
            '50323677' => '/img/eventos/exposicion/Triángulo rosa 1933 - 1945.jpg',
            '50323711' => '/img/eventos/exposicion/Exposición de alumnos Centro Cultural Lope de Vega.jpg',
            '50323916' => '/img/eventos/exposicion/Exposición semana de mayores de 2026.jpeg',
            '50323921' => '/img/eventos/exposicion/Señal del vacío. Por Sami Shaldoum.jpg',
            '50323932' => '/img/eventos/exposicion/Exposición de los alumnos del taller de manualidades. Profesora Xilenis Colina.jpg',
            '50323944' => '/img/eventos/exposicion/Exposición de los alumnos de pintura y cerámica.jpg',
            '50323999' => '/img/eventos/exposicion/Visita Guiada al Museo del IES San Isidro y a la Exposición `Raíces de la Ciencia´.jpeg',
            '50324010' => '/img/eventos/exposicion/Aluciflipante.jpg',
            '50324011' => '/img/eventos/exposicion/Visita Guiada al Museo del IES San Isidro y a la Exposición `Raíces de la Ciencia´.jpeg',
            '50324054' => '/img/eventos/exposicion/Exposición de pintura, dibujo y fotografía.jpeg',
            '50324105' => '/img/eventos/exposicion/IV Muestra de Sevillanas.jpg',
            '50324151' => '/img/eventos/exposicion/Exposiciones de los trabajos realizados a lo largo del curso por los alumnos de los talleres del centro cultural.jpeg',
            '50324211' => '/img/eventos/exposicion/Exposiciones de los trabajos realizados a lo largo del curso por los alumnos del Centro Cultural.jpg',
            '50324243' => '/img/eventos/exposicion/Exposición de los trabajos realizados por los alumnos.jpg',
            '50324279' => '/img/eventos/musica/Charla-taller \'Venus y Marte creación de una ópera andrógina\'.jpg',
            '50325237' => '/img/eventos/exposicion/Exposición alumnos de los talleres de acuarela.jpg',
            '50325246' => '/img/eventos/exposicion/Exposición alumnos del taller de pintura.jpg',
            '50325288' => '/img/eventos/exposicion/Exposición de pintura y restauración.jpg',
        ];

        foreach ($imagenes as $apiId => $url) {
            Evento::where('api_id', $apiId)->whereNull('imagen_url')->update(['imagen_url' => $url]);
        }

        $this->command->info('Imágenes de Exposición asignadas: ' . count($imagenes));
    }
}
