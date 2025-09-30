import TelegramBot from 'node-telegram-bot-api'
import type { CollectionAfterChangeHook } from 'payload'

export const sendMessageTg: CollectionAfterChangeHook = async ({doc}) => {
  const tokenTgBot = process.env.TG_BOT_TOKEN
  const chatId = doc.cityId.chanelLink

  if(tokenTgBot && chatId) {
    try {
      const bot = new TelegramBot(tokenTgBot);
      const message = `<b>Новая заявка с сайта Монетум:</b>\n\n` +
        `<b>ФИО:</b> ${doc?.fio}\n` +
        `<b>Контакты:</b> ${doc.contacts}\n` +
        `<b>Город:</b> ${doc.cityId.city}\n` +
        `<b>Отдает:</b> ${doc.mainValue}  ${doc.mainCurrency.title}\n` +
        `<b>Получает:</b> ${doc.paidValue} ${doc.paidCurrency.title}\n` +
        `<b>Создана:</b> ${doc.createdAt}\n`
      await bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
      });
    } catch (error: any) {
      console.error(error)
    }
  }
  return doc
}
