import { Block } from 'payload'
import superLink from '@/shared/Link/config'
import { textField } from '@cms/fields/textField'

export const CardsBlock: Block = {
  slug: 'cardsBlock',
  interfaceName: 'CardsBlock',
  labels: {
    singular: 'Блок Карточек',
    plural: 'Блок Карточек'
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
    },
    {
      name: 'cards',
      label: 'Карточки',
      type: 'array',
      labels: {
        singular: 'Карточка',
        plural: 'Карточки',
      },
      fields: [
        textField('title', 'Заголовок'),
        {
          type: 'row',
          fields: [
            textField('smallText', 'Маленький текст'),
            textField('bigText', 'Крупный текст'),
          ]
        },
        textField('caption', 'Подпись под карточкой'),
        {
          name: 'image',
          label: 'Фоновое изображение',
          type: 'upload',
          relationTo: 'media'
        },
        superLink('Ссылка', ['articles'])
      ],
    }
  ]
}