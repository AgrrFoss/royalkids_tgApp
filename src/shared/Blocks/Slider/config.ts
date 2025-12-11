import { Block } from 'payload'

export const SliderBlock: Block = {
  slug: 'sliderBlock',
  interfaceName: 'SliderBlock',
  labels: {
    singular: 'Слайдер',
    plural: 'Слайдеры'
  },
  fields: [
    {
      name: 'title',
      label: 'Заголовок',
      type: 'text',
    },
    {
      name: 'slides',
      label: 'Слайды',
      type: 'array',
      labels: {
        singular: 'Слайд',
        plural: 'Слайды',
      },
      fields: [
        {
          name: 'image',
          label: 'Изображение слайда',
          type: 'upload',
          relationTo: 'media',
          required: true
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
      ],
    },
    {
      name: 'slidesPreview',
      label: 'Показывать все слайды внизу',
      type: 'checkbox'
    }
  ]
}