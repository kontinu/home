export type NavItem = {
  href: string;
  label: string;
};

export type HeroMetric = {
  value: string;
  label: string;
};

export const siteShell = {
  siteName: "kontinu",
  tagLine: "Cloud consulting y formación aplicada para equipos que necesitan avanzar sin improvisar.",
  nav: [
    { href: "/servicios", label: "Servicios" },
    { href: "/bootcamps", label: "Bootcamps" },
    { href: "/#como-trabajamos", label: "Cómo trabajamos" }
  ] satisfies NavItem[],
  footerLinks: [
    { href: "/servicios", label: "Servicios" },
    { href: "/bootcamps", label: "Bootcamps" },
    { href: "mailto:hola@kontinu.io", label: "hola@kontinu.io" }
  ] satisfies NavItem[]
} as const;
