'use server'
import crypto from 'crypto'

interface InitData {
  hash: string
  [key: string]: string
}

function verifyTelegramWebAppSignature(initDataString: string, botToken: string): boolean {
  try {
    const initData: InitData = initDataString.split('&').reduce((acc: any, item) => {
      const [key, value] = item.split('=')
      acc[key] = decodeURIComponent(value)
      return acc
    }, {})

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest()

    const dataCheckString = Object.keys(initData)
      .filter((key) => key !== 'hash')
      .sort()
      .map((key) => `${key}=${initData[key]}`)
      .join('\n')

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

    return hmac === initData.hash
  } catch (error) {
    console.error('Error during signature verification:', error)
    return false
  }
}

export async function validateTgSignature(initData: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables.')
    return false
  }
  if (!initData) {
    console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables.')
    return false
  }
  return verifyTelegramWebAppSignature(initData, botToken)
}
