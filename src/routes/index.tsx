import { createBrowserRouter } from "react-router-dom"
import { path } from "./path"
import NotFoundPage from "../pages/404NotFoundPage/NotFoundPage"
import WelcomePage from "../pages/Welcome/WelcomePage"
import GamePage from "../pages/Game/GamePage"

const router = createBrowserRouter([
  {
    path: path.home,
    element: <WelcomePage />,
  },
  {
    path: path.game,
    element: <GamePage />,
  },
  {
    path: path.error,
    element: <NotFoundPage />,
  },
])

export default router
