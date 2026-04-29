export type HeroMetric = {
  value: string;
  label: string;
};

export const homepageContent = {
  hero: {
    eyebrow: "Consultoría + formación técnica",
    title: "Aceleramos equipos y plataformas cloud con criterio operativo.",
    lede:
      "Diseñamos hojas de ruta, modernizamos delivery y entrenamos equipos en Kubernetes, containers y prácticas DevOps para que el cambio sea sostenible.",
    primaryAction: {
      href: "/servicios",
      label: "Explorar servicios"
    },
    secondaryAction: {
      href: "/bootcamps",
      label: "Ver bootcamps"
    },
    meta: [
      "Spanish-first con lenguaje técnico claro",
      "Consultoría enterprise-ready",
      "Bootcamps orientados a ejecución"
    ],
    summaryTitle: "Una sola firma para estrategia, delivery y upskilling",
    summaryBody:
      "Kontinu conecta advisory técnico con capacitación aplicada para ayudar a plataformas internas, squads y líderes de tecnología a moverse con más confianza.",
    summaryList: [
      "Assessment y roadmap para cloud, platform engineering y modernización.",
      "Acompañamiento de adopción con foco en seguridad, automatización y operación.",
      "Bootcamps corporativos para convertir conceptos en hábitos de trabajo."
    ],
    metrics: [
      { value: "Cloud", label: "Arquitectura, operación y gobierno" },
      { value: "Kubernetes", label: "Plataformas listas para escalar" },
      { value: "Containers", label: "Capacidades que aterrizan en delivery" }
    ] satisfies HeroMetric[]
  }
} as const;
