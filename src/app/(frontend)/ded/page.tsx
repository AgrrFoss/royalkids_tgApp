import Form from '@front/widgets/Form'
import { Suspense } from 'react'
import styles from './styles.module.scss'
import LogoComponent from '@/shared/Logo'
import FeerieLogo from '@public/images/feerie.png'
import Price from '@public/images/price.jpg'
import Image from 'next/image'
import ImagesSlider from '@/shared/imagesSlider/ImagesSlider'

import dedmoroz from '@public/images/dedmoroz.jpg'
import teya from '@public/images/teya.jpg'
import teya2 from '@public/images/teya2.jpg'
import jul from '@public/images/Iul.jpg'


const slides = [
  {
    image: dedmoroz,
    alt: 'дед мороз в студии'
  },
  {
    image: teya,
    alt: 'дед мороз в студии'
  },
  {
    image: teya2,
    alt: 'дед мороз в студии'
  },
  {
    image: jul,
    alt: 'дед мороз в студии'
  },
]

interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default function DedFormPage ({params: paramsPromise}: IPageProps) {
  return (
    <div className={styles.bg}>
      <h1 className={styles.title}>
        Закажите Деда Мороза и Снегурочку
        <span className={styles.partyName}>на дом</span>
      </h1>
      <Image
        src={FeerieLogo}
        alt={'Логотип Феерия'}
        width="200"
        height="100"
        className={styles.logo}
      />
      <Suspense fallback="loading">
        <Form purpose={'newYear'} isDarkProps={true} className={styles.form}>
          <div className={styles.description}>
            <h2 className={styles.subtitle}>В программе:</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>Музыкальное сопровождение</li>
              <li className={styles.listItem}>Увлекательные новогодние игры</li>
              <li className={styles.listItem}>Волшебный светящийся посох</li>
              <li className={styles.listItem}>Настоящее новогоднее чудо!</li>
            </ul>
          </div>
          <h2>Цены</h2>
          <Image src={Price} alt={'Цены на поздравления деда мороза'} className={styles.price} />

          <h2>Наши костюмы</h2>
          <ImagesSlider>
            {slides.map((item, i) => (
              <Image key={i} src={item.image} alt={item.alt} className={styles.slideImage} />
            ))}
          </ImagesSlider>
        </Form>
      </Suspense>
    </div>
  )
}