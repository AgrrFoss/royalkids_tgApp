'use server'
import TelegramBot from 'node-telegram-bot-api'
import { IFormInput, IUtmParams } from '@front/widgets/Form'
import { IGiftFormInput } from '@front/widgets/GIftForm'
import { UserData } from '@front/widgets/tgClient/types'


export const sendMessage = async (
    data: IFormInput | IGiftFormInput,
    utm: IUtmParams,
    formType: 'trial' | 'event' | 'lottery' | 'newYear',
    user: UserData | null,) => {
  const tokenTgBot = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const username = user?.username
  if(tokenTgBot && chatId) {
    try {
      let message = ''
      let userHref: string | undefined = undefined
      if (user?.tgId) userHref = username && `https://t.me/${username}`
      if (user?.vkId) userHref = `https://vk.com/id${user?.vkId}`
      const userLink = username ? `<a href="${userHref}">${username}</a>` : `<a href="${userHref}">${user?.firstName}</a>`;
      switch (formType) {
        case 'event':
          message = `<b>Новая заявка на праздник от:</b> ${username ? userLink : 'Пользователь не определен'}\n` +
            `<b>Имя:</b> ${data?.name}, <b>возраст:</b> ${'age' in data ? data?.age : 'не указан'}\n` +
            `<b>Номер телефона:</b> ${data.phone}\n` +
            (utm ?
            `<b>utm:</b> ${utm.utm_source}, ${utm.utm_medium}, ${utm.utm_campaign}`
            : '')
          break
        case 'trial':
          message = `<b>Новая заявка на пробное от:</b> ${userLink}\n` +
            `<b>Имя:</b> ${data?.name}, <b>возраст:</b> ${'age' in data ? data?.age : 'не указан'}\n` +
            `<b>Номер телефона:</b> ${data.phone}\n` +
            (utm ?
            `<b>utm:</b> ${utm.utm_source}, ${utm.utm_medium}, ${utm.utm_campaign}`
            : '')
          break
        case 'newYear':
          message = `<b>Новая заявка на поздравление от:</b> ${userLink}\n` +
            `<b>Имя:</b> ${data?.name}, <b>возраст:</b> ${'age' in data ? data?.age : 'не указан'}\n` +
            `<b>Номер телефона:</b> ${data.phone}\n` +
            (utm ?
            `<b>utm:</b> ${utm.utm_source}, ${utm.utm_medium}, ${utm.utm_campaign}`
            : '')
          break
        default:
          message = `<b>Новая заявка от:</b> ${username ? userLink : 'Пользователь не определен'}\n` +
            `<b>Имя:</b> ${data?.name} ` +
            `<b>Номер телефона:</b> ${data.phone}\n` +
            (utm ?
              `<b>utm:</b> ${utm.utm_source}, ${utm.utm_medium}, ${utm.utm_campaign}`
              : '')
      }
      const bot = new TelegramBot(tokenTgBot);
      await bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
      });
    } catch (error: any) {
      console.error(error)
    }
  }
}