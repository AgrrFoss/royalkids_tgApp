import type { CollectionConfig } from 'payload'
import { isAdmin } from '@cms/access/isAdmin'
import { revalidateDelete, revalidatePage } from '@cms/hooks/revalidatePage'
import { textField } from '@cms/fields/textField'
import superLink from '@/shared/Link/config'

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
      name: 'image',
      type: 'upload',
      label: 'Изображение тест',
      relationTo: 'media'
    },
    {
      name: 'image2',
      type: 'upload',
      label: 'Изображение тест 2',
      relationTo: 'media'
    },
  ],
}
