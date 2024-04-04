import { ChangeEvent, useEffect, useState } from "react"
import type { Dispatch, FC, SetStateAction } from "react"
import { useNavigate } from "react-router-dom"

import type { USER_ID } from "../../types/user"
import { useCave, useGameState } from "../../store/store"
import { MAX_LETTERS_NAME } from "../../configs/configs"
import { initWebSocket } from "../../providers/webSocketProvider"
import { fetchToken, fetchUserID } from "../../utils/api"

interface StartGameProps {
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
}

const StartGame: FC<StartGameProps> = ({ loading, setLoading }) => {
  const [
    name,
    complexity,
    userID,
    token,
    setName,
    setComplexity,
    setUserID,
    setToken,
    resetGameState,
  ] = useGameState((state) => [
    state.name,
    state.complexity,
    state.userID,
    state.token,
    state.setName,
    state.setComplexity,
    state.setUserID,
    state.setToken,
    state.resetGameState,
  ])
  const [
    setCaveName,
    setCaveComplexity,
    addCaveSegment,
    setCaveLoaded,
    resetCaveState,
    addSegmentsCounter,
  ] = useCave((state) => [
    state.setName,
    state.setComplexity,
    state.addCaveSegment,
    state.setCaveLoaded,
    state.resetCaveState,
    state.addSegmentsCounter,
  ])
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})

  const navigate = useNavigate()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      setValidationErrors((prev) => ({
        ...prev,
        name: "Please enter the your name!",
      }))

      return
    }
    resetCaveState()
    getUserID()
  }
  const onChangePlayerName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length > MAX_LETTERS_NAME) {
      setValidationErrors((prev) => ({
        ...prev,
        name: `Max ${MAX_LETTERS_NAME} symbols!`,
      }))
      return
    }
    setName(value)
    if (!value) {
      setValidationErrors((prev) => ({
        ...prev,
        name: "Please enter the your name!",
      }))
      return
    }
    setValidationErrors((prev) => ({ ...prev, name: "" }))
  }

  useEffect(() => {
    resetGameState()
    resetCaveState()
    return () => {
      resetGameState()
    }
  }, [])

  useEffect(() => {
    if (userID.id != 0) {
      getUserToken(userID)
      setLoading(true)
    }
  }, [userID])

  useEffect(() => {
    if (token) {
      setCaveName(name)
      setCaveComplexity(Number(complexity))
      let counter = 0
      initWebSocket(userID, token).onmessage = (msg) => {
        if (msg.data !== "finished") {
          addCaveSegment(msg.data)
          addSegmentsCounter
          counter++
          if (counter === 80) {
            console.log("80 segments received")
            setLoading(false)
            navigate("/game")
          }
        } else {
          console.log(counter + " segments total received")
          setCaveLoaded()
        }
      }
    }
  }, [token])

  const getUserID = async () => {
    const result = await fetchUserID(name, complexity)
    if (result) setUserID(result)
  }

  async function getUserToken(userID: USER_ID) {
    const result = await fetchToken(userID)
    setToken(result)
  }
  if (loading)
    return (
      <div className="w-full h-full ">
        <p>loading ... </p>
      </div>
    )
  return (
    <div>
      <form onSubmit={onSubmit}>
        {!!validationErrors["name"] && <p>{validationErrors["name"]}</p>}
        <input
          type="text"
          value={name}
          onChange={onChangePlayerName}
          placeholder="Your name"
          className="input input-bordered input-primary w-full max-w-xs m-4"
        />
        <div className="grid w-full mb-2">
          <label htmlFor="difficulty">Difficulty level:</label>
          <span>{complexity}</span>
          <input
            type="range"
            name="difficulty"
            id="difficulty"
            min={0}
            max={10}
            value={complexity}
            placeholder="difficulty"
            onChange={(e) => setComplexity(+e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full max-w-xs m-1">
          start game
        </button>
      </form>
    </div>
  )
}

export default StartGame
