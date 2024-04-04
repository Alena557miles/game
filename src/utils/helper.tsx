import { STORAGE_KEY, testScoreList } from "../configs/configs"
import type { USER_SCORE } from "../types"

export function restoreFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : testScoreList
}

function saveToStorage(scoreList: USER_SCORE[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scoreList))
}

export function submitScore(name: string, score: number) {
  const oldHighscores = restoreFromStorage()
  const newScorePlace = oldHighscores.findIndex(
    (user: USER_SCORE) => user.score < score
  )
  if (newScorePlace > 0) {
    oldHighscores.splice(newScorePlace, 0, { name, score })
    oldHighscores.pop()
    saveToStorage(oldHighscores)
  }
}
