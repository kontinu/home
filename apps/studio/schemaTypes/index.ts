import { bootcampType } from "./documents/bootcamp";
import { faqType } from "./documents/faq";
import { postType } from "./documents/post";
import { serviceType } from "./documents/service";
import { siteSettingsType } from "./documents/siteSettings";
import { ctaType } from "./objects/cta";
import { richTextType } from "./objects/richText";

export const schemaTypes = [
  ctaType,
  richTextType,
  serviceType,
  bootcampType,
  postType,
  faqType,
  siteSettingsType
];
