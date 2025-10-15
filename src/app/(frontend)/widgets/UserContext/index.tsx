import React, { createContext, ReactNode, useContext, useState } from 'react'

const UserContext = createContext(null)

interface IUserContextProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: IUserContextProps) => {
  const [user, setUser] = useState<null>(null);
  const value = { user, setUser }
}