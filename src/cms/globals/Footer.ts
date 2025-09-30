import type { GlobalConfig } from "payload";
import GlobalRevalidate from '@cms/hooks/revalidateGlobal'
import superLink from '@/shared/Link/config'
import { textField } from '@cms/fields/textField'

const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [GlobalRevalidate]
  },
  fields: [],
};
export default Footer;
