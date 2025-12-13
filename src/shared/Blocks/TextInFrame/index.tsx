import styles from './styles.module.scss';
import { TextInFrameBlock } from '@/payload-types'
interface ITextInFrameProps {
  block: TextInFrameBlock
}

export default async function TextInFrameComponent({block}: ITextInFrameProps) {
  return (
    <p className={styles.paragraph}>{block.text}</p>
  )
}
