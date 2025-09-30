import type { CollectionSlug, Field } from 'payload'

type LinkType = (
  label?: string,
  relation?: CollectionSlug[],
  relationName?: string,
  fieldName?: string,
) => Field;

const superLink: LinkType = (label = 'Ссылка', relation = ['pages'], relationName = 'Связанный документ', fieldName = 'link') => {
  const resultLink : Field = {
    name: fieldName,
    label: label,
    type: 'group',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name:'type',
            type: 'radio',
            options: [
              {
                label: relationName,
                value: 'reference'
              },
              {
                label: 'Кастомная ссылка',
                value: 'custom',
              }
            ],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
          },
          {
            name: 'newTab',
            label: 'Открыть в новом окне',
            type: 'checkbox',
            admin: {
              width: '50%',
              style: {
                alignSelf:'flex-end'
              }
            }
          }
        ]
      },
      {
        type: 'row',
        fields: [
          {
            name: 'reference',
            label: relationName,
            type: 'relationship',
            relationTo: relation,
            required: true,
            maxDepth: 1,
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'reference',
            }
          },
          {
            name: 'anchor',
            label: 'Якорь',
            type: 'text',
            admin: {
              width: '30%',
              description: 'Укажите если нужен переход на конкретный раздел страницы',
              condition: (_, siblingData) => siblingData?.type === 'reference',
            }
          },
          {
            name: 'url',
            label: 'Укажите ссылку',
            type: 'text',
            required: true,
            admin: {
              width: '35%',
              condition: (_, siblingData) => siblingData?.type === 'custom',
            },
          },
          {
            name: 'label',
            label: 'Текст сслыки / кнопки',
            type: 'text',
            admin: {
              width: '35%',
              description: 'Если оставить пустым подставится текст по умолчанию из макета',

            }
          }
        ]
      },
    ]
  }
  return resultLink
}
export default superLink;
