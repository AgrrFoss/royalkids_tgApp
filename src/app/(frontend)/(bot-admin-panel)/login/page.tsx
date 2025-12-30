'use client'
import { useCallback, useEffect, useState } from 'react'
import { getMe, localLogin, telegramLogin } from '@/api/bot-api'
import { useUser } from '@front/widgets/UserContext'
import { useTg } from '@front/widgets/TgContext'
import serverLog from '@/utilities/serverLog'
import AuthForm, { IAuthFormInput } from '@front/widgets/AuthForm'
import { useRouter } from 'next/navigation'

interface IAdmin {
  id: string,
  telegramId: number,
  email: string,
}

export default function Login () {
  const router = useRouter()

  const [me, setMe] = useState<null | IAdmin >()
  const { user } = useUser()
  const { tg, isTgReady} = useTg()

  const checkAuth = useCallback(async () => {
    const authUser = await getMe()
    setMe(authUser)
    if (authUser) {
      router.push('/dashboard')
    }
  }, [])

  const signInTelegram = useCallback(async (initData: string) => {
    const authUser = await telegramLogin( initData )
    await serverLog( authUser )
    setMe(authUser)
    if (authUser) {
      router.push('/dashboard')
    }
  }, [])

  const signInLocalAuth = useCallback(async (data: IAuthFormInput) => {
    const login = await localLogin( data )
    if (login) {
      const authUser = await getMe()
      setMe(authUser)
      if (authUser) {
        router.push('/dashboard')
      }
    }
  }, [])

  useEffect(()=> {
    checkAuth()
    if (!me) {
      if (user?.id && tg?.initData) {
        signInTelegram(tg?.initData)
      }
    }
  }, [])

  return (
    <>
      <h1>Это страница администратора</h1>
      {me && <h2>Есть авторизованный пользователь: { me.telegramId }</h2>}
      {user && <h2>Есть  пользователь: { user.id }</h2>}
      {!me && <AuthForm onSubmit={signInLocalAuth}/>}
    </>
  )
}