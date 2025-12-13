import { Block } from 'payload'
import superLink from '@/shared/Link/config'

export const CallToActionBlock: Block = {
  slug: 'callToActionBlock',
  interfaceName: 'CallToActionBlock',
  labels: {
    singular: 'Призыв к действию',
    plural: 'Призыв к действию'
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Фоновое изображение',
      type: 'upload',
      relationTo: 'media'
    },
    superLink('Кнопка', ['pages', 'articles']),
  ]
}