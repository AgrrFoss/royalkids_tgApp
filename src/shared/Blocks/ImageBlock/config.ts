import { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlock',
  labels:{
    singular: 'Изображение',
    plural: 'Изображения',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'visibleMode',
      label: 'режим отображения',
      type: 'select',
      options: [
        {label: 'Растягивать', value: 'fill'},
        {label: 'Обрезать', value: 'cover'},
        {label: 'Сохранять пропорции', value: 'contain'}
      ]
    },
    {
      name: 'text',
      label: 'Текст рядом с изображением',
      type: 'richText',
    },
    {
      name: 'reverse',
      label: 'Отобразить зеркально',
      type: 'checkbox'
    }
  ]
}