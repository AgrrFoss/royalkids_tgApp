import styles from './link.module.scss'
import Link from 'next/link'
import cn from 'classnames'
import { Media, Page } from '@/payload-types'
import process from 'node:process'
import { getClientSideURL } from '@/utilities/getURL'
import { ReactNode } from 'react'

interface IButtonLinkProps {
  link: {
    type?: ('reference' | 'custom') | null;
    newTab?: boolean | null;
    reference?:
      | ({
      relationTo: 'pages';
      value: number | Page;
    } | null)
      | ({
      relationTo: 'media';
      value: number | Media;
    } | null);
    anchor?: string | null;
    url?: string | null;
    label?: string | null;
  }
  children?: ReactNode;
  className?: string,
}

const SuperButtonLink = ({ link, children, className }: IButtonLinkProps) => {

  let href = '/'
  if (link && link?.type === 'custom' && link.url) {
    href = link?.url
  } else {
    switch (link.reference?.relationTo) {
      case 'pages':
        const referPage = link.reference?.value as Page;
        if (referPage.slug === 'home') {
          href = link?.anchor ? `/#${link.anchor}` : `/`
        } else {
          href = link?.anchor ? `/${referPage.slug}#${link.anchor}` : `/${referPage.slug}`
        }
        break
      case 'media':
        const referDoc = link.reference?.value as Media;
        href =  `${getClientSideURL()}/${referDoc.url}`
        break
      default:
        href = '/'
    }

  }
  return (
    <Link href={href}
          target={link.newTab ? '_blank' : '_self'}
          className={cn(className || styles.buttonLink)}
    >
      {children || link.label || 'Подробнее'}
    </Link>
  )
}
export default SuperButtonLink