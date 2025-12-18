import cn from 'classnames'
import styles from './styles.module.scss'
import { FieldErrors, RegisterOptions, UseFormRegisterReturn } from 'react-hook-form'

interface ITextInputProps {
  fieldName: string
  errors: FieldErrors
  placeholder?: string
  // register:(name: string, options?: RegisterOptions) => UseFormRegisterReturn
  register: any
  setting?: RegisterOptions | undefined
  className?: string
}

export default function TextInput({fieldName, errors, placeholder, register, setting, className}: ITextInputProps) {
  return (
    <input
      {...register(fieldName, setting)}
      placeholder={placeholder}
      className={cn(styles.input, className)}
      type="text"
    />
  )
}