import { Block } from 'payload'
import { textField } from '@cms/fields/textField'
import superLink from '@/shared/Link/config'

export const HeaderBlock: Block = {
  slug: 'headerBlock',
  interfaceName: 'HeaderBlock',
  labels: {
    singular: 'Хедер',
    plural: 'Хедер'
  },
  fields: [
    {
      name: 'bg',
      label: 'Изображение фона',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    textField('title', 'Заголовок', false, 'Используется в h1'),
    textField('description', 'Подзаголовок', false),
    superLink()
  ]
}