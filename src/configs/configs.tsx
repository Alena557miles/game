import { coordinate2D } from "../types"

export const caveHeight = 10
export const tokenChunks = 4
export const BASE_URL = `https://cave-drone-server.shtoa.xyz`
export const WS_API_URL = `wss://cave-drone-server.shtoa.xyz/cave`

export const canvasX = 500
export const canvasY = 500
export const timeDelay = 10
export const caveSectionHeight = 10
export const droneCoordinates: coordinate2D[] = [
  { x: -10, y: 0 },
  { x: 0, y: 17 },
  { x: 10, y: 0 },
]

//styles
export const boardColor = "#222222"
export const droneColor = "#00ff00"
export const caveColor = "#999999"

export const STORAGE_KEY: string = "CaveDroneData"
export const testScoreList = [
  { name: "Alex", score: 999 },
  { name: "LiLu", score: 900 },
  { name: "Zorg", score: 800 },
  { name: "Corben", score: 700 },
  { name: "Multipass", score: 600 },
  { name: "Alex", score: 500 },
  { name: "Alex", score: 400 },
  { name: "Alex", score: 300 },
  { name: "Alex", score: 200 },
  { name: "Alex", score: 100 },
]

export const MAX_LETTERS_NAME = 30