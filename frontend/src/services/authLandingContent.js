export function getAuthLandingContent() {
  return {
    hero: {
      eyebrow: "Theory Social",
      title: "Donde las teorias humanas se convierten en debate serio.",
      description:
        "Publica ideas, contrasta argumentos y sigue conversaciones con contexto. El acceso es privado para proteger la calidad del debate desde el primer momento.",
      primaryCta: "Crear cuenta",
      secondaryCta: "Ya tengo acceso",
      metrics: [
        { value: "Debate", label: "enfocado y trazable" },
        { value: "Sesiones", label: "seguras con acceso privado" },
        { value: "Teorias", label: "listas para evolucionar por votos" },
      ],
    },
    features: [
      {
        title: "Publicacion estructurada",
        description:
          "Cada teoria nace con contexto, autor y una base clara para que el debate no se pierda en ruido.",
      },
      {
        title: "Conversacion con criterio",
        description:
          "La red esta pensada para responder, cuestionar y mejorar ideas, no solo para lanzar opiniones sueltas.",
      },
      {
        title: "Escalable desde el inicio",
        description:
          "La experiencia de acceso, los ejemplos y las piezas visuales estan preparadas para conectarse a contenido dinamico mas adelante.",
      },
    ],
    examples: [
      {
        category: "Teoria emergente",
        title: "La confianza colectiva nace de micropruebas repetidas",
        excerpt:
          "Una teoria sobre como los pequenos gestos consistentes pesan mas que los grandes discursos en comunidades digitales.",
        author: "Clara M.",
        stats: ["24 respuestas", "128 votos", "6 derivaciones"],
      },
      {
        category: "Debate activo",
        title: "El anonimato parcial mejora la honestidad inicial",
        excerpt:
          "Discusion abierta entre usuarios que comparan libertad de expresion, sesgos sociales y responsabilidad posterior.",
        author: "Foro Curado",
        stats: ["11 objeciones", "4 sintesis", "Moderacion limpia"],
      },
      {
        category: "Sintesis destacada",
        title: "De intuicion a hipotesis compartida",
        excerpt:
          "Las mejores conversaciones terminan en una version mas afinada de la idea original, no en un ganador vacio.",
        author: "Equipo editorial",
        stats: ["Resumen semanal", "Historial visible", "Fuentes anexables"],
      },
    ],
    timeline: [
      "Entras con sesion segura.",
      "Publicas una teoria o respondes a otra.",
      "La comunidad debate, vota y refina la idea.",
    ],
  };
}
