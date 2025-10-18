'use client'
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'
import { UserData } from '@front/widgets/tgClient/types'

interface IUserContext {
  user: UserData| null,
  setUser: Dispatch<SetStateAction<null | UserData>>
}

const UserContext = createContext<IUserContext | null>(null)

interface IUserContextProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: IUserContextProps) => {
  const [user, setUser] = useState<null | UserData>(null);
  const value = { user, setUser }
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): IUserContext => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context;
}