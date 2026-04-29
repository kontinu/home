import { sanityClient } from "./sanity.client";
import {
  bootcampBySlugQuery,
  bootcampsQuery,
  serviceBySlugQuery,
  servicesQuery
} from "./sanity.queries";

export type OfferingCta = {
  label?: string | null;
  href?: string | null;
  variant?: string | null;
} | null;

export type RichTextChild = {
  _type?: string;
  text?: string;
};

export type RichTextBlock = {
  _key?: string;
  _type?: string;
  style?: string;
  children?: RichTextChild[];
  listItem?: string;
  level?: number;
};

export type ServiceEntry = {
  _id: string;
  _type: "service";
  title: string;
  slug: string;
  summary: string;
  primaryCta?: OfferingCta;
  body?: RichTextBlock[] | null;
};

export type BootcampEntry = {
  _id: string;
  _type: "bootcamp";
  title: string;
  slug: string;
  summary: string;
  audience?: string | null;
  primaryCta?: OfferingCta;
  body?: RichTextBlock[] | null;
};

const serviceCollectionCta = {
  label: "Solicitar propuesta",
  href: "mailto:hola@kontinu.io?subject=Solicitar%20propuesta%20Kontinu"
} as const;

const bootcampInfoCta = {
  label: "Solicitar información",
  href: "mailto:hola@kontinu.io?subject=Informaci%C3%B3n%20sobre%20bootcamps%20Kontinu"
} as const;

const bootcampEnrollmentCta = {
  label: "Inscribirme",
  href: "mailto:hola@kontinu.io?subject=Inscripci%C3%B3n%20a%20bootcamp%20Kontinu"
} as const;

function paragraph(text: string): RichTextBlock {
  return {
    _type: "block",
    style: "normal",
    children: [{ _type: "span", text }]
  };
}

function heading(text: string): RichTextBlock {
  return {
    _type: "block",
    style: "h2",
    children: [{ _type: "span", text }]
  };
}

function bullet(text: string): RichTextBlock {
  return {
    _type: "block",
    listItem: "bullet",
    children: [{ _type: "span", text }]
  };
}

const fallbackServices: ServiceEntry[] = [
  {
    _id: "fallback-service-platform",
    _type: "service",
    title: "Platform engineering para equipos que necesitan ordenar su operación",
    slug: "platform-engineering",
    summary:
      "Evaluamos la plataforma actual, alineamos decisiones con negocio y convertimos deuda operativa en un roadmap ejecutable.",
    primaryCta: serviceCollectionCta,
    body: [
      paragraph(
        "Entramos cuando la plataforma ya es crítica, pero el equipo necesita recuperar claridad para decidir mejor y ejecutar con menos fricción."
      ),
      heading("Qué trabajamos"),
      bullet("Assessment técnico y operativo sobre cloud, delivery, seguridad y gobernanza."),
      bullet("Roadmap priorizado con quick wins, riesgos y decisiones que vale la pena secuenciar."),
      bullet("Acompañamiento hands-on para aterrizar estándares, flujos y responsabilidades.")
    ]
  },
  {
    _id: "fallback-service-kubernetes",
    _type: "service",
    title: "Kubernetes y cloud con foco en confiabilidad operativa",
    slug: "kubernetes-cloud",
    summary:
      "Diseñamos una base más estable para clusters, despliegues y observabilidad sin perder velocidad de entrega.",
    primaryCta: serviceCollectionCta,
    body: [
      paragraph(
        "Este servicio ayuda a equipos que ya usan containers o Kubernetes pero necesitan consolidar prácticas para operar con más confianza."
      ),
      heading("Dónde aportamos"),
      bullet("Revisión de arquitectura, ambientes y patrones de despliegue."),
      bullet("Buenas prácticas para observabilidad, rollback, seguridad y costos."),
      bullet("Transferencia de criterio al equipo para que la operación no dependa de una sola persona.")
    ]
  },
  {
    _id: "fallback-service-delivery",
    _type: "service",
    title: "Modernización de delivery para reducir fricción y aumentar cadencia",
    slug: "delivery-moderno",
    summary:
      "Ordenamos pipelines, criterios de release y automatización para que el delivery vuelva a ser una capacidad, no una fuente de desgaste.",
    primaryCta: serviceCollectionCta,
    body: [
      paragraph(
        "Cuando el delivery se vuelve lento, manual o impredecible, el problema rara vez es una sola herramienta. Trabajamos el sistema completo."
      ),
      heading("Resultados esperados"),
      bullet("Pipelines más claros, confiables y mantenibles."),
      bullet("Estándares compartidos para release, calidad y coordinación entre equipos."),
      bullet("Menos trabajo reactivo y más espacio para mejoras sostenibles.")
    ]
  }
];

