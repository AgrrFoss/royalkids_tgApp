import styles from './styles.module.scss'
import { SubmitHandler, useForm } from 'react-hook-form'
import TextInput from '@/shared/formFields/TextInput'
import cn from 'classnames'

export interface IAuthFormInput {
  email: string,
  password: string,
}

export default function AuthForm({ onSubmit }: { onSubmit:  SubmitHandler<IAuthFormInput> }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IAuthFormInput>({
    mode: 'onChange',
  })

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <TextInput fieldName={'email'} register={register} errors={errors} placeholder={'Email'} />
      <TextInput
        fieldName={'password'}
        register={register}
        errors={errors}
        placeholder={'Пароль'}
      />
      <button type={'submit'} className={cn(styles.button)}>
        Войти
      </button>
    </form>
  )
};