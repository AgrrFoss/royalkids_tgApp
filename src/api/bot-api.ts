import { UserData } from '@front/widgets/tgClient/types'
import { IFormInput, IUtmParams } from '@front/widgets/Form'
import { IGiftFormInput } from '@front/widgets/GIftForm'
import { IAuthFormInput } from '@front/widgets/AuthForm'
import serverLog from '@/utilities/serverLog'

const serverUrl = process.env.NEXT_PUBLIC_NEST_BOT_API_URL

const sendUserData = async (endpoint: string, data: any) => {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    }
    const response = await fetch(`${serverUrl}${endpoint}`, fetchOptions)
    const json = await response.json()
    return json
  } catch (e) {
    console.error(e)
  }

}

export default sendUserData

export const sendFormData = async (
  endpoint: string,
  data: IFormInput | IGiftFormInput,
  user: UserData | null,
  utmParams: IUtmParams,
  formName: string) => {

  await serverLog('user from sendFormData: ', user)


  const sendUser = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    username: user?.username,
    photoUrl: user?.photoUrl,
    utmSource: utmParams.utm_source,
    utmMedium: utmParams.utm_medium,
    utmCampaign: utmParams.utm_campaign,

  }
  const formData = {
    formName: formName,
    formData: data,
    userData: sendUser,
  }

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(formData)
  }
  const response = await fetch(`${serverUrl}${endpoint}`, fetchOptions)
  const json = await response.json()
  return json
}

export const getMe = async () => {
  try {
    const response = await fetch(`${serverUrl}/v1.0/auth/me`, {credentials: 'include'})
    if (response.ok) {
      return response.json()
    } else {
      console.error(`Ошибка при получении данных /me: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Текст ошибки:', errorText);
      return null;
    }
  } catch (e) {
    console.error(e)
  }
}

export const telegramLogin = async ( initData: string) => {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({initData: initData})
    }
    const response = await fetch(`${serverUrl}/v1.0/auth/telegram`,fetchOptions)
    if (response.ok) {
      return response.json()
    } else {
      return null;
    }
  } catch (e) {
    console.error(e)
  }
}

export const localLogin = async ( data: IAuthFormInput) => {
  try {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      credentials: 'include',
      body: JSON.stringify(data),
      revalidate: 0
    }
    // @ts-ignore
    const response = await fetch(`${serverUrl}/v1.0/auth/signin`, fetchOptions)
    console.log(response)
    if (response.ok) {
      return response.json()
    } else {
      console.error(`Ошибка при  попытке входа в систему /signin: ${response.status} ${response.statusText}`);
      return null
    }
  } catch (e) {
    console.error(e)
  }
}