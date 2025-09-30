import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

interface InitData {
  hash: string;
  [key: string]: string;
}

function verifyTelegramWebAppSignature(initDataString: string, botToken: string): boolean {
  try {
    const initData: InitData = initDataString.split('&').reduce((acc: any, item) => {
      const [key, value] = item.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

    const dataCheckString = Object.keys(initData)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${initData[key]}`)
      .join('\n');

    const hmac = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hmac === initData.hash;
  } catch (error) {
    console.error("Error during signature verification:", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { initData } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN; // Получите токен бота из переменных окружения

    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN is not defined in environment variables.");
      return res.status(500).json({ isValid: false, error: 'Bot token not configured' });
    }

    if (!initData) {
      return res.status(400).json({ isValid: false, error: 'Missing initData' });
    }

    const isValid = verifyTelegramWebAppSignature(initData, botToken);

    res.status(200).json({ isValid: isValid });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
