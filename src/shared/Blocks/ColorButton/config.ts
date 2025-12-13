import { Block } from 'payload'
import { textField } from '@cms/fields/textField'
import superLink from '@/shared/Link/config'

export const ColorButtonBLock: Block = {
  slug: 'colorButtonBlock',
  interfaceName: 'ColorButtonBlock',
  labels: {
    singular: 'Цветная кнопка',
    plural: 'Цветная кнопка'
  },
  fields: [
    superLink('Ссылка', ['pages', 'articles']),
    {
      type: 'row',
      fields: [
        textField('backgroundColor', 'Цвет фона в формате HEX'),
        textField('textColor', 'Цвет текста в формате HEX'),
      ]
    }
  ]
}