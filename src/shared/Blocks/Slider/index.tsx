import styles from './styles.module.scss';
import Image, { StaticImageData } from 'next/image'
import bg from '@images/bg.jpg'
import { SliderBlock } from '@/payload-types'
import SuperButtonLink from '@/shared/Link/component'
import cn from 'classnames'


interface ISliderBlockProps {
  block: SliderBlock
}



export default async function SliderBlockComponent({ block }: ISliderBlockProps) {
  console.log(block)
  const slides = block.slides
  console.log(slides)
  return (
    <section>
      <div className={styles.container}>
        {block.title && (<h2>{block.title}</h2>)}
        <div className={styles.sliderWrapper}>

        </div>
      </div>
    </section>
)
}