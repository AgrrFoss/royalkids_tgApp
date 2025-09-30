'use client'
import { useEffect, useState } from 'react';
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

export default function TgClient () {
  const [userData, setUserData] = useState<UserData>({ isDataValid: true });
  const [tgStatus, setTgStatus] = useState<string>('Телеграм не подключен');

  useEffect(() => {
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
        setUserData(data);
        // Отправляем initData на сервер для проверки подписи
        fetch('/api/verify-telegram-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData: tg.initData }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.isValid) {
              setUserData({
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                photoUrl: user.photo_url,
                isDataValid: true,
              });
            } else {
              console.error('Telegram data is not valid!');
              // Обработка случая, когда данные не прошли проверку
              setUserData(prevState => ({...prevState, isDataValid: false}))
            }
          })
          .catch(error => {
            console.error('Error verifying Telegram data:', error);
            setUserData(prevState => ({...prevState, isDataValid: false}))
          });
      } else {
        console.log('User data not available.');
      }
    }
  }, [tgStatus, userData]);


  return (
    <div>
      <h1>Информация от ТГ АПП</h1>
      <>{tgStatus}</>
      {userData.isDataValid ? (
        <>
          <p>User ID: {userData.id}</p>
          <p>First Name: {userData.firstName}</p>
          {userData.lastName && <p>Last Name: {userData.lastName}</p>}
          {userData.username && <p>Username: {userData.username}</p>}
          {userData.photoUrl && <img src={userData.photoUrl} alt="User Photo" />}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}