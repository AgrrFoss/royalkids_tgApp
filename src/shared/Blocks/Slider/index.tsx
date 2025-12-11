import styles from './styles.module.scss';
import Image, { StaticImageData } from 'next/image'
import { Media, SliderBlock } from '@/payload-types'
import ImagesSlider from '@/shared/imagesSlider/ImagesSlider'
import cn from 'classnames'


interface ISliderBlockProps {
  block: SliderBlock
  containerClass?: string
}



export default async function SliderBlockComponent({ block, containerClass }: ISliderBlockProps) {
  const slides = block.slides
  return (
    <section>
      <div className={cn(styles.container, containerClass)}>
        {block.title && (<h2>{block.title}</h2>)}
        <div className={styles.sliderWrapper}>
          {
            slides && slides.length > 0 && (
              <ImagesSlider thumbsActive={block.slidesPreview || false}>
                {slides.map((slide) => {
                  const image = slide.image as Media
                  return (
                    image.url &&
                    <Image
                      src = {image.url}
                      alt={image.alt}
                      width={image.width || 320}
                      height={image.height || 480}
                      style={{objectFit: slide.visibleMode || 'contain', aspectRatio: slide.aspectRatio || 1 }}
                    />
                  )
                })}
              </ImagesSlider>
            )
          }
        </div>
      </div>
    </section>
)
}