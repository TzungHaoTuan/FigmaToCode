import React from "react";

export default function convertToTai(children: any) {
  if (!children) {
    return null;
  }

  return children.map((child: any) => {
    if (child.type === "GROUP" || child.type === "INSTANCE") {
      return convertToTai(child.children);
    } else {
      if (child.type === "RECTANGLE") {
        if (child.fills[0]?.type === "IMAGE") {
          return (
            <div key={child.id}>
              <div>
                {`<img src="Your image path!"
                      className="
                absolute 
                w-[${child.absoluteBoundingBox.width}px] 
                h-[${child.absoluteBoundingBox.height}px] 
                ml-[${child.absoluteBoundingBox.x}px] 
                mt-[${child.absoluteBoundingBox.y}px] 
                ${
                  child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
                } 
                ${
                  child.strokes.length !== 0
                    ? `border-[${child.strokeWeight}px] 
                  border-${child.strokes[0].type.toLowerCase()}
                  border-[rgb(${Math.round(
                    child.strokes[0].color.r * 255
                  )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                        child.strokes[0].color.b * 255
                      )}]/${child.strokes[0].color.a * 100}]
                  `
                    : ""
                }" />`}
              </div>
              <br></br>
            </div>
          );
        } else if (child.fills[0]?.type === "SOLID") {
          return (
            <div key={child.id}>
              <div>
                {`<div className="
                absolute 
                w-[${child.absoluteBoundingBox.width}px] 
                h-[${child.absoluteBoundingBox.height}px] 
                ml-[${child.absoluteBoundingBox.x}px] 
                mt-[${child.absoluteBoundingBox.y}px] 
                bg-[rgb(${Math.round(
                  child.fills[0].color.r * 255
                )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
                  child.fills[0].color.b * 255
                )}]/${child.fills[0].color.a * 100}] 
                ${child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""}
                ${
                  child.strokes.length !== 0
                    ? `border-[${child.strokeWeight}px] 
                  border-${child.strokes[0].type.toLowerCase()}
                  border-[rgb(${Math.round(
                    child.strokes[0].color.r * 255
                  )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                        child.strokes[0].color.b * 255
                      )}]/${child.strokes[0].color.a * 100}]
                  `
                    : ""
                }">${child.name}
                </div>`}
              </div>
              <br></br>
            </div>
          );
        } else {
          return (
            <div key={child.id}>
              <div>
                {`<div className="
                      absolute 
                      w-[${child.absoluteBoundingBox.width}px] 
                      h-[${child.absoluteBoundingBox.height}px] 
                      ml-[${child.absoluteBoundingBox.x}px] 
                      mt-[${child.absoluteBoundingBox.y}px] 
                      ${
                        child.cornerRadius
                          ? `rounded-[${child.cornerRadius}px]`
                          : ""
                      }
                      ${
                        child.strokes.length !== 0
                          ? `border-[${child.strokeWeight}px] 
                        border-${child.strokes[0].type.toLowerCase()}
                        border-[rgb(${Math.round(
                          child.strokes[0].color.r * 255
                        )},${Math.round(
                              child.strokes[0].color.g * 255
                            )},${Math.round(child.strokes[0].color.b * 255)}]/${
                              child.strokes[0].color.a * 100
                            }]
                        `
                          : ""
                      }">${child.name}</div>`}
              </div>
              <br></br>
            </div>
          );
        }
      } else if (child.type === "ELLIPSE") {
        return (
          <div key={child.id}>
            <div>
              {`<div className="
              absolute 
              rounded-full 
              w-[${child.absoluteBoundingBox.width}px] 
              h-[${child.absoluteBoundingBox.height}px] 
              ml-[${child.absoluteBoundingBox.x}px] 
              mt-[${child.absoluteBoundingBox.y}px] 
              bg-[rgb(${Math.round(child.fills[0]?.color.r * 255)},${Math.round(
                child.fills[0]?.color.g * 255
              )},${Math.round(child.fills[0]?.color.b * 255)}]/${
                child.fills[0]?.color.a * 100
              }] 
                    ${
                      child.cornerRadius
                        ? `rounded-[${child.cornerRadius}px]`
                        : ""
                    }
                    ${
                      child.strokes.length !== 0
                        ? `border-[${child.strokeWeight}px] 
                      border-${child.strokes[0].type.toLowerCase()}
                      border-[rgb(${Math.round(
                        child.strokes[0].color.r * 255
                      )},${Math.round(
                            child.strokes[0].color.g * 255
                          )},${Math.round(child.strokes[0].color.b * 255)}]/${
                            child.strokes[0].color.a * 100
                          }]
                      `
                        : ""
                    }">${child.name}</div>`}
            </div>
            <br></br>
          </div>
        );
      } else if (child.type === "LINE") {
        return (
          <div key={child.id}>
            <div>
              {`<div className="
              absolute 
              w-[${child.absoluteBoundingBox.width}px] 
              h-[${child.absoluteBoundingBox.height}px] 
              ml-[${child.absoluteBoundingBox.x}px] 
              mt-[${child.absoluteBoundingBox.y}px] 
              bg-[rgb(${Math.round(
                child.strokes[0]?.color.r * 255
              )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
                child.strokes[0]?.color.b * 255
              )}]/${
                child.strokes[0].opacity
                  ? child.strokes[0].opacity * child.strokes[0].color.a * 100
                  : child.strokes[0].color.a * 100
              }]">${child.name}</div>`}
            </div>
            <br></br>
          </div>
        );
      } else if (child.type === "TEXT") {
        return (
          <div key={child.id}>
            <div>
              {`<div className="
                absolute 
                w-[${child.absoluteBoundingBox.width}px] 
                h-[${child.absoluteBoundingBox.height}px] 
                ml-[${child.absoluteBoundingBox.x}px] 
                mt-[${child.absoluteBoundingBox.y}px] 
                font-["${child.style.fontFamily}"] 
                ${child.style.italic ? "italic" : ""} 
                font-[${child.style.fontWeight}] 
                text-[${child.style.fontSize}px] 
                leading-[${Math.round(child.style.lineHeightPx * 10) / 10}px]
                ${
                  child.style.letterSpacing
                    ? `tracking-[${
                        Math.round(child.style.letterSpacing * 10) / 10
                      }px]`
                    : ""
                }
                text-[${child.style.textAlignHorizontal.toLowerCase()}] 
                bg-[rgb(${Math.round(
                  child.fills[0].color.r * 255
                )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
                child.fills[0].color.b * 255
              )}]/${child.fills[0].color.a * 100}]">${child.name}</div>`}
            </div>
            <br></br>
          </div>
        );
      }
      return <div key={child.id}>{child.name}</div>;
    }
  });
}
