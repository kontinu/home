import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta"
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description"
    }
  }
});
