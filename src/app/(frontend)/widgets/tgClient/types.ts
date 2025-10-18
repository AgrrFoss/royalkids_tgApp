import { ReactNode } from 'react'

export interface UserData {
  id?: number
  firstName?: string
  lastName?: string
  username?: string
  photoUrl?: string
  isDataValid: boolean
  startParam?: string
  idDarkMode?: boolean
}

export interface IPageStartParams {
  pg?: string
  usr?: string
  umd?: string
  ucm?: string
  ucn?: string
  utr?: string
}
export interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}
export interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramWebAppUser
    start_param: string
  }
  initData: string
}

export interface ITgClientProps {
  children?: ReactNode
}