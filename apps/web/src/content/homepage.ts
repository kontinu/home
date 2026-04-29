export type HeroMetric = {
  value: string;
  label: string;
};

export type HeroPanel = {
  kicker: string;
  title: string;
  body: string;
};

export const homepageContent = {
  hero: {
    eyebrow: "Consultoría + formación técnica",
    titleLines: [
      "Aceleramos",
      "plataformas",
      "con criterio operativo."
    ],
    titleAccent: "cloud",
    lede:
      "Diseñamos hojas de ruta, modernizamos delivery y entrenamos equipos en Kubernetes, containers y prácticas DevOps para mover arquitectura, operación y capacidades en una misma trayectoria de avance.",
    primaryAction: {
      href: "/servicios",
      label: "Explorar servicios"
    },
    secondaryAction: {
      href: "/bootcamps",
      label: "Ver bootcamps"
    },
    meta: [
      "Cloud architecture",
      "Kubernetes enablement",
      "Delivery modernization"
    ],
    panels: [
      {
        kicker: "Servicios",
        title: "Assessments y diseño operativo",
        body: "Arquitectura, platform engineering y criterios de adopción para líderes y plataformas internas."
      },
      {
        kicker: "Plataformas",
        title: "Kubernetes y delivery confiable",
        body: "Más claridad para operar, desplegar y escalar sin fricción innecesaria."
      },
      {
        kicker: "Bootcamps",
        title: "Capacidad técnica que aterriza",
        body: "Formación corporativa para convertir conceptos en decisiones reales."
      }
    ] satisfies HeroPanel[]
  }
} as const;
