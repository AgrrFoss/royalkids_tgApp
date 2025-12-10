'use client'
import React, {ReactNode, useRef} from 'react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Arrow from '@icons/arrowRight.svg'
import styles from './imagesSlider.module.scss'
import cn from 'classnames'

import 'swiper/css';
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const ImagesSlider = ({ children, isSummer, className }: Readonly<{ children: React.ReactNode; isSummer?: boolean; className?: string }>) => {
  const swiperRef = useRef<null | SwiperRef>(null)
  return (
    <Swiper
      ref={swiperRef}
      slidesPerView={1}
      // autoplay={{
      //   delay: 200,
      //   disableOnInteraction: false,
      // }}

      modules={[Autoplay, Navigation, Pagination]}
      // speed={50000}
      loop={true}
      navigation={{
        prevEl: '#navPrev',
        nextEl: '#navNext',
      }}
      pagination={
        {
          type: 'bullets',
          // dynamicBullets: true,
          bulletClass: `${styles.bullet}`,
          bulletActiveClass: isSummer ? `${styles.bullet_active_green}` : `${styles.bullet_active}`,
          el: '#paginationEl',
          clickable: true,
        }
      }
      className={cn(styles.slider, className)}
      wrapperTag={'ul'}
      wrapperClass={styles.slidesWrapper}
    >
      {React.Children.map(children, child => (
        <SwiperSlide tag={'li'} className={styles.item}>{child}</SwiperSlide>
      ))}
      <div className={styles.navigation}>
        <div className={styles.nav} id={'navNext'}>
          <Arrow />
        </div>
        <div className={cn(styles.nav, styles.navPrev)} id={'navPrev'}>
          <Arrow />
        </div>
      </div>
      <div className={styles.pagination} id={'paginationEl'}></div>
    </Swiper>
  )
}

export default ImagesSlider