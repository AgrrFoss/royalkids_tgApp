'use server'
import process from 'node:process'
import { UserData } from '@front/widgets/tgClient/types'
import { IFormInput, IUtmParams } from '@front/widgets/Form'
import { IGiftFormInput } from '@front/widgets/GIftForm'

const serverUrl = process.env.NEST_BOT_API_URL

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