export const SITE_SETTINGS_DOCUMENT_ID = "siteSettings";

export const ctaProjection = `
  primaryCta {
    label,
    href,
    variant
  }
`;

export const serviceCardProjection = `
  _id,
  _type,
  title,
  "slug": slug.current,
  summary,
  ${ctaProjection}
`;

export const servicesQuery = `
  *[_type == "service"] | order(title asc) {
    ${serviceCardProjection}
  }
`;

export const serviceBySlugQuery = `
  *[_type == "service" && slug.current == $slug][0] {
    ${serviceCardProjection},
    body
  }
`;

export const bootcampCardProjection = `
  _id,
  _type,
  title,
  "slug": slug.current,
  summary,
  audience,
  ${ctaProjection}
`;

export const bootcampsQuery = `
  *[_type == "bootcamp"] | order(title asc) {
    ${bootcampCardProjection}
  }
`;

export const bootcampBySlugQuery = `
  *[_type == "bootcamp" && slug.current == $slug][0] {
    ${bootcampCardProjection},
    audience,
    body
  }
`;

export const postCardProjection = `
  _id,
  _type,
  title,
  "slug": slug.current,
  summary,
  publishedAt
`;

export const postsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    ${postCardProjection}
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    ${postCardProjection},
    body
  }
`;

export const faqQuery = `
  *[_type == "faq"] | order(orderRank asc, question asc) {
    _id,
    question,
    answer
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings" && _id == "${SITE_SETTINGS_DOCUMENT_ID}"][0] {
    title,
    description,
    ${ctaProjection}
  }
`;
