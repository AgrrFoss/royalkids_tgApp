import styles from './styles.module.scss'
import { ColorButtonBlock, TextInFrameBlock } from '@/payload-types'
import SuperButtonLink from '@/shared/Link/component'
interface IColorButtonProps {
  block: ColorButtonBlock
}
export default async function ColorButtonComponent({block}: IColorButtonProps) {
  console.log(block)
  return (
    block.link && <SuperButtonLink link={block.link}>
      <div  className={styles.colorLink} style={{
        background: block.backgroundColor || undefined,
        color: block.textColor || undefined,
      }}>{block.link.label}</div>
    </SuperButtonLink>
  )
}
