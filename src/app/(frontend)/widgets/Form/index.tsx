'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import styles from './styles.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export interface IFormInput {
  name: string,
  age: number,
  phone: string,
}
const settingPhoneInput = {
  required: true,
  pattern: {
    value: /^(?:\+7|8)?(?:\d{10})$/,
    message: 'Проверьте корректность номера телефона',
  }
}

export default function Form () {
  const { register, handleSubmit, formState: {errors}, reset} = useForm<IFormInput>({
    mode: 'onChange',
  })
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data)
    reset()
  }
  return (
    <form>
      <div className={styles.wrapper}>
        <input
          {...register('name')}
          type={'text'}
          className={cn(styles.input, )}
          placeholder={'Ваше имя'}
        />
        <input
          {...register('age')}
          type={'text'}
          className={cn(styles.input, )}
          placeholder={'Возраст ребенка'}
        />
        <input
          {...register('phone', settingPhoneInput)}
          type="text"
          className={cn(styles.input, errors.phone && styles.input_error)}
          placeholder={'Ваш телефон *'}
        />
        <button type={'submit'} className={cn(styles.button,)}>
          Оставить заявку
        </button>
      </div>
      <p className={styles.note}>
        Нажимая кнопку “Отправить заявку”, вы соглашаетесь на{' '}
        <Link className={cn(styles.link,)} href={''}>
          обработку персональных данных
        </Link>{' '}
        в соответствии с{' '}
        <Link className={cn(styles.link,)} href={''}>
          политикой конфиденциальности
        </Link>
      </p>
    </form>
  )
}