const fallbackBootcamps: BootcampEntry[] = [
  {
    _id: "fallback-bootcamp-containers",
    _type: "bootcamp",
    title: "Containers y Kubernetes para squads que necesitan operar con criterio",
    slug: "containers-kubernetes",
    summary:
      "Una ruta aplicada para que el equipo entienda fundamentos, despliegue con confianza y converse mejor sobre operación.",
    audience: "Squads técnicos y líderes de plataforma",
    primaryCta: bootcampInfoCta,
    body: [
      paragraph(
        "Este bootcamp combina fundamentos, práctica guiada y lenguaje operativo para que el equipo no solo conozca conceptos, sino que los pueda usar en contexto."
      ),
      heading("Qué cubrimos"),
      bullet("Containers, imágenes, registries y ciclos de despliegue."),
      bullet("Fundamentos de Kubernetes y operación básica de workloads."),
      bullet("Conversaciones de observabilidad, incidentes y responsabilidades compartidas.")
    ]
  },
  {
    _id: "fallback-bootcamp-devops",
    _type: "bootcamp",
    title: "DevOps práctico para alinear delivery, calidad y colaboración",
    slug: "devops-practico",
    summary:
      "Diseñado para equipos que necesitan traducir principios DevOps en prácticas concretas de trabajo diario.",
    audience: "Equipos de desarrollo, QA y liderazgo técnico",
    primaryCta: bootcampEnrollmentCta,
    body: [
      paragraph(
        "La meta es que desarrollo, QA y liderazgo compartan un mismo lenguaje sobre flujo, calidad y ownership operativo."
      ),
      heading("Formato recomendado"),
      bullet("Sesiones intensivas con ejemplos cercanos al contexto del equipo."),
      bullet("Ejercicios para revisar cuellos de botella, handoffs y criterios de release."),
      bullet("Plan de adopción posterior para que el aprendizaje no quede aislado.")
    ]
  },
  {
    _id: "fallback-bootcamp-platform",
    _type: "bootcamp",
    title: "Platform engineering para equipos internos que escalan servicios",
    slug: "platform-engineering-aplicado",
    summary:
      "Una experiencia formativa para construir criterio compartido sobre plataformas internas, enablement y experiencia de desarrollo.",
    audience: "Platform teams, DevOps y arquitectos",
    primaryCta: bootcampInfoCta,
    body: [
      paragraph(
        "Ideal para organizaciones que ya están creando capacidades internas y quieren fortalecer el rol de la plataforma como producto."
      ),
      heading("En qué profundizamos"),
      bullet("Principios de platform engineering y diseño de capacidades internas."),
      bullet("Experiencia de desarrollo, estándares y gobierno sin burocracia innecesaria."),
      bullet("Priorización de adopción para que la plataforma genere tracción real.")
    ]
  }
];

async function safeFetch<T>(query: string, params: Record<string, string> = {}) {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.warn(`Sanity fetch failed, using local fallback content. ${message}`);
    return null;
  }
}

function normalizeCta(
  cta: OfferingCta | undefined,
  fallback: { label: string; href: string }
) {
  if (!cta?.label || !cta.href) {
    return fallback;
  }

  return {
    label: cta.label,
    href: cta.href,
    variant: cta.variant ?? undefined
  };
}

function normalizeService(
  item: Partial<ServiceEntry>,
  fallback?: ServiceEntry
): ServiceEntry | null {
  const slug = item.slug?.trim() || fallback?.slug;
  const title = item.title?.trim() || fallback?.title;
  const summary = item.summary?.trim() || fallback?.summary;

  if (!slug || !title || !summary) {
    return null;
  }

  return {
    _id: item._id || fallback?._id || `service-${slug}`,
    _type: "service",
    title,
    slug,
    summary,
    primaryCta: normalizeCta(item.primaryCta, serviceCollectionCta),
    body: item.body?.length ? item.body : fallback?.body ?? []
  };
}

function normalizeBootcamp(
  item: Partial<BootcampEntry>,
  fallback?: BootcampEntry
): BootcampEntry | null {
  const slug = item.slug?.trim() || fallback?.slug;
  const title = item.title?.trim() || fallback?.title;
  const summary = item.summary?.trim() || fallback?.summary;

  if (!slug || !title || !summary) {
    return null;
  }

  return {
    _id: item._id || fallback?._id || `bootcamp-${slug}`,
    _type: "bootcamp",
    title,
    slug,
    summary,
    audience: item.audience?.trim() || fallback?.audience || null,
    primaryCta: normalizeCta(
      item.primaryCta,
      fallback?.primaryCta?.label === bootcampEnrollmentCta.label
        ? bootcampEnrollmentCta
        : bootcampInfoCta
    ),
    body: item.body?.length ? item.body : fallback?.body ?? []
  };
}

function mergeEntries<T extends { slug: string }>(
  fallbackItems: T[],
  incomingItems: T[]
) {
  const merged = new Map<string, T>();

  for (const item of fallbackItems) {
    merged.set(item.slug, item);
  }

  for (const item of incomingItems) {
    merged.set(item.slug, item);
  }

  return [...merged.values()];
}

export async function getServices() {
  const fetched = (await safeFetch<ServiceEntry[]>(servicesQuery)) ?? [];
  const normalizedFetched = fetched
    .map((item) =>
      normalizeService(item, fallbackServices.find((fallback) => fallback.slug === item.slug))
    )
    .filter((item): item is ServiceEntry => item !== null);

  return mergeEntries(fallbackServices, normalizedFetched);
}

export async function getServiceBySlug(slug: string) {
  const fallback = fallbackServices.find((item) => item.slug === slug);
  const fetched = await safeFetch<ServiceEntry>(serviceBySlugQuery, { slug });

  if (!fetched && !fallback) {
    return null;
  }

  return normalizeService(fetched ?? {}, fallback ?? undefined);
}

export async function getBootcamps() {
  const fetched = (await safeFetch<BootcampEntry[]>(bootcampsQuery)) ?? [];
  const normalizedFetched = fetched
    .map((item) =>
      normalizeBootcamp(item, fallbackBootcamps.find((fallback) => fallback.slug === item.slug))
    )
    .filter((item): item is BootcampEntry => item !== null);

  return mergeEntries(fallbackBootcamps, normalizedFetched);
}

export async function getBootcampBySlug(slug: string) {
  const fallback = fallbackBootcamps.find((item) => item.slug === slug);
  const fetched = await safeFetch<BootcampEntry>(bootcampBySlugQuery, { slug });

  if (!fetched && !fallback) {
    return null;
  }

  return normalizeBootcamp(fetched ?? {}, fallback ?? undefined);
}
