export enum Axe {
  HORIZONTALLY = 1,
  VERTICALLY = 2,
  BOTH = 3,
}

export enum Side {
  TOP = 1,
  LEFT = 2,
  BOTTOM = 4,
  RIGHT = 8,
}

export enum Corner {
  TOP_LEFT = Side.TOP & Side.LEFT,
  TOP_RIGHT = Side.TOP & Side.RIGHT,
  BOTTOM_LEFT = Side.BOTTOM & Side.LEFT,
  BOTTOM_RIGHT = Side.BOTTOM & Side.RIGHT,
}

export enum Position {
  HORIZONTALLY = Axe.HORIZONTALLY,
  VERTICALLY = Axe.VERTICALLY,
  CENTER = Axe.BOTH,
  TOP = Side.TOP * 4,
  LEFT = Side.LEFT * 4,
  BOTTOM = Side.BOTTOM * 4,
  RIGHT = Side.RIGHT * 4,
}

export function getBackdropSize(from: number, to: number, scale: number) {
  let value = Math.round(from / scale);
  if (to % 2 ^ value % 2) {
    value -= 1;
  }
  return value;
}

export function centerImage(rect: DOMRect, img: HTMLImageElement, axe: Axe): DOMRect {
  if (Axe.HORIZONTALLY & axe) {
    rect.x = Math.floor((rect.width - img.naturalWidth) / 2);
  }
  if (Axe.VERTICALLY & axe) {
    rect.y = Math.floor((rect.height - img.naturalHeight) / 2);
  }

  return rect;
}

export function clipImage(rect: DOMRect, img: HTMLImageElement, side: Corner | Side): DOMRect {
  if ((Side.TOP | Side.BOTTOM) & side) {
    throw new Error(`You can't clip image to TOP and BOTTOM side`);
  }
  if ((Side.LEFT | Side.RIGHT) & side) {
    throw new Error(`You can't clip image to LEFT and RIGHT side`);
  }

  if (Side.TOP & side) {
    rect.y = 0;
  }
  if (Side.BOTTOM & side) {
    rect.y = rect.height - img.naturalHeight;
  }
  if (Side.LEFT & side) {
    rect.x = 0;
  }
  if (Side.RIGHT & side) {
    rect.x = rect.width - img.naturalWidth;
  }

  return rect;
}

export function drawDualCanvas(
  img: HTMLImageElement,
  front: CanvasRenderingContext2D,
  back: CanvasRenderingContext2D,
  clientRect: DOMRect,
  rect: DOMRect,
  scale: number,
  position?: Position
) {
  if (!position) position = Position.CENTER;

  setCanvasZoom(front.canvas, rect, scale);
  setBackdropCanvasZoom(back.canvas, clientRect, rect, scale);

  drawImage(front, img, rect.x, rect.y);

  let backOffsetX = 0;
  let backOffsetY = 0;
  if (Position.VERTICALLY & position) {
    backOffsetY = Math.floor((back.canvas.height - rect.height) / 2);
  }
  if (Position.HORIZONTALLY & position) {
    backOffsetX = Math.floor((back.canvas.height - rect.height) / 2);
  }

  drawImage(back, img, rect.x + backOffsetX, rect.y + backOffsetY);
}

export function drawImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number) {
  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, img.naturalWidth, img.naturalHeight);
}

export function setBackdropCanvasZoom(canvas: HTMLCanvasElement, clientRect: DOMRect, rect: DOMRect, scale: number) {
  const backHeight = getBackdropSize(clientRect.height, rect.height, scale);
  const backWidth = getBackdropSize(clientRect.width, rect.width, scale);
  setStyleSize(canvas, backWidth * scale, backHeight * scale);
  setDisplaySize(canvas, backWidth, backHeight);
}

export function setCanvasZoom(canvas: HTMLCanvasElement, rect: DOMRect, scale: number) {
  setStyleSize(canvas, scale * rect.width, scale * rect.height);
  setDisplaySize(canvas, rect.width, rect.height);
}

export function getScale(clientRect: DOMRect, width: number, height: number) {
  return Math.floor(Math.min(
    (clientRect.width * .8) / width,
    (clientRect.height * .8) / height,
  ));
}

export function setDisplaySize(canvas: HTMLCanvasElement, width: number, height: number): void {
  canvas.height = height;
  canvas.width = width;
}

export function setStyleSize(element: HTMLElement, width: number, height: number): void {
  element.style.height = `${height}px`;
  element.style.width = `${width}px`;
}