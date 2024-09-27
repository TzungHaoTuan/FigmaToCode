import { Element, ElementType } from "@/types";
import { colorRGBA } from "./colorTransform";

export default function ConvertToTai(
  children: Element[] | undefined,
  frameXY: number[],
  justifyContent: string | undefined
) {
  let tailwindStyle = `<>`;
  const frameChildren = convertFrameChildren(children, frameXY, justifyContent);
  tailwindStyle += `\n${frameChildren}`;
  tailwindStyle += `</>`;
  return tailwindStyle;
}

const convertFrameChildren = (
  children: Element[] | undefined,
  [frameX, frameY]: number[],
  justifyContent: string | undefined,
  depth: number = 1
): string | null => {
  if (!children) {
    return null;
  }

  let renderedChildren = "";
  const indentation = "\t".repeat(depth);

  const sortedChildren = [...children].sort((a, b) => {
    if (a.absoluteBoundingBox.y === b.absoluteBoundingBox.y) {
      return a.absoluteBoundingBox.x - b.absoluteBoundingBox.x;
    }
    return a.absoluteBoundingBox.y - b.absoluteBoundingBox.y;
  });
  console.log(sortedChildren);

  sortedChildren.forEach((child: Element) => {
    if (
      (child.type === ElementType.GROUP || ElementType.FRAME) &&
      child.children
    ) {
      const frameXY = [
        child.absoluteBoundingBox.x,
        child.absoluteBoundingBox.y,
      ];
      const color =
        child.fills.length > 0 ? colorRGBA(child.fills[0].color) : null;

      const autoLayout = child.layoutMode;
      const firstChildY = child.children[0].absoluteBoundingBox.y;
      const flexDirection =
        child.children.every(
          (child) => child.absoluteBoundingBox.y === firstChildY
        ) || autoLayout === "HORIZONTAL"
          ? ""
          : " flex-col";

      //frame style
      let frameStyle = `className="flex${flexDirection}${
        child.primaryAxisAlignItems === "SPACE_BETWEEN"
          ? " justify-between items-center"
          : ""
      }${color ? ` bg-${color}` : ""} w-[${Math.round(
        child.absoluteBoundingBox.width
      )}px] h-[${Math.round(child.absoluteBoundingBox.height)}px]${
        !justifyContent
          ? ` ml-[${Math.round(child.absoluteBoundingBox.x - frameX)}px]`
          : ""
      }${
        !justifyContent
          ? ` mt-[${Math.round(child.absoluteBoundingBox.y - frameY)}px]`
          : ""
      }${
        child.cornerRadius
          ? ` rounded-[${Math.round(child.cornerRadius)}px]`
          : ""
      }${
        child.children.length === 1 &&
        child.children[0].fills[0]?.type === "IMAGE"
          ? " overflow-hidden"
          : ""
      }"`;

      //render
      renderedChildren += `${indentation}<div ${frameStyle}>\n`;

      const groupChildren = convertFrameChildren(
        child.children,
        frameXY,
        child.primaryAxisAlignItems,
        depth + 1
      );
      if (groupChildren) {
        renderedChildren += `${groupChildren}`;
      }
      renderedChildren += `${indentation}</div>\n`;

      // frameX = child.absoluteBoundingBox.x + child.absoluteBoundingBox.width;
      frameY = child.absoluteBoundingBox.y + child.absoluteBoundingBox.height;
    } else {
      renderedChildren += convertElement(
        child,
        [frameX, frameY],
        justifyContent,
        indentation
      );
      frameY += child.absoluteBoundingBox.height;
    }
  });
  return renderedChildren;
};

const convertElement = (
  child: Element,
  [frameX, frameY]: number[],
  justifyContent: string | undefined,
  indentation: string
): string => {
  const color = child.fills.length > 0 ? colorRGBA(child.fills[0].color) : null;
  const marginTop = Math.round(child.absoluteBoundingBox.y - frameY);

  switch (child.type) {
    case ElementType.FRAME:
      // let frame = `${indentation}<div className="w-[${Math.round(
      //   child.absoluteBoundingBox.width
      // )}px] h-[${Math.round(
      //   child.absoluteBoundingBox.height
      // )}px] left-[${Math.round(
      //   child.absoluteBoundingBox.x
      // )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px]`;
      // if (child.cornerRadius) {
      //   frame += ` rounded-[${Math.round(child.cornerRadius)}px]`;
      // }
      // if (child.strokes.length !== 0) {
      //   frame += ` border-[${
      //     child.strokeWeight
      //   }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${r},${g},${b})]`;
      // }
      // frame += ` absolute"></div>\n`;
      return "<div>frame</div>";

    case ElementType.RECTANGLE:
      switch (child.fills[0]?.type) {
        case "IMAGE":
          let image = `${indentation}<div className="flex w-full h-full bg-slate-200">\n`;
          image += `${indentation}\t<p className="m-auto">Image</p>\n`;
          image += `${indentation}</div>\n`;
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
            }px] border-${child.strokes[0].type.toLowerCase()} border-[${color}]`;
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
        ellipse += ` bg-[${color}]`;
      }
      if (child.strokes.length !== 0) {
        ellipse += ` border-[${
          child.strokeWeight
        }px] border-${child.strokes[0].type.toLowerCase()} border-[${color}]`;
      }
      ellipse += ` rounded-full absolute"></div>\n`;
      return ellipse;
    case ElementType.LINE:
      const strokeColor = colorRGBA(child.strokes[0].color);
      let lineOrVector = `${indentation}<hr className="w-[${Math.round(
        child.absoluteBoundingBox.width
      )}px] border-${strokeColor}${marginTop ? ` mt-[${marginTop}px]` : ""}`;
      lineOrVector += `"></hr>\n`;
      return lineOrVector;
    case ElementType.VECTOR:
      let vector = `${indentation}<div className="m-auto w-[${Math.round(
        child.absoluteBoundingBox.width
      )}px] h-[${Math.round(
        child.absoluteBoundingBox.height
      )}px] bg-slate-200">\n`;
      vector += `${indentation}</div>\n`;
      return vector;
    case ElementType.TEXT:
      const lineHeightPx = child.style
        ? Math.round(child.style.lineHeightPx)
        : 0;
      const letterSpacing = child.style
        ? Math.round(child.style.letterSpacing)
        : 0;

      let text = `${indentation}<div className="font-['${
        child.style?.fontFamily
      }'] font-[${child.style?.fontWeight}] ${
        child.style && `text-[${Math.round(child.style.fontSize)}px]`
      } text-${child.style?.textAlignHorizontal.toLowerCase()} text-${color}${
        justifyContent
          ? ""
          : ` ml-[${Math.round(child.absoluteBoundingBox.x - frameX)}px]`
      }${marginTop && !justifyContent ? ` mt-[${marginTop}px] ` : ""} `;

      if (child.style?.italic) {
        text += " italic";
      }
      if (lineHeightPx) {
        text += ` leading-[${lineHeightPx}px]`;
      }
      if (letterSpacing) {
        text += ` tracking-[${letterSpacing}px]`;
      }

      text += `">`;
      text += `\n${indentation + "\t"}${child.characters}\n`;
      text += `${indentation}</div>\n`;
      return text;

    default:
      return "";
  }
};
