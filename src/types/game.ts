import { USER_ID } from "./user"

export interface GameState {
  name: string
  complexity: number
  userID: USER_ID
  token: string
  loading: boolean
  setName: (newName: string) => void
  setComplexity: (newComplexity: number) => void
  setUserID: (newUserID: USER_ID) => void
  setToken: (newToken: string) => void
  setLoading: (newLoading: boolean) => void
  resetGameState: () => void
}

export type coordinate2D = {
  x: number
  y: number
}
