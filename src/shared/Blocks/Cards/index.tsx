import styles from './styles.module.scss';
import Image, { StaticImageData } from 'next/image'
import bg from '@images/bg.jpg'
import { CardsBlock, Media } from '@/payload-types'
import SuperButtonLink from '@/shared/Link/component'
import cn from 'classnames'


interface ICardsBlockProps {
  block: CardsBlock
}



export default async function CardsBlockComponent({ block }: ICardsBlockProps) {

  const cards = block.cards
  return (
    <section>
      <div className={styles.container}>
        {block.title && <h2 className={styles.title}>{block.title}</h2>}
        {cards && cards.length > 0 && (
          <ul className={styles.cardsList}>
            {cards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}


type CardsPropertyType = CardsBlock['cards'];
type NonNullableCards = NonNullable<CardsPropertyType>;
export type CardItem = NonNullableCards[number];
interface CardProps {
  card: CardItem;
}
function Card({ card }: CardProps) {
  const image  = card.image as Media
  // console.log(card)
  return (
    <li className={styles.card}>
      {card.link &&
        <SuperButtonLink link={card.link} className={styles.link}>
          {image.url && <Image src={image.url} alt={''} fill={true} className={styles.bg} />}
          <div className={cn(styles.content, card.title && styles.content_title)}>
            {card.title && <h2 className={styles.title}>{card.title}</h2>}

            {(card.smallText || card.bigText) &&
              <div className={styles.text}>
                {card.smallText && <span className={styles.smallText}>{card.smallText}</span>}
                {card.bigText && <span className={styles.bigText}>{card.bigText}</span>}
              </div>
            }
            {card.caption && <span className={styles.caption}>{card.caption}</span>}
          </div>
        </SuperButtonLink>}

    </li>
  )
}