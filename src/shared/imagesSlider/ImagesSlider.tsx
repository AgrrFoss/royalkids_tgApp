'use client'
import React, { ReactNode, useRef, useState } from 'react'
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules'
import Arrow from '@icons/arrowRight.svg'
import styles from './imagesSlider.module.scss'
import cn from 'classnames'

import 'swiper/css';
import 'swiper/css/autoplay'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'


interface ISwiperProps {
  children: React.ReactNode;
  className?: string;
  thumbsActive?: boolean;
}

const ImagesSlider = ({ children, className, thumbsActive }: Readonly<ISwiperProps>) => {
  const swiperRef = useRef<null | SwiperRef>(null)
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        // autoplay={{
        //   delay: 200,
        //   disableOnInteraction: false,
        // }}

        modules={[Autoplay, Navigation, Pagination, Thumbs]}
        // speed={50000}
        thumbs = {thumbsActive ? {swiper: thumbsSwiper} : undefined}
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
            bulletActiveClass: styles.bullet_active,
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
      {
        thumbsActive && <Swiper
          modules={[Thumbs]}
          centeredSlides={true}
          spaceBetween={10}
          slidesPerView={6}
          watchSlidesProgress={true}
          onSwiper={setThumbsSwiper}
          className={styles.thumbnailSlider}
        >
          {React.Children.map(children, child => (
            <SwiperSlide tag={'li'} className={styles.thumbnailItem}>{child}</SwiperSlide>
          ))}
        </Swiper>
      }
    </>
  )
}

export default ImagesSlider