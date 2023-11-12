import { Element, ElementType } from "@/types";

export default function ConvertToTai(
  children: Element[] | undefined
): string | null {
  if (!children) {
    return null;
  }

  const renderedChildren = children.flatMap((child: Element) => {
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
      case ElementType.GROUP:
      case ElementType.INSTANCE:
      case ElementType.FRAME:
        return ConvertToTai(child.children);
      case ElementType.RECTANGLE:
        switch (child.fills[0]?.type) {
          case "IMAGE":
            let image = `<img className="w-[${Math.round(
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
            image += ` absolute"/>`;
            return image;
          case "SOLID":
            let rectangle = `<div className="w-[${Math.round(
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
            rectangle += ` absolute"></div>`;
            return rectangle;
        }
      case "ELLIPSE":
        let ellipse = `<div className="w-[${Math.round(
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
        ellipse += ` rounded-full absolute"></div>`;
        return ellipse;
      case "LINE":
      case "VECTOR":
        let lineOrVector = `<div className="w-[${Math.round(
          child.absoluteBoundingBox.width
        )}px] h-[${Math.round(
          child.absoluteBoundingBox.height
        )}px] left-[${Math.round(
          child.absoluteBoundingBox.x
        )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px]`;
        if (child.strokes.length) {
          lineOrVector += `bg-[rgb(${Math.round(
            child.strokes[0]?.color.r * 255
          )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
            child.strokes[0]?.color.b * 255
          )})/${
            child.strokes[0]?.opacity
              ? child.strokes[0]?.opacity * child.strokes[0]?.color.a * 100
              : child.strokes[0]?.color.a * 100
          }]`;
        }
        lineOrVector += ` absolute"></div>`;
        return lineOrVector;
      case "TEXT":
        const lineHeightPx = child.style
          ? Math.round(child.style.lineHeightPx)
          : 0;
        const letterSpacing = child.style
          ? Math.round(child.style.letterSpacing)
          : 0;
        let text = `<div className="w-[${Math.round(
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
        text += `\n\t${child.characters}`;
        text += `\n</div>`;
        return text;
      default:
        return null;
    }
  });
  const tailwindStyle = renderedChildren.filter((child) => child !== null);
  return tailwindStyle.length > 0 ? tailwindStyle.join("\n") : null;
}
