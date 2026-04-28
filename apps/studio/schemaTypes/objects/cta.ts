import { defineField, defineType } from "sanity";

export const ctaType = defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Accepts relative paths, absolute URLs, mailto, or tel links.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Ghost", value: "ghost" }
        ],
        layout: "radio"
      }
    })
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "href"
    }
  }
});
