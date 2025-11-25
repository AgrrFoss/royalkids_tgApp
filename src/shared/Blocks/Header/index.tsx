import styles from './styles.module.scss';
import Image from 'next/image'
import bg from '@images/bg.jpg'
import Link from 'next/link'

export default async function Header() {
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        <Image
          src={bg}
          alt={''}
          className={styles.bg}
        />
        <div className={styles.content}>
          <h1 className={styles.title}>RoyalKids</h1>
          <span className={styles.description}>Федеральная сеть танцевальных студий для детей от 4 до 16 лет</span>
          <Link className={styles.more} href={'/'}> Узнать больше</Link>
        </div>

      </div>

    </section>
  )
}
