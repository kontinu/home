import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "richText",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number"
    })
  ],
  preview: {
    select: {
      title: "question"
    }
  }
});
