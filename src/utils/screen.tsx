import { coordinate2D } from "../types"

export function drawObj(
  ctx: CanvasRenderingContext2D,
  obj: coordinate2D[],
  objColor: string
) {
  ctx.fillStyle = objColor
  let pathToDraw = createPath2DString(obj)
  const path = new Path2D(pathToDraw)
  ctx.fill(path)
}

export function createPath2DString(obj: coordinate2D[]) {
  let pathString = ""

  for (let i = 0; i < obj.length; i++) {
    const element = obj[i]
    let previousX = 0
    let previousY = 0
    let pathElement = ""

    if (i === 0) {
      pathElement = "M " + element.x + "," + element.y
      previousX = previousX + element.x
      previousY = previousY + element.y
    } else {
      pathElement =
        "L " +
        (element.x - previousX).toString() +
        "," +
        (element.y - previousY).toString()
      previousX = previousX + element.x
      previousY = previousY + element.y
    }
    pathString = pathString.concat(" ", pathElement)
  }
  return pathString
}

export function findMaxCoord(obj: coordinate2D[], axis: "x" | "y") {
  let maxCoord = 0
  for (let i = 0; i < obj.length; i++) {
    if (obj[i][axis] > maxCoord || i === 0) {
      maxCoord = obj[i][axis]
    }
  }
  return maxCoord
}

export function sliceYCoord(
  coordArr: coordinate2D[],
  yMin: number,
  yMax: number
) {
  let trimmedArr: coordinate2D[] = []
  for (let i = 0; i < coordArr.length; i++) {
    const element = coordArr[i]
    if (element.y > yMin && element.y < yMax) {
      trimmedArr.push({ x: element.x, y: element.y })
    }
  }
  return trimmedArr
}

export function findPointsInbetween(start: coordinate2D, end: coordinate2D) {
  const pointsInbetween: coordinate2D[] = []
  const dx = end.x - start.x
  const dy = end.y - start.y
  const stepY = dx > 0 ? dy / dx : -dy / dx
  if (dx === 0 && dy > 0) {
    for (let i = 0; i <= dy; i++) {
      pointsInbetween.push({ x: start.x, y: start.y + i })
    }
  }
  if (dx === 0 && dy < 0) {
    for (let i = 0; i <= -dy; i++) {
      pointsInbetween.push({ x: start.x, y: start.y - i })
    }
  }

  if (dx > 0) {
    for (let i = 0; i <= dx; i++) {
      pointsInbetween.push({
        x: start.x + i,
        y: start.y + Math.round(i * stepY),
      })
    }
  } else {
    for (let i = 0; i <= -dx; i++) {
      pointsInbetween.push({
        x: start.x - i,
        y: start.y + Math.round(i * stepY),
      })
    }
  }

  for (let i = 1; i < pointsInbetween.length; i++) {
    const el = pointsInbetween[i]
    const elPr = pointsInbetween[i - 1]
    const dy = el.y - elPr.y
    if (dy > 1) {
      for (let j = 1; j < dy; j++) {
        pointsInbetween.splice(pointsInbetween.indexOf(el), 0, {
          x: el.x,
          y: elPr.y + j,
        })
      }
    } else if (dy < -1) {
      for (let j = 1; j < -dy; j++) {
        pointsInbetween.splice(pointsInbetween.indexOf(el), 0, {
          x: el.x,
          y: elPr.y - j,
        })
      }
    }
  }
  pointsInbetween.pop()
  pointsInbetween.shift()

  return pointsInbetween
}
