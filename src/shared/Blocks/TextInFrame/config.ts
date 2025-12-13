import { Block } from 'payload'
import { textField } from '@cms/fields/textField'

export const TextInFrameBLock: Block = {
  slug: 'textInFrameBlock',
  interfaceName: 'TextInFrameBlock',
  labels: {
    singular: 'Текст в рамке',
    plural: 'Текст в рамке'
  },
  fields: [
    textField('text', 'текст', true, 'Введенные текст отобразится в рамке', true)
  ]
}