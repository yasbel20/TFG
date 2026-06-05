export function HighlightedText({ text, wordIndex }) {
  if (!text) return null;

  const tokens = [];
  let last = 0;
  const re = /\S+/g;
  let m;
  let wi = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type: "space", val: text.slice(last, m.index), wi: -1 });
    tokens.push({ type: "word", val: m[0], wi: wi++ });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ type: "space", val: text.slice(last), wi: -1 });

  return (
    <p className="ed-desc-text" aria-live="polite">
      {tokens.map((tok, i) =>
        tok.type === "space"
          ? tok.val
          : (
            <span
              key={i}
              data-wi={tok.wi}
              className={wordIndex === tok.wi ? "ed-word-hi" : ""}
              role={wordIndex === tok.wi ? "mark" : undefined}
            >
              {tok.val}
            </span>
          )
      )}
    </p>
  );
}

export function HighlightedDesc({ text, wordIndex }) {
  if (!text) return null;

  const paragraphs = text.split(/\n+/).filter(p => p.trim());
  const result = [];
  let globalWi = 0;

  paragraphs.forEach((para, pi) => {
    const tokens = [];
    let last = 0;
    const re = /\S+/g;
    let m;

    while ((m = re.exec(para)) !== null) {
      if (m.index > last) tokens.push({ type: "space", val: para.slice(last, m.index) });
      tokens.push({ type: "word", val: m[0], wi: globalWi++ });
      last = m.index + m[0].length;
    }
    if (last < para.length) tokens.push({ type: "space", val: para.slice(last) });

    result.push(
      <p key={pi} className="ed-desc-text" aria-live={pi === 0 ? "polite" : "off"}>
        {tokens.map((tok, ti) =>
          tok.type === "space"
            ? tok.val
            : (
              <span
                key={ti}
                data-wi={tok.wi}
                className={wordIndex === tok.wi ? "ed-word-hi" : ""}
                role={wordIndex === tok.wi ? "mark" : undefined}
              >
                {tok.val}
              </span>
            )
        )}
      </p>
    );
  });

  return <>{result}</>;
}
