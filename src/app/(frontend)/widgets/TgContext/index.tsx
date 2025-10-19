'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/types';

interface TgContextProps {
  tg: WebApp | null;
  isTgReady: boolean;
}
const TgContext = createContext<TgContextProps>({
  tg: null,
  isTgReady: false,
});

interface TgProviderProps {
  children: React.ReactNode;
}

export const TgContextProvider = ({children}: TgProviderProps) => {
  const [tg, setTg] = useState<WebApp | null>(null);
  const [ isTgReady, setIsTgReady] = useState<boolean>(false);

  return (
    <TgContext.Provider value={{tg, isTgReady}}>
      {children}
    </TgContext.Provider>
  )
}

export const useTg = () => useContext(TgContext);