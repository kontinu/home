import { defineField, defineType } from "sanity";

export const bootcampType = defineType({
  name: "bootcamp",
  title: "Bootcamp",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240)
    }),
    defineField({
      name: "audience",
      title: "Audience",
      type: "string"
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "richText"
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
      subtitle: "audience"
    }
  }
});
