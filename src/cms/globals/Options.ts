import type { GlobalConfig } from 'payload';
import { isAdmin } from '@/cms/access/isAdmin'
import GlobalRevalidate from '@cms/hooks/revalidateGlobal'
import { textField } from '@cms/fields/textField'
import superLink from '@/shared/Link/config'

const Options: GlobalConfig = {
  slug: 'options',
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [GlobalRevalidate],
  },
  fields: []
}

export default Options;