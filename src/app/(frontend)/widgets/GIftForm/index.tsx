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
import PresentImage from '@public/images/present.webp'
import Image from 'next/image'
import { sendFormData } from '@/api/bot-api'

interface IFormProps {
  purpose: 'event' | 'trial' | 'lottery'
  formName?: string
  children?: React.ReactNode
  isDarkProps?: boolean
  className?: string
}

export interface IGiftFormInput {
  name: string,
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
interface IPrize {
  id: number
  name: string
  image: string
}
const prizes = [
  {
    id: 1,
    name: 'Бесплатная Доставка',
    description: 'Получите ваш заказ с бесплатной доставкой!',
    image: '/prizes/delivery.png',
  },
  {
    id: 2,
    name: 'Скидка 20%',
    description: 'Ваша скидка 20% на следующую покупку!',
    image: '/prizes/discount.png',
  },
  {
    id: 3,
    name: 'Подарок-сюрприз',
    description: 'Мы добавим случайный подарок к вашему заказу!',
    image: '/prizes/surprise.png',
  },
];

export default function GiftForm ({purpose, formName, children, isDarkProps, className }: IFormProps) {
  const { tg } = useTg()
  const router = useRouter();
  const isDark = isDarkProps || (tg?.colorScheme === 'dark')
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [isSubmit, setSubmit] = useState<boolean>(false)

  const [step, setStep] = useState<'name' | 'phone' | 'animation' | 'result'>('name')
  const [selectedPrize, setSelectedPrize] = useState<null | IPrize>(null);
  const [animationActive, setAnimationActive] = useState(false);
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

  const { register, handleSubmit, formState: {errors}, watch, reset} = useForm<IGiftFormInput>({
    mode: 'onChange',
  })
  const watchedName = watch('name');
  const handleNameSubmit = (data: IGiftFormInput) => {
    setStep('phone')
  }


  const onSubmit: SubmitHandler<IGiftFormInput> = async (data) => {
    setSubmit(true);
    setStep('animation');
    setAnimationActive(true);
    try{
      if(user) {
        await sendFormData('/applications', data, user, utmParams, (formName || purpose))
      }
      await sendMessage(data, utmParams, purpose, user?.username)
      setSubmit(true)
      reset()
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prize = prizes[randomIndex];
    setSelectedPrize(prize);
    setTimeout(() => {
      setStep('result');
    }, 3000)
  }
  return (
    <div className={styles.container}>
      {step === 'name' && (
        <form onSubmit={handleSubmit(handleNameSubmit)} className={styles.form}>
          <input
            type="text"
            placeholder="Ваше имя"
            {...register('name', { required: 'Имя обязательно для заполнения.' })}
            className={styles.input}
          />
          <div className={styles.errorMessageContainer}>
            {errors.name && (
              <span
                className={cn(
                  styles.errorMessage_empty,
                  errors.name.message && styles.errorMessage,
                )}
              >
                {errors.name.message}
              </span>
            )}
          </div>
          <button type="submit" className={styles.button}>
            Далее
          </button>
        </form>
      )}
      {step === 'phone' && (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label className={styles.label}>
            <input
              {...register('phone', settingPhoneInput)}
              type="text"
              className={cn(styles.input, errors.phone && styles.input_error)}
              placeholder={'Ваш телефон *'}
            />
            <div className={styles.errorMessageContainer}>
              {errors.phone && (
                <span
                  className={cn(
                    styles.errorMessage_empty,
                    errors.phone.message && styles.errorMessage,
                  )}
                >
                  {errors.phone.message}
                </span>
              )}
            </div>
          </label>
          <button type={'submit'} className={cn(styles.button)}>
            Получить подарок
          </button>
        </form>
      )}
      {(step === 'animation' || step === 'result') && (
        <div className={cn(styles.formWrapper)}>
          <h2 className={styles.resultTitle}>{step === 'animation' && 'Ваш подарок...'}{step === 'result' && 'Ваш подарок'}</h2>
          <div className={styles.presentWrapper}>
            <Image src={PresentImage} alt={'подарок'} fill={true} className={styles.present} />
            {step === 'result' && selectedPrize && (
              <div className={styles.prizeDisplay}>
                <h3 className={styles.prizeName}>№ {selectedPrize.id}</h3>
              </div>
            )}
          </div>
        </div>
      )}
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
    </div>
  )
}