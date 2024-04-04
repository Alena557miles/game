import { useEffect, useRef, useState } from "react"
import StartGame from "../../components/StartGame/StartGame"
import { useGameState } from "../../store/store"

const WelcomePage = () => {
  const modalRef = useRef<HTMLDialogElement>(null)
  const resetGameState = useGameState((state) => state.resetGameState)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    resetGameState()
  }, [])

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div>
          <h1 className="text-6xl font-bold text-primary">Fly Among Caves</h1>
          <p className="py-6 text-lg leading-loose">
            React test task: The goal of the task is to implement a frontend
            part of a very simple game. To put it briefly: the player controls
            the drone, which goes down the flexuous cave. There are only two
            outcomes: either drone reaches the cave exit (winning scenario), or
            the drone crashes into the cave wall (loosing scenario).
          </p>
          <button
            className="btn  btn-secondary"
            onClick={() => {
              modalRef.current?.showModal()
            }}
          >
            Start game
          </button>

          <dialog id="my_modal_1" className="modal" ref={modalRef}>
            <div className="modal-box">
              {!loading && (
                <>
                  <h3 className="font-bold text-lg">
                    Choose the difficulty level and enter your name!
                  </h3>
                  <p className="py-4">
                    Press ESC key or click the button below to close
                  </p>
                </>
              )}
              <StartGame loading={loading} setLoading={setLoading} />
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
