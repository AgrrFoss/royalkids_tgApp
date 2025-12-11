import styles from './styles.module.scss'
import type { ImageBlock as ImageBlockType, Media } from '@/payload-types'
import Image from 'next/image'
import cn from 'classnames'
import RichText from '@/shared/RichText'
import { SerializedLexicalNode } from 'lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type ImageBlockProps = {
  className?: string
} & ImageBlockType

export const ImageBlock = async ({className, text, media, reverse, visibleMode}: ImageBlockProps) => {

  const image = media as Media
  const textContent = text as unknown as SerializedEditorState<SerializedLexicalNode> & string
  const existText = Boolean(text)
  return (
    <div className={cn(styles.wrapper, reverse && styles.reverse, className)}>
      {image.url && image.alt &&
        <Image
          className={cn(styles.image, existText && styles.image_withText)}
          width={image.width || 500}
          height={image.height || 500}
          src={image.url}
          alt={image.alt}
          style={{objectFit: visibleMode || 'fill'}}
        />
      }
      {
        text &&
        <RichText data={textContent} className={styles.text}/>
      }
    </div>
  )
}
