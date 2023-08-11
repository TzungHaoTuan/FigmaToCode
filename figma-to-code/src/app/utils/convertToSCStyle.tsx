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
        if (child.fills[0]?.type === "SOLID") {
          return `const ${child.name} = styled.img\`
              width: ${Math.round(child.absoluteBoundingBox.width)}px;
              height: ${Math.round(child.absoluteBoundingBox.height)}px;
              left: ${Math.round(child.absoluteBoundingBox.x)}px;
              top: ${Math.round(child.absoluteBoundingBox.y)}px;
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
      } else if (child.type === "TEXT") {
        return `const ${child.name} = styled.div\`
              width: ${Math.round(child.absoluteBoundingBox.width)}px;
              height: ${Math.round(child.absoluteBoundingBox.height)}px;
              left: ${Math.round(child.absoluteBoundingBox.x)}px;
              top: ${Math.round(child.absoluteBoundingBox.y)}px;
              font-family: ${child.style.fontFamily};
              font-weight: ${child.style.fontWeight};
              font-size: ${child.style.fontSize}px;
              line-height: ${Math.round(child.style.lineHeightPx * 10) / 10}px;
              letter-spacing: ${
                Math.round(child.style.letterSpacing * 10) / 10
              }px;
              text-align: ${child.style.textAlignHorizontal.toLowerCase()};
              color: rgba(${Math.round(
                child.fills[0]?.color.r * 255
              )},${Math.round(child.fills[0]?.color.g * 255)},${Math.round(
          child.fills[0]?.color.b * 255
        )},${child.fills[0].color.a});
              \``;
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
