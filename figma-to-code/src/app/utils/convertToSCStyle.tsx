export default function ConvertToSCStyle(children: any) {
  if (!children) {
    return null;
  }

  const renderedChildren = children.flatMap((child: any) => {
    if (
      child.type === "GROUP" ||
      child.type === "INSTANCE" ||
      child.type === "FRAME"
    ) {
      return ConvertToSCStyle(child.children);
    } else {
      if (child.type === "RECTANGLE") {
        if (child.fills[0]?.type === "IMAGE") {
          return `\`const ${child.name} = styled.img
              width: ${child.absoluteBoundingBox.width}px;
              height: ${Math.round(child.absoluteBoundingBox.height)}px;
              left: ${child.absoluteBoundingBox.x}px;
              top: ${child.absoluteBoundingBox.y}px;
              ${
                child.cornerRadius
                  ? `border-radius: ${child.cornerRadius}px`
                  : ""
              }
              ${
                child.strokes.length !== 0
                  ? `border: ${
                      child.strokeWeight
                    }px ${child.strokes[0].type.toLowerCase()} rgba(${Math.round(
                      child.strokes[0]?.color.r * 255
                    )},${Math.round(
                      child.strokes[0]?.color.g * 255
                    )},${Math.round(child.strokes[0]?.color.b * 255)},${
                      child.strokes[0]?.color.a
                    })`
                  : ""
              }
        \``;
        }
      }
    }
  });

  const filteredChildren = renderedChildren.filter(Boolean); // Filter out undefined or null values
  const indentedCSS = filteredChildren
    .map((child: any) => child.replace(/^ {4}/gm, ""))
    .join("\n")
    .trim();

  return indentedCSS;
}
