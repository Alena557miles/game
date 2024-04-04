import { WS_API_URL } from "../configs/configs"
import { TOKEN, USER_ID } from "../types"

export function initWebSocket(userID: USER_ID, gameToken: TOKEN) {
  const ws = new WebSocket(WS_API_URL)

  ws.onopen = () => {
    console.log("Connected. player:" + userID.id + "-" + gameToken)
    ws.send("player:" + userID.id + "-" + gameToken)
  }

  ws.onerror = () => {
    console.log("Connection error")
  }

  return ws
}
