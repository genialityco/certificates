import canvasTxt from 'canvas-txt';

import type { AttributeObject } from '~/config/types'; // Asegúrate de tener el tipo correcto
import hexToRgba from '~/utils/hexToRgba';

export default function renderAttribute({
  context,
  x,
  y,
  width,
  height,
  opacity,
  text,
  fontColorHex,
  fontSize,
  fontFamily,
  fontStyle,
  fontVariant,
  fontWeight,
  fontLineHeightRatio,
}: {
  context: CanvasRenderingContext2D;
} & Omit<AttributeObject, 'type'>): void {
  context.beginPath();

  context.fillStyle = hexToRgba({ hex: fontColorHex, opacity });

  canvasTxt.debug = false;

  canvasTxt.align = 'center';
  canvasTxt.vAlign = 'middle';
  canvasTxt.fontSize = fontSize;
  canvasTxt.font = fontFamily;
  canvasTxt.fontStyle = fontStyle;
  canvasTxt.fontVariant = fontVariant;
  canvasTxt.fontWeight = fontWeight;
  canvasTxt.lineHeight = fontLineHeightRatio * fontSize;

  canvasTxt.drawText(context, text, x, y, width, height);

  context.closePath();
}
