import React from "react";
import { useSelector } from "react-redux";

export default function FrameScaled() {
  const pages = useSelector((state: any) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);

  console.log(pages);

  const renderChildren = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP") {
        return renderChildren(child.children);
      } else {
        if (child.type === "RECTANGLE") {
          return (
            <div key={child.id}>
              <div
                className="absolute"
                style={{
                  width: child.absoluteBoundingBox.width,
                  height: child.absoluteBoundingBox.height,
                  left: child.absoluteBoundingBox.x,
                  top: child.absoluteBoundingBox.y,
                }}
              />
            </div>
          );
        } else if (child.type === "TEXT") {
          return (
            <div
              key={child.id}
              className="absolute"
              style={{
                width:
                  child.absoluteBoundingBox.width +
                  Math.round(child.style.letterSpacing * 10) / 10,

                height: child.absoluteBoundingBox.height,
                left: child.absoluteBoundingBox.x,
                top: child.absoluteBoundingBox.y,

                fontFamily: child.style.fontFamily,
                // fontStyle: child.style.italic && "italic",
                fontStyle: "normal",
                fontWeight: child.style.fontWeight,
                fontSize: `${child.style.fontSize}px`,
                lineHeight: `${child.style.lineHeightPx}px`,
                letterSpacing: `${
                  Math.round(child.style.letterSpacing * 10) / 10
                }px`,

                color: `rgba(${Math.round(
                  child.fills[0].color.r * 255
                )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
                  child.fills[0].color.b * 255
                )},${child.fills[0].color.a})`,
              }}
            >
              {!child.characters.includes("\r\n")
                ? child.characters
                : child.characters.split("\n").map((line: any, index: any) => {
                    return (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    );
                  })}
            </div>
          );
        }
        return null;
      }
    });
  };

  return (
    <div>
      {pages.length !== 0 &&
        pages
          .filter((page: any) => page.name === currentPage)[0]
          .frames.map((frame: any) => {
            if (frame.id === currentFrame) {
              return renderChildren(frame.children);
            }
          })}
    </div>
  );
}
