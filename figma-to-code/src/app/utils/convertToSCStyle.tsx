import { Element, ElementType } from "@/types";

export default function ConvertToSCStyle(
  children: Element[] | undefined
): string | null {
  if (!children) {
    return null;
  }

  const renderedChildren = children.flatMap((child: Element) => {
    switch (child.type) {
      case ElementType.GROUP:
      case ElementType.INSTANCE:
      case ElementType.FRAME:
        return ConvertToSCStyle(child.children);
      case ElementType.RECTANGLE:
        switch (child.fills[0]?.type) {
          case "SOLID":
            let rectangle = `const ${
              child.name
            } = styled.img\`\n\twidth: ${Math.round(
              child.absoluteBoundingBox.width
            )}px;\n\theight: ${Math.round(
              child.absoluteBoundingBox.height
            )}px;\n\tleft: ${Math.round(
              child.absoluteBoundingBox.x
            )}px;\n\ttop: ${Math.round(child.absoluteBoundingBox.y)}px;\n`;
            if (child.cornerRadius) {
              rectangle += `\tborder-radius: ${child.cornerRadius}px;\n`;
            }
            if (child.strokes.length !== 0) {
              rectangle += `\tborder: ${
                child.strokeWeight
              }px ${child.strokes[0]?.type.toLowerCase()} rgba(${Math.round(
                child.strokes[0]?.color.r * 255
              )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
                child.strokes[0]?.color.b * 255
              )},${child.strokes[0]?.color.a});\n`;
            }
            rectangle += `\``;
            return rectangle;
          case "IMAGE":
            let image = `const ${
              child.name
            } = styled.img\`\n\twidth: ${Math.round(
              child.absoluteBoundingBox.width
            )}px;\n\theight: ${Math.round(
              child.absoluteBoundingBox.height
            )}px;\n\tleft: ${Math.round(
              child.absoluteBoundingBox.x
            )}px;\n\ttop: ${Math.round(child.absoluteBoundingBox.y)}px;\n`;
            if (child.cornerRadius) {
              image += `\tborder-radius: ${child.cornerRadius}px;\n`;
            }
            if (child.strokes.length !== 0) {
              image += `\tborder: ${
                child.strokeWeight
              }px ${child.strokes[0]?.type.toLowerCase()} rgba(${Math.round(
                child.strokes[0]?.color.r * 255
              )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
                child.strokes[0]?.color.b * 255
              )},${child.strokes[0]?.color.a});\n`;
            }
            image += `\``;
            return image;
        }
      case ElementType.TEXT:
        const lineHeightPx = child.style
          ? Math.round(child.style.lineHeightPx)
          : 0;
        const letterSpacing = child.style
          ? Math.round(child.style.letterSpacing)
          : 0;
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
          ? Math.round(child.fills[0]?.color?.r * 255)
          : 0;
        return `const ${child.name} = styled.div\`\n\twidth: ${Math.round(
          child.absoluteBoundingBox.width
        )}px;\n\theight: ${Math.round(
          child.absoluteBoundingBox.height
        )}px;\n\tleft: ${Math.round(
          child.absoluteBoundingBox.x
        )}px;\n\ttop: ${Math.round(
          child.absoluteBoundingBox.y
        )}px;\n\tfont-family: ${child.style?.fontFamily};\n\tfont-weight: ${
          child.style?.fontWeight
        };\n\tfont-size: ${
          child.style?.fontSize
        }px;\n\tline-height: ${lineHeightPx}px;\n\tletter-spacing: ${letterSpacing}px;\n\ttext-align: ${child.style?.textAlignHorizontal.toLowerCase()};\n\tcolor: rgba(${r},${g},${b},${a});\n\``;
      default:
        return null;
    }
  });

  const styledComponentsStyle = renderedChildren.filter(
    (child) => child !== null
  );
  return styledComponentsStyle.length > 0
    ? styledComponentsStyle.join("\n")
    : null;
}
