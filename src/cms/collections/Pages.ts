import type { CollectionConfig } from 'payload'
import { isAdmin } from '@cms/access/isAdmin'
import { revalidateDelete, revalidatePage } from '@cms/hooks/revalidatePage'
import { textField } from '@cms/fields/textField'
import superLink from '@/shared/Link/config'
import { CardsBlock } from '@/shared/Blocks/Cards/config'
import { CallToActionBlock } from '@/shared/Blocks/CallToAction/config'

export const Pages: CollectionConfig = {
  slug: 'pages',
  // admin: {
  //   useAsTitle: 'city',
  // },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },

  fields: [
    textField('title', 'Название страницы', false),
    {
      name: 'blocks',
      label: 'Блоки',
      type: 'blocks',
      blocks: [CardsBlock, CallToActionBlock]
    }
  ],
}
