const TOPIC_DICTIONARY = [
  { slug: "confianza", label: "Confianza", keywords: ["confianza", "credibilidad", "fiar"] },
  { slug: "identidad", label: "Identidad", keywords: ["identidad", "yo", "persona", "personalidad"] },
  { slug: "comunidad", label: "Comunidad", keywords: ["comunidad", "colectivo", "grupo", "sociedad"] },
  { slug: "poder", label: "Poder", keywords: ["poder", "jerarquia", "liderazgo", "autoridad"] },
  { slug: "cultura", label: "Cultura", keywords: ["cultura", "ritual", "simbolo", "narrativa"] },
  { slug: "tecnologia", label: "Tecnologia", keywords: ["tecnologia", "digital", "algoritmo", "plataforma"] },
  { slug: "emociones", label: "Emociones", keywords: ["emocion", "emociones", "miedo", "deseo", "afecto"] },
  { slug: "cooperacion", label: "Cooperacion", keywords: ["cooperacion", "cooperar", "alianza", "colaboracion"] },
];

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function enrichTheory(theory) {
  const searchable = normalizeText(`${theory.title} ${theory.content}`);
  const matchedTopics = TOPIC_DICTIONARY.filter((topic) =>
    topic.keywords.some((keyword) => searchable.includes(normalizeText(keyword))),
  ).map(({ slug, label }) => ({ slug, label }));

  const topics = matchedTopics.length > 0 ? matchedTopics : [{ slug: "general", label: "General" }];

  return {
    ...theory,
    topics,
    excerpt:
      theory.content.length > 220
        ? `${theory.content.slice(0, 217).trim()}...`
        : theory.content,
    authorInitial: theory.author?.username?.slice(0, 1).toUpperCase() ?? "U",
  };
}

export function buildTopicOptions(theories) {
  const options = new Map([["all", "Todos los temas"]]);

  theories.forEach((theory) => {
    theory.topics.forEach((topic) => {
      options.set(topic.slug, topic.label);
    });
  });

  return Array.from(options, ([value, label]) => ({ value, label }));
}

export function filterTheories(theories, filters) {
  const query = normalizeText(filters.query.trim());

  return theories.filter((theory) => {
    const matchesTopic =
      filters.topic === "all" || theory.topics.some((topic) => topic.slug === filters.topic);

    const searchable = normalizeText(
      `${theory.title} ${theory.content} ${theory.author?.username ?? ""} ${theory.topics
        .map((topic) => topic.label)
        .join(" ")}`,
    );

    const matchesQuery = !query || searchable.includes(query);

    return matchesTopic && matchesQuery;
  });
}
