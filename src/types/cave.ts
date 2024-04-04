export interface CaveState {
  name: string
  complexity: number
  caveHeight: number
  segmentsCounter: number
  caveLoaded: boolean
  cave: number[][]
  setName: (newName: string) => void
  setComplexity: (newComplexity: number) => void
  addSegmentsCounter: () => void
  setCaveLoaded: () => void
  addCaveSegment: (WSMsg: string) => void
  resetCaveState: () => void
}


