'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import styles from './styles.module.scss'
import cn from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { sendMessage } from '@/utilities/sendMessage'

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





import dynamic from 'next/dynamic';
const TgScript = dynamic(
  () => import('@front/widgets/tgClient/tgScript'), // Создаем отдельный компонент для скрипта
  { ssr: false } // Отключаем SSR для этого компонента
)
import { validateTgSignature } from '@front/widgets/tgClient/verify-telegram-data'
interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  // Добавьте другие поля, если они вам нужны
}
interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramWebAppUser;
  };
  initData: string; // Строка с закодированными данными и подписью
  // Другие методы Telegram Web App API
}
declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}
interface UserData {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  isDataValid: boolean;
  // Другие поля
}











export default function Form () {


  const [username, setUsername] = useState('')
  const [userData, setUserData] = useState<UserData>({ isDataValid: true });
  const [tgStatus, setTgStatus] = useState<string>('Телеграм не подключен');

  useEffect( () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setTgStatus('Подключен ТГ')
      const initDataUnsafe = tg.initDataUnsafe || {};
      const user = initDataUnsafe.user;
      if (user) {
        setTgStatus('есть юзер')
        const data = {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          photoUrl: user.photo_url,
          isDataValid: false, // Изначально считаем, что данные невалидны
        };
        setUserData({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          photoUrl: user.photo_url,
          isDataValid: false, // Изначально считаем, что данные невалидны
        });
        setUsername(user.username || '')
        const checkSignature = async (initData: string) => {
          try {
            const isValid = await validateTgSignature(initData);
            setUserData({...userData, isDataValid: isValid.isValid })
          } catch(err) {
            throw new Error('Ошибка проверки подписи')
          }
        }
        checkSignature(tg.initData)
        if (userData.isDataValid) {
          setUserData({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            photoUrl: user.photo_url,
            isDataValid: true,
          });
          setUsername(user.username || '')
        } else {
          console.error('Telegram data is not valid!');
          // Обработка случая, когда данные не прошли проверку
          setUserData(prevState => ({...prevState, isDataValid: false}))
        }
      } else {
        console.log('User data not available.');
      }
    }
  }, [tgStatus, userData]);
















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

    await sendMessage(data, utmParams, 'trial', username)
    reset()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <TgScript/>
      <h3>{tgStatus}</h3>
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