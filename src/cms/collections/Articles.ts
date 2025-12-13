import type { CollectionConfig } from 'payload'
import { isAdmin } from '@cms/access/isAdmin'
import { revalidateDelete, revalidateArticle } from '@cms/hooks/revalidateArticle'
import { textField } from '@cms/fields/textField'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature, HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ImageBlock } from '@blocks/ImageBlock/config'
import { SliderBlock } from '@blocks/Slider/config'
import { TextInFrameBLock } from '@blocks/TextInFrame/config'
import { ColorButtonBLock } from '@blocks/ColorButton/config'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateArticle],
    afterDelete: [revalidateDelete],
  },
  fields: [
    textField('title', 'Название', true, 'Используется для формирования слага и внутри админки'),
    {
      name: 'content',
      label: 'Контент',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => {
          return [
            ...defaultFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [ ImageBlock, SliderBlock, TextInFrameBLock, ColorButtonBLock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
    }

  ]
}