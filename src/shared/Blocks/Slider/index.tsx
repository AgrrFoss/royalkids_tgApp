import styles from './styles.module.scss';
import Image, { StaticImageData } from 'next/image'
import bg from '@images/bg.jpg'
import { Media, SliderBlock } from '@/payload-types'
import SuperButtonLink from '@/shared/Link/component'
import cn from 'classnames'
import ImagesSlider from '@/shared/imagesSlider/ImagesSlider'


interface ISliderBlockProps {
  block: SliderBlock
}



export default async function SliderBlockComponent({ block }: ISliderBlockProps) {
  const slides = block.slides
  return (
    <section>
      <div className={styles.container}>
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
                      style={{objectFit: slide.visibleMode || 'contain'}}
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