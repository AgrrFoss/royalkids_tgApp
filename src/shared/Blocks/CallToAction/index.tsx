import styles from './styles.module.scss';
import Image from 'next/image'
import Link from 'next/link'
import bg from '@images/bg.jpg'
import SuperButtonLink from '@/shared/Link/component'
import { CallToActionBlock, Media } from '@/payload-types'

interface ICallToAction {
  block: CallToActionBlock
}

export default async function CallToAction({ block }: ICallToAction) {
  
  const bgImage = block.image as Media
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {bgImage.url && (
          <Image src={bgImage.url} alt={bgImage.alt || ''} fill={true} className={styles.bg} />
        )}
        <div className={styles.content}>
          <h2 className={styles.title}>{block.title}</h2>
          <span className={styles.description}>{block.description}</span>
          {block.link && <SuperButtonLink link={block.link} className={styles.button} />}
        </div>
      </div>
    </section>
  )
}
