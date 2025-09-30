import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'
import cn from 'classnames'


const jsxConverters: JSXConvertersFunction = ({defaultConverters})=>({
  ...defaultConverters,
  // blocks: {
  //   bgTextImageBlock: ({node}: {node: any}) => {
  //     return (
  //         <BgTextImage content = {node.fields} />
  //     )
  //   },
  // }
})

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <RichTextWithoutBlocks
      converters={jsxConverters}
      className={cn(
        {
          'container ': enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert ': enableProse,
        },
        'richText',
        className,
      )}
      {...rest}
    />
  )
}