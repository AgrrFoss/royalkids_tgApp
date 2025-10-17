'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import styles from './styles.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { sendMessage } from '@/utilities/sendMessage'
import { useUser } from '@front/widgets/UserContext/'

export interface IFormInput {
  name: string,
  age: number,
  phone: string,
}
export interface IUtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
}
const settingPhoneInput = {
  required: true,
  pattern: {
    value: /^(?:\+7|8)?(?:\d{10})$/,
    message: 'Проверьте корректность номера телефона',
  }
}

export default function Form () {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [utmParams, setUtmParams] = useState<IUtmParams>(
    {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
    }
  )
  useEffect(() => {
    const utm_source = searchParams.get('utm_source') || '';
    const utm_medium = searchParams.get('utm_medium') || '';
    const utm_campaign = searchParams.get('utm_campaign') || '';
    const utm_term = searchParams.get('utm_term') || '';
    const utm_content = searchParams.get('utm_content') || '';

    setUtmParams({
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    });
  }, [searchParams]);



  const { register, handleSubmit, formState: {errors}, reset} = useForm<IFormInput>({
    mode: 'onChange',
  })
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {

    await sendMessage(data, utmParams, 'trial', user?.username)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <h3>Hello, {user?.username }</h3>
      <div className={styles.wrapper}>
        <input
          {...register('name')}
          type={'text'}
          className={cn(styles.input)}
          placeholder={'Ваше имя'}
        />
        <input
          {...register('age')}
          type={'text'}
          className={cn(styles.input)}
          placeholder={'Возраст ребенка'}
        />
        <input
          {...register('phone', settingPhoneInput)}
          type="text"
          className={cn(styles.input, errors.phone && styles.input_error)}
          placeholder={'Ваш телефон *'}
        />
        <button type={'submit'} className={cn(styles.button)}>
          Оставить заявку
        </button>
      </div>
      <p className={styles.note}>
        Нажимая кнопку “Отправить заявку”, вы соглашаетесь на{' '}
        <Link className={cn(styles.link)} href={''}>
          обработку персональных данных
        </Link>{' '}
        в соответствии с{' '}
        <Link className={cn(styles.link)} href={''}>
          политикой конфиденциальности
        </Link>
      </p>
    </form>
  )
}