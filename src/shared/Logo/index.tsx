'use client'
import Logo from '@public/logo.svg'
import styles from './styles.module.scss'
import cn from 'classnames'
import { useTg } from '@front/widgets/TgContext'

interface ILogoProps {
  isDarkProp?: boolean
  className?: string
}

export default function LogoComponent({ isDarkProp, className }: ILogoProps) {
  const { tg } = useTg()
  const isDark = isDarkProp || (tg?.colorScheme === 'dark')
  return (
    <Logo className={cn(isDark ? styles.logo_white : styles.logo, className)} width={200} height={100}/>
  )
};