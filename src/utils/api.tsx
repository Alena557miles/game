import { BASE_URL } from "../configs/configs"
import { TokenResponse, USER_ID } from "../types"

export const fetchUserID = async (name: string, complexity: number) => {
  try {
    const response = await fetch(`${BASE_URL}/init`, {
      method: "POST",
      body: JSON.stringify({ name, complexity }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
    throw Error("Error: Something went wrong when fetching userID.")
  }
}
export const fetchToken = async (userID: USER_ID) => {
  try {
    const chunksNumbers = [1, 2, 3, 4]
    const tokenPromises = chunksNumbers.map(async (chunk) => {
      return getTokenByUserIdAndChunk(userID, chunk)
    })
    const response = await Promise.all(tokenPromises)
    const completedToken = response
      .sort((a, b) => a.no - b.no)
      .map((i) => i.chunk)
      .join("")
    return completedToken
  } catch (error) {
    console.log(error)
    throw Error("Error: Something went wrong when fetching token.")
  }
}

export const getTokenByUserIdAndChunk = async (
  userID: USER_ID,
  chunk: number
) => {
  const response = await fetch(`${BASE_URL}/token/${chunk}?id=${userID.id}`, {
    method: "GET",
  })
  return response.json() as Promise<TokenResponse>
}
