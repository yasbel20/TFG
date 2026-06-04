const FAQ_ITEMS = [
  {
    q: "¿Por qué usar INCLUGO en lugar de otras agendas?",
    a: "Olvídate de perder el tiempo buscando en la letra pequeña de cada evento para saber si puedes asistir o investigando los recintos por tu cuenta. Aquí marcas tus necesidades una sola vez y la web se encarga de mostrarte únicamente los planes que se adaptan a ti.",
  },
  {
    q: "¿La información de accesibilidad es fiable?",
    a: "Cuentas con datos oficiales del Ayuntamiento de Madrid que se actualizan a diario. No vas a encontrar información obsoleta ni aproximada: es contenido real y contrastado. Eso sí, si tus necesidades son muy específicas, te aconsejamos confirmar con el recinto antes de ir, ya que los detalles del día a día pueden cambiar.",
  },
  {
    q: "¿Cómo funcionan tus ajustes de navegación?",
    a: "Dispones de un botón azul siempre visible en la esquina inferior de la pantalla. Al pulsarlo, abres tus propios ajustes de navegación para activar la lectura en voz alta por teclado, escuchar párrafos con un clic, ampliar el texto o aislar tu lectura con la máscara de enfoque. Tu configuración se guarda automáticamente para tu próxima visita.",
  },
  {
    q: "¿Puedo filtrar por tipo de accesibilidad?",
    a: "Sí, esa es la clave de la web. Puedes combinar criterios para sillas de ruedas, lengua de signos, pavimento podotáctil, bucle magnético y más. Si un evento no ofrece el recurso exacto que necesitas, desaparece de tus resultados al instante para que navegues directo al grano y sin rodeos.",
  },
  {
    q: "¿Los eventos tienen precio de entrada?",
    a: "No pagas comisiones ni compras dentro de la web. Cuando encuentres el plan que te interesa, accedes de forma directa al canal oficial del organizador para gestionar tus pases o reservar tus entradas. Además, vas a descubrir muchísimos eventos en Madrid que son totalmente gratuitos.",
  },
  {
    q: "¿Está disponible en tu móvil?",
    a: "Por supuesto. Disfrutas de una experiencia fluida tanto en tu teléfono como en tu tableta u ordenador. El diseño de la interfaz y las herramientas de accesibilidad te acompañan vayas donde vayas. Y si encuentras algo que no se ajusta bien en tu pantalla, nos avisas; nos importa que navegues sin barreras.",
  },
];

export default function FaqSection() {
  return (
    <section className="faq-sec reveal" aria-labelledby="faq-heading">
      <div className="faq-inner">
        <div className="faq-header">
          <p className="sec-eyebrow">Soporte</p>
          <h2 id="faq-heading" className="faq-heading">
            TODO LO QUE<br/><span className="faq-hl">NECESITAS SABER</span>
          </h2>
        </div>
        <div className="faq-grid">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq-item" tabIndex={0}>
              <p className="faq-q-static">{item.q}</p>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
