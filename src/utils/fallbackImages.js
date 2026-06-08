const IMAGES = {
  Música: [
    "1306Amamos.jpg","2605_pulso.jpg","2705Agrucha.jpg","3105Alma.jpg",
    "Afroboy – Talento vallecano entre el pop punk y la música urbana.jpg",
    "Agrupación de flamenco.jpg","Al Natural. Canciones de siempre.jpg",
    "Andrés Suárez.jpg","Antología de la Zarzuela.jpg","Armonía coral participativa.jpg",
    "Artes en el Retiro.jpg","Baile sevillanas y flamenco.jpg","Bon Odori x Jota.jpg",
    "BuleRap – Batalla de Gallos.jpg","Bye Bye Blues.jpg",
    "CINECONCIERTO. I Ciclo 'Joyas del cine mudo' con Jorge Gil Zulueta.jpg",
    "CIRCUS BAOBAB.jpg","Canciones viajeras.jpg","Cante con alma.jpg",
    "Cantos del mundo.jpg","Carmela Greco y sus alumnas.jpg","Carmen Massanet.jpg",
    "Ciclo Clásica a la Puerta. Concierto Primavera.jpg","Cine en concierto.jpg",
    "Concierto Flamenco Accesible.jpg","Concierto de arpa y violín.jpeg",
    "Concierto de arpa.jpg","Concierto.jpg","Jazz en el Conde Duque.jpg",
    "MÚSICA. Pablo Moreno.jpg","Orquesta Sinfónica Accesible.jpeg","Rock Inclusivo Madrid.jpg",
  ],
  Teatro: [
    "Actúa.jpg","Alcanzar una estrella.jpg","Alicia en el País de las Maravillas.jpg",
    "Bodas de sangre.jpg","Caperucita y otros lobos.jpg","Casa Madre.jpg",
    "Certamen de expresión dramática.jpg","Don Quijote Accesible.jpg",
    "El Gran Teatro del Mundo.jpeg","El suelo de una noche de verano.jpg",
    "La Casa de Bernarda Alba.jpg",
    "75 años de dirección artística cinematográfica. Gil Parrondo, creador de sueños.png",
  ],
  Cine: [
    "A Rivers Gaze.jpg","Abortion.jpg","Animal Love.jpg","Blind Love.jpg",
    "Bowl + Galaxy.jpg","Cenizas bajo el mar.jpg","Change the Battery Pack (LAV 2026).jpeg",
    "Ciclo Almodóvar Subtitulado.jpg","Ciclo Fernando Trueba. La niña de tus ojos.jpg",
    "Cine con Audiodescripción.jpg","Cine de Verano Accesible.jpg",
    "Cinefórum 'Captain Fantastic'.jpg","Cupido confuso.jpg","Divino tesoro.jpg",
    "El recuerdo de Marnie.jpg","El nombre.jpg","Escape.jpg",
    "Este cuerpo es mío.jpg","Festival Cine Accesible.jpg",
  ],
  Danza: [
    "Areia, el agua encuentra la tierra.jpg","Ballet Accesible Madrid.jpg",
    "Compañía Nacional de Danza Luz Arcas Kor'sia.png",
    "Danza El sueño de bailar.jpg","Danza Inclusiva en el Retiro.jpg",
    "Danza contemporánea en la biblioteca Tejido Conectivo.jpg",
    "Espacio Sevillanas Primera Sesión.jpg",
    "Espectáculo de Danza `La Costumbre de la Apatía.jpg",
    "Festival 4 estaciones.jpg","Flamenco Accesible Madrid.jpg",
    "Israel Galván.jpg","Noche de Danza Contemporánea.jpg",
    "Taller de Sevillanas (2ª parte).jpg","Tango Argentino.jpg","XVI Festival de Danza.jpg",
  ],
  Exposición: [
    "Aluciflipante.jpg","Anatomía del desgaste.jpg","Arte Urbano Madrid.jpg",
    "Carteles Históricos Madrid.jpg","Eduardo Chillida. Soñar el espacio.jpg",
    "El Madrid de Olga Ramos.jpg","Exposición Madrid entre épocas.png",
    "Exposición de pintura La belleza de los sueños.jpg",
    "Exposición de fotografías.jpg","Exposición de Dibujo y Pintura.jpg",
    "Fotografía Inclusiva.jpg","Picasso Miradas Múltiples.jpg",
    "Triángulo rosa 1933 - 1945.jpg","Árboles de El Retiro.jpg",
    "Mayores Artistas.jpg","Súper Zines 2026.jpg",
  ],
  Cultura: [
    "Feria del Libro de Madrid.jpg","Festival Cultura Accesible.jpg",
    "Taller Inclusivo de Arte.jpg","Visita Guiada Accesible Prado.jpg",
    "Café filosófico.jpg","Club de lectura de novela negra.jpg",
    "FLM-Cartel-82_bajaweb.jpg","Cinco Lunas con Federico.jpg",
    "Astronautas investigando en el espacio para toda la humanidad.jpg",
    "Actividades deportivas para mayores.jpg","Aprende a identificar las mariposas de Madrid.jpg",
    "Avelino Sala.jpg","Casa Matriz.jpg","Charla Soledad emocional, entre la conexión y la ausencia por Diana Esteban.jpg",
  ],
};

const CAT_FOLDER = {
  Música:     "musica",
  Teatro:     "teatro",
  Cine:       "cine",
  Danza:      "danza",
  Exposición: "exposicion",
  Cultura:    "cultura",
};

export function getFallbackImage(cat, eventId) {
  const files = IMAGES[cat] || IMAGES.Cultura;
  const folder = CAT_FOLDER[cat] || "cultura";
  const idx = Math.abs(hashCode(String(eventId))) % files.length;
  return `/img/eventos/${folder}/${encodeURIComponent(files[idx])}`;
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h;
}
