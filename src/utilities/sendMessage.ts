'use server'
import TelegramBot from 'node-telegram-bot-api'
import { IFormInput, IUtmParams } from '@front/widgets/Form'


export const sendMessage = async (data: IFormInput, utm: IUtmParams, formType: 'trial' | 'event', username?: string) => {
  const tokenTgBot = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  const utmString = JSON.stringify(utm)
  console.log('функция отправки запущена')
  if(tokenTgBot && chatId) {
    try {
      const bot = new TelegramBot(tokenTgBot);
      const message = `<b>Новая заявка из бота:</b>\n` +
        `<b>Пользователь:</b> ${username}\n` +
        `<b>Имя:</b> ${data?.name}\n` +
        `<b>Примечания (возраст и др):</b> ${data?.age}\n` +
        `<b>Номер телефона:</b> ${data.phone}\n` +
        `<b>Назначение:</b> ${formType}\n` +
        `<b>Метки:</b> ${utmString}\n`

      await bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
      });

      console.log('функция отправки сработала')
    } catch (error: any) {
      console.error(error)
    }
  }
}