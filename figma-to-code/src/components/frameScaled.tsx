import React from "react";
import { useSelector } from "react-redux";

export default function FrameScaled() {
  const pages = useSelector((state: any) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  const images = useSelector((state: any) => state.images.images);

  console.log(pages);

  const renderChildren = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
        return renderChildren(child.children);
      } else {
        if (child.type === "RECTANGLE") {
          if (child.fills[0]?.type === "IMAGE") {
            return (
              <div key={child.id}>
                {images[0]?.hasOwnProperty(child.fills[0].imageRef) && (
                  <img
                    src={images[0][child.fills[0].imageRef]}
                    alt={child.name}
                    className="absolute"
                    style={{
                      width: child.absoluteBoundingBox.width,
                      height: child.absoluteBoundingBox.height,
                      left: child.absoluteBoundingBox.x,
                      top: child.absoluteBoundingBox.y,
                    }}
                  />
                )}
              </div>
            );
          } else if (child.fills[0]?.type === "SOLID") {
            return (
              <div key={child.id}>
                <div
                  className="absolute"
                  style={{
                    width: child.absoluteBoundingBox.width,
                    height: child.absoluteBoundingBox.height,
                    left: child.absoluteBoundingBox.x,
                    top: child.absoluteBoundingBox.y,
                    backgroundColor: `rgba(${Math.round(
                      child.fills[0]?.color.r * 255
                    )},${Math.round(
                      child.fills[0]?.color.g * 255
                    )},${Math.round(child.fills[0]?.color.b * 255)},${
                      child.fills[0]?.opacity
                        ? child.fills[0]?.opacity * child.fills[0]?.color.a
                        : child.fills[0]?.color.a
                    })`,
                    border: `${child.strokeWeight}px ${
                      child.strokes[0]?.type
                    } rgba(${Math.round(
                      child.strokes[0]?.color.r * 255
                    )},${Math.round(
                      child.strokes[0]?.color.g * 255
                    )},${Math.round(child.strokes[0]?.color.b * 255)},${
                      child.strokes[0]?.opacity
                        ? child.strokes[0]?.opacity * child.strokes[0]?.color.a
                        : child.strokes[0]?.color.a
                    })`,
                    borderRadius: child.cornerRadius,
                  }}
                />
              </div>
            );
          } else {
            return (
              <div key={child.id}>
                <div
                  className="absolute"
                  style={{
                    width: child.absoluteBoundingBox.width,
                    height: child.absoluteBoundingBox.height,
                    left: child.absoluteBoundingBox.x,
                    top: child.absoluteBoundingBox.y,
                    border: `${child.strokeWeight}px ${
                      child.strokes[0]?.type
                    } rgba(${Math.round(
                      child.strokes[0]?.color.r * 255
                    )},${Math.round(
                      child.strokes[0]?.color.g * 255
                    )},${Math.round(child.strokes[0]?.color.b * 255)},${
                      child.fills[0]?.opacity
                        ? child.fills[0]?.opacity * child.fills[0]?.color.a
                        : child.fills[0]?.color.a
                    })`,
                    borderRadius: child.cornerRadius,
                  }}
                />
              </div>
            );
          }
        } else if (child.type === "ELLIPSE") {
          return (
            <div key={child.id}>
              <div
                className="absolute rounded-full"
                style={{
                  width: child.absoluteRenderBounds.width,
                  height: child.absoluteRenderBounds.height,
                  left: child.absoluteRenderBounds.x,
                  top: child.absoluteRenderBounds.y,
                  backgroundColor: `rgba(${Math.round(
                    child.fills[0].color.r * 255
                  )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
                    child.fills[0].color.b * 255
                  )},${
                    child.fills[0].opacity
                      ? child.fills[0].opacity * child.fills[0].color.a
                      : child.fills[0].color.a
                  })`,
                }}
              />
            </div>
          );
        } else if (child.type === "LINE") {
          return (
            <div key={child.id}>
              <div
                className="absolute"
                style={{
                  width: child.absoluteRenderBounds.width,
                  height: child.absoluteRenderBounds.height,
                  left: child.absoluteRenderBounds.x,
                  top: child.absoluteRenderBounds.y,
                  backgroundColor: `rgba(${Math.round(
                    child.strokes[0].color.r * 255
                  )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                    child.strokes[0].color.b * 255
                  )},${
                    child.strokes[0].opacity
                      ? child.strokes[0].opacity * child.strokes[0].color.a
                      : child.strokes[0].color.a
                  })`,
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
                  child.absoluteBoundingBox.width + child.style.fontSize / 4,

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
                textAlign: child.style.textAlignHorizontal.toLowerCase(),

                color: `rgba(${Math.round(
                  child.fills[0].color.r * 255
                )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
                  child.fills[0].color.b * 255
                )},${
                  child.fills[0].opacity
                    ? child.fills[0].opacity * child.fills[0].color.a
                    : child.fills[0].color.a
                })`,
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
    <div className="h-[600px]">
      {pages.length !== 0 &&
        pages
          .filter((page: any) => page.name === currentPage)[0]
          .frames.map((frame: any) => {
            if (frame.id === currentFrame) {
              return (
                <div
                  key={frame.id}
                  style={{
                    width: frame.absoluteBoundingBox.width,
                    height: frame.absoluteBoundingBox.height,
                    backgroundColor: `rgba(${Math.round(
                      frame.backgroundColor.r * 255
                    )},${Math.round(
                      frame.backgroundColor.g * 255
                    )},${Math.round(frame.backgroundColor.b * 255)},${
                      frame.backgroundColor.a
                    })`,
                  }}
                  className="absolute scale-[0.25] origin-top-left left-1/4"
                >
                  {renderChildren(frame.children)}
                </div>
              );
            }
          })}
    </div>
  );
}
