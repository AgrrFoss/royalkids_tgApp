import styles from './styles.module.scss';
import Image from 'next/image'
import bg from '@images/bg.jpg'
import Link from 'next/link'
import { HeaderBlock, Media } from '@/payload-types'
import SuperButtonLink from '@/shared/Link/component'

interface IHeaderProps {
  block: HeaderBlock
}

export default async function Header({ block } : IHeaderProps) {
  const bgImage = block.bg as Media
  return (
    <section className={styles.header}>
      <div className={styles.container}>
        <Image
          src={bgImage.url || bg}
          alt={''}
          width={bgImage.width || 400}
          height={bgImage.height || 400}
          className={styles.bg}
        />
        <div className={styles.content}>
          <h1 className={styles.title}>{block.title}</h1>
          <span className={styles.description}>{block.description}</span>
          {block.link && <SuperButtonLink link={block.link} className={styles.more}><span className={styles.moreText}>{block.link.label || 'Узнать больше'}</span></SuperButtonLink>}
          {/*<Link className={styles.more} href={'/'}> <span className={styles.moreText}>Узнать больше</span></Link>*/}
        </div>

      </div>

    </section>
  )
}
