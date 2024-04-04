import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCave } from "../../store/store"
import { coordinate2D } from "../../types"
import {
  boardColor,
  canvasX,
  canvasY,
  caveColor,
  droneColor,
  droneCoordinates,
  timeDelay,
} from "../../configs/configs"
import {
  createPath2DString,
  drawObj,
  findMaxCoord,
  findPointsInbetween,
  sliceYCoord,
} from "../../utils"
import { useInterval } from "../../hooks/useInterval"
import { submitScore } from "../../utils/helper"

const Game = () => {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ctx, setCTX] = useState<CanvasRenderingContext2D | null>(null)
  const [direction, setDirection] = useState<coordinate2D>({ x: 0, y: 1 })
  const [delay, setDelay] = useState<number>(timeDelay)
  const [keyPressed, setkeyPressed] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [drone, setDrone] = useState(droneCoordinates)
  const [canvasOffset, setCanvasOffset] = useState(0)
  const [caveToDraw, setCaveToDraw] = useState<coordinate2D[]>([])
  const [leftWall, setLeftWall] = useState<coordinate2D[]>([])
  const [rightWall, setRightWall] = useState<coordinate2D[]>([])
  const [name, complexity, caveHeight, cave] = useCave((state) => [
    state.name,
    state.complexity,
    state.caveHeight,
    state.cave,
  ])
  const maxWallYCollision = findMaxCoord(drone, "y") + caveHeight

  useInterval(() => runGame(), delay)

  useEffect(() => {
    resetState()
    console.log("game started")
    setWalls()
    setDrone(
      droneCoordinates.map((point) => ({
        x: point.x + centerXToCanvasX((cave[0][0] + cave[0][1]) / 2),
        y: point.y,
      }))
    )
    document.getElementById("gameDiv")?.focus()
  }, [])

  useEffect(() => {
    setWalls()
  }, [cave])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        setCTX(ctx)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        ctx.fillStyle = boardColor
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        drawObj(ctx, caveToDraw, caveColor)
        setDirection({ x: 0, y: 1 })
        drawObj(ctx, drone, droneColor)
      }
    }
  }, [drone, caveToDraw])

  function resetState() {
    setDirection({ x: 0, y: 1 })
    setDelay(timeDelay)
    setCaveToDraw([])
    setLeftWall([])
    setRightWall([])
    setGameOver(false)
    setCanvasOffset(0)
  }

  function setWalls() {
    const leftWallDraft = []
    const rightWallDraft = []
    let y = 0
    for (let i = 0; i < cave.length; i++) {
      leftWallDraft.push({ x: centerXToCanvasX(cave[i][0]), y: y })
      rightWallDraft.push({ x: centerXToCanvasX(cave[i][1]), y: y })
      y = y + caveHeight
    }
    setLeftWall([...leftWallDraft])
    setRightWall([...rightWallDraft])
    if (canvasOffset === 0) {
      newCaveDraw(leftWallDraft, rightWallDraft, canvasOffset)
    }
  }

  function centerXToCanvasX(x: number) {
    const centerX = Math.floor(canvasX / 2)
    return centerX + x
  }

  function checkCollision() {
    if (caveToDraw.length > 1) {
      const leftTestPath = new Path2D(
        createPath2DString(
          sliceYCoord(
            leftWall,
            canvasOffset - caveHeight,
            canvasOffset + maxWallYCollision
          ).map((el) => {
            return { x: el.x, y: el.y - canvasOffset }
          })
        )
      )
      const rightTestPath = new Path2D(
        createPath2DString(
          sliceYCoord(
            rightWall,
            canvasOffset - caveHeight,
            canvasOffset + maxWallYCollision
          ).map((el) => {
            return { x: el.x, y: el.y - canvasOffset }
          })
        )
      )
      if (
        testPassForCollisions(leftTestPath) ||
        testPassForCollisions(rightTestPath)
      ) {
        return true
      }
      return false
    }
  }

  function testPassForCollisions(testpath: Path2D) {
    if (ctx && drone) {
      ctx.strokeStyle = caveColor
      ctx.stroke(testpath)
      //nose collision
      if (
        ctx?.isPointInPath(
          testpath,
          drone[Math.floor(drone.length / 2)].x,
          drone[Math.floor(drone.length / 2)].y
        ) === true
      ) {
        console.log("nose impact")
        return true
      }
      //back collision
      if (
        ctx?.isPointInPath(testpath, drone[0].x, drone[0].y) === true ||
        ctx?.isPointInPath(
          testpath,
          drone[drone.length - 1].x,
          drone[drone.length - 1].y
        ) === true
      ) {
        console.log("back impact")
        return true
      }
      //side collision
      const droneSides: coordinate2D[] = []
      for (let i = 1; i < drone.length; i++) {
        droneSides.push(...findPointsInbetween(drone[i - 1], drone[i]))
      }
      for (const point of droneSides) {
        if (ctx?.isPointInPath(testpath, point.x, point.y) === true) {
          console.log("side impact")
          return true
        }
      }
    }
  }

  function checkCaveEnd() {
    if (caveToDraw[caveToDraw.length / 2 - 1].y < 0) {
      return true
    }
    return false
  }

  function newCaveDraw(
    left: coordinate2D[],
    right: coordinate2D[],
    shift: number
  ) {
    const leftdraft = sliceYCoord(
      left,
      canvasOffset - caveHeight,
      canvasOffset + canvasY + caveHeight
    ).map((el) => {
      return { x: el.x, y: el.y - canvasOffset }
    })
    const rightdraft = sliceYCoord(
      right,
      canvasOffset - caveHeight,
      canvasOffset + canvasY + caveHeight
    ).map((el) => {
      return { x: el.x, y: el.y - canvasOffset }
    })
    setCanvasOffset(canvasOffset + shift)
    const newCave = [...leftdraft, ...rightdraft.reverse()]

    setCaveToDraw(newCave)
  }

  function moveDrone() {
    const newDrone: coordinate2D[] = []
    for (let i = 0; i < drone.length; i++) {
      const element = drone[i]
      newDrone.push({ x: element.x + direction.x, y: element.y })
    }
    setDrone(newDrone)
  }

  function runGame() {
    setkeyPressed(false)
    setScore(
      Math.ceil(canvasOffset / caveHeight) * (complexity ? complexity : 1)
    )
    if (checkCollision()) {
      setDirection({ x: 0, y: 0 })
      setDelay(99999)
      console.log("Game over")
      submitScore(name, score)
      setGameOver(true)
    } else if (checkCaveEnd()) {
      submitScore(name, score)
      navigate("/win")
    } else {
      newCaveDraw(leftWall, rightWall, direction.y)
      moveDrone()
    }
  }

  function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!keyPressed) {
      switch (e.key) {
        case "ArrowLeft":
          setDirection({ x: direction.x - 7, y: 1 })
          setkeyPressed(true)
          break
        case "ArrowRight":
          setDirection({ x: direction.x + 7, y: 1 })
          setkeyPressed(true)
          break
        case "ArrowDown":
          setDirection({ x: direction.x, y: 5 })
          setkeyPressed(true)
          break
      }
    }
  }

  return (
    <>
      <div>Game</div>
      <div
        tabIndex={0}
        onKeyDown={(e) => changeDirection(e)}
        id="gameDiv"
        className="absolute top-0 bottom-0 w-screen h-screen outline-none flex flex-col justify-center "
      >
        <div className="  ">
          <div className="scoreBox">
            <h2>
              {name}'s score: {score}
            </h2>
          </div>
          {gameOver && (
            <div className="gameOver w-full h-full flex flex-col justify-center backdrop-blur-md bg-white/30 hero min-h-screen ">
              <h1>Game Over</h1>
              <h2>Your score: {score}</h2>

              <button
                onClick={() => navigate("/")}
                className=" btn btn-primary self-center"
              >
                return to start screen
              </button>
            </div>
          )}
          <canvas
            className="playArea border-4 border-thyme-500 m-auto content-center"
            ref={canvasRef}
            width={`${canvasX}px`}
            height={`${canvasY}px`}
          />
          <button onClick={() => navigate("/")} className="max-w-xs">
            return to start screen
          </button>
        </div>
      </div>
    </>
  )
}

export default Game
