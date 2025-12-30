'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import styles from './styles.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sendMessage } from '@/utilities/sendMessage'
import { useUser } from '@front/widgets/UserContext/'
import { parseStartParams } from '@front/widgets/tgClient'
import { useTg } from '@front/widgets/TgContext'
import { Popup } from '@/shared/Popup'
import { sendFormData } from '@/api/bot-api'

interface IFormProps {
  purpose: 'event' | 'trial' | 'newYear'
  formName?: string
  children?: React.ReactNode
  isDarkProps?: boolean
  className?: string
}

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
    value: /^(?:\+7|8)\d{10}$/,
    message: 'Проверьте корректность номера телефона',
  }
}

export default function Form ({purpose, formName, children, isDarkProps, className }: IFormProps) {
  const { tg } = useTg()
  const router = useRouter();
  const isDark = isDarkProps || (tg?.colorScheme === 'dark')
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [isSubmit, setSubmit] = useState<boolean>(false)
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
    let paramsInUser
    if (user?.startParam) {
      paramsInUser = parseStartParams(user.startParam)
    }

    const utm_source = searchParams.get('utm_source') || paramsInUser?.usr || '';
    const utm_medium = searchParams.get('utm_medium') || paramsInUser?.umd || '';
    const utm_campaign = searchParams.get('utm_campaign') || paramsInUser?.ucm || '';
    const utm_term = searchParams.get('utm_term') || paramsInUser?.utr || '';
    const utm_content = searchParams.get('utm_content') || paramsInUser?.ucn || '';

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
    try{
      await sendFormData('/applications', data, user, utmParams, (formName || purpose))
      await sendMessage(data, utmParams, purpose, user?.username)
      setSubmit(true)
      reset()
      setTimeout(() => {
        router.push('/');
      }, 5000);
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }

  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.form, className)}>
      <div className={styles.inputWrapper}>
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
        <label className={styles.label}>
          <input
            {...register('phone', settingPhoneInput)}
            type="text"
            className={cn(styles.input, errors.phone && styles.input_error)}
            placeholder={'Ваш телефон *'}
          />
          <div className={styles.errorMessageContainer}>
            {errors.phone && <span className={cn(styles.errorMessage_empty, errors.phone.message && styles.errorMessage )}>{errors.phone.message}</span>}
          </div>
        </label>
        <button type={'submit'} className={cn(styles.button)}>
          Оставить заявку
        </button>
        {isSubmit && <Popup>
          Заявка отправлена, менеджер перезвонит вам для подтверждения записи. Скоро вы будете перенаправлены на главную
        </Popup>}
      </div>
      {children}
      <p className={cn(styles.note, isDark && styles.note_darkTheme)}>
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