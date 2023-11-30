import { Element, ElementType } from "@/types";

export default function ConvertToTai(children: Element[] | undefined) {
  let tailwindStyle = `<>`;
  const frameChildren = convertFrameChildren(children);
  tailwindStyle += `\n${frameChildren}`;
  tailwindStyle += `</>`;
  return tailwindStyle;
}

const convertFrameChildren = (
  children: Element[] | undefined,
  depth: number = 1
): string | null => {
  if (!children) {
    return null;
  }
  let renderedChildren = "";
  const indentation = "\t".repeat(depth);
  children.forEach((child: Element) => {
    if (
      (child.type === ElementType.GROUP || ElementType.FRAME) &&
      child.children
    ) {
      renderedChildren += `${indentation}<div>\n`;
      const groupChildren = convertFrameChildren(child.children, depth + 1);
      if (groupChildren) {
        renderedChildren += `${groupChildren}`;
      }
      renderedChildren += `${indentation}</div>\n`;
    } else {
      renderedChildren += convertElement(child, indentation, depth);
    }
  });
  return renderedChildren;
};

const convertElement = (
  child: Element,
  indentation: string,
  depth: number
): string => {
  const r = child.fills[0]?.color
    ? Math.round(child.fills[0]?.color?.r * 255)
    : 0;
  const g = child.fills[0]?.color
    ? Math.round(child.fills[0]?.color?.r * 255)
    : 0;
  const b = child.fills[0]?.color
    ? Math.round(child.fills[0]?.color?.r * 255)
    : 0;
  const a = child.fills[0]?.color
    ? Math.round(child.fills[0]?.color?.r * 100)
    : 0;
  switch (child.type) {
    case ElementType.RECTANGLE:
      switch (child.fills[0]?.type) {
        case "IMAGE":
          let image = `${indentation}<img className="w-[${Math.round(
            child.absoluteBoundingBox.width
          )}px] h-[${Math.round(
            child.absoluteBoundingBox.height
          )}px] left-[${Math.round(
            child.absoluteBoundingBox.x
          )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px]`;
          if (child.cornerRadius) {
            image += ` rounded-[${Math.round(child.cornerRadius)}px]`;
          }
          if (child.strokes.length !== 0) {
            image += ` border-[${
              child.strokeWeight
            }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${r},${g},${b})]`;
          }
          image += ` absolute"/>\n`;
          return image;
        case "SOLID":
          let rectangle = `${indentation}<div className="w-[${Math.round(
            child.absoluteBoundingBox.width
          )}px] h-[${Math.round(
            child.absoluteBoundingBox.height
          )}px] left-[${Math.round(
            child.absoluteBoundingBox.x
          )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px]`;
          if (child.cornerRadius) {
            rectangle += ` rounded-[${Math.round(child.cornerRadius)}px]`;
          }
          if (child.strokes.length !== 0) {
            rectangle += ` border-[${
              child.strokeWeight
            }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${r},${g},${b})]`;
          }
          rectangle += ` absolute"></div>\n`;
          return rectangle;
      }
    case ElementType.ELLIPSE:
      let ellipse = `${indentation}<div className="w-[${Math.round(
        child.absoluteBoundingBox.width
      )}px] h-[${Math.round(
        child.absoluteBoundingBox.height
      )}px] left-[${Math.round(
        child.absoluteBoundingBox.x
      )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px]`;
      if (child.cornerRadius) {
        ellipse += ` rounded-[${Math.round(child.cornerRadius)}px]`;
      }
      if (child.strokes.length) {
        ellipse += ` bg-[rgb(${r},${g},${b}]/${a}]`;
      }
      if (child.strokes.length !== 0) {
        ellipse += ` border-[${
          child.strokeWeight
        }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${r},${g},${b})]`;
      }
      ellipse += ` rounded-full absolute"></div>\n`;
      return ellipse;
    case ElementType.LINE:
    case ElementType.VECTOR:
      let lineOrVector = `${indentation}<div className="w-[${Math.round(
        child.absoluteBoundingBox.width
      )}px] h-[${Math.round(
        child.absoluteBoundingBox.height
      )}px] left-[${Math.round(
        child.absoluteBoundingBox.x
      )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px]`;
      if (child.strokes.length) {
        lineOrVector += `bg-[rgb(${Math.round(
          child.strokes[0]?.color?.r * 255
        )},${Math.round(child.strokes[0]?.color?.g * 255)},${Math.round(
          child.strokes[0]?.color?.b * 255
        )})/${
          child.strokes[0]?.opacity
            ? child.strokes[0]?.opacity * child.strokes[0]?.color?.a * 100
            : child.strokes[0]?.color?.a * 100
        }]`;
      }
      lineOrVector += ` absolute"></div>\n`;
      return lineOrVector;
    case ElementType.TEXT:
      const lineHeightPx = child.style
        ? Math.round(child.style.lineHeightPx)
        : 0;
      const letterSpacing = child.style
        ? Math.round(child.style.letterSpacing)
        : 0;
      let text = `${indentation}<div className="w-[${Math.round(
        child.absoluteBoundingBox.width
      )}px] h-[${Math.round(
        child.absoluteBoundingBox.height
      )}px] left-[${Math.round(
        child.absoluteBoundingBox.x
      )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px] font-['${
        child.style?.fontFamily
      }'] font-[${child.style?.fontWeight}] text-[${
        child.style?.fontSize
      }px] text-${child.style?.textAlignHorizontal.toLowerCase()} text-[rgb(${r},${g},${b})]`;

      if (child.style?.italic) {
        text += " italic";
      }
      if (lineHeightPx) {
        text += `leading-[${lineHeightPx}px]`;
      }
      if (letterSpacing) {
        text += `tracking-[${letterSpacing}px]`;
      }

      text += ` absolute">`;
      text += `\n${indentation + "\t"}${child.characters}\n`;
      text += `${indentation}</div>\n`;
      return text;
    default:
      return "";
  }
};
