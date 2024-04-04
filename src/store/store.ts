import { create } from "zustand"
import { caveHeight } from "../configs/configs"
import { GameState, USER_ID, CaveState } from "../types"

export const useGameState = create<GameState>()((set) => ({
  name: "",
  complexity: 0,
  userID: { id: 0 },
  token: "",
  loading: false,

  setName: (newName: string) => set(() => ({ name: newName })),
  setComplexity: (newComplexity: number) =>
    set(() => ({ complexity: newComplexity })),
  setUserID: (newUserID: USER_ID) => set(() => ({ userID: newUserID })),
  setToken: (newToken: string) => set(() => ({ token: newToken })),
  setLoading: (newLoading: boolean) => set(() => ({ loading: newLoading })),

  resetGameState: () =>
    set(() => ({
      name: "",
      complexity: 0,
      userID: { id: 0 },
      token: "",
      loading: false,
    })),
}))

export const useCave = create<CaveState>()((set, get) => ({
  name: "",
  complexity: 0,
  caveHeight: caveHeight,
  segmentsCounter: 0,
  caveLoaded: false,
  cave: [],

  setName: (newName: string) => set(() => ({ name: newName })),
  setComplexity: (newComplexity: number) =>
    set(() => ({ complexity: newComplexity })),
  addSegmentsCounter: () =>
    set((state) => ({ segmentsCounter: state.segmentsCounter + 1 })),
  setCaveLoaded: () => set(() => ({ caveLoaded: true })),

  addCaveSegment: (WSMsg) => {
    const { cave } = get()
    let newSegment: string[] | number[] = WSMsg.split(",")
    newSegment = newSegment.map((val: string) => Number(val))
    set({ cave: [...cave, newSegment] })
  },

  resetCaveState: () =>
    set(() => ({
      caveHeight: caveHeight,
      segmentsCounter: 0,
      caveLoaded: false,
      cave: [],
    })),
}))
