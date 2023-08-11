import React from "react";

export default function ConvertToTai(children: any) {
  if (!children) {
    return null;
  }

  const renderedChildren = children.flatMap((child: any) => {
    if (
      child.type === "GROUP" ||
      child.type === "INSTANCE" ||
      child.type === "FRAME"
    ) {
      return ConvertToTai(child.children);
    } else {
      if (child.type === "RECTANGLE") {
        if (child.fills[0]?.type === "IMAGE") {
          return `<img className="w-[${Math.round(
            child.absoluteBoundingBox.width
          )}px] h-[${Math.round(
            child.absoluteBoundingBox.height
          )}px] left-[${Math.round(
            child.absoluteBoundingBox.x
          )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px] ${
            child.cornerRadius
              ? `rounded-[${Math.round(child.cornerRadius)}px]`
              : ""
          } ${
            child.strokes.length !== 0
              ? `border-[${
                  child.strokeWeight
                }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                  child.strokes[0].color.r * 255
                )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                  child.strokes[0].color.b * 255
                )})]`
              : ""
          } absolute"/>`;
        } else if (child.fills[0]?.type === "SOLID") {
          return `<div className="w-[${Math.round(
            child.absoluteBoundingBox.width
          )}px] h-[${Math.round(
            child.absoluteBoundingBox.height
          )}px] left-[${Math.round(
            child.absoluteBoundingBox.x
          )}px] top-[${Math.round(
            child.absoluteBoundingBox.y
          )}px] bg-[rgb(${Math.round(
            child.fills[0].color.r * 255
          )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
            child.fills[0].color.b * 255
          )})] ${
            child.cornerRadius
              ? `rounded-[${Math.round(child.cornerRadius)}px]`
              : ""
          } ${
            child.strokes.length !== 0
              ? `border-[${
                  child.strokeWeight
                }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                  child.strokes[0].color.r * 255
                )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                  child.strokes[0].color.b * 255
                )})]`
              : ""
          } absolute"></div>`;
        } else {
          return `<div className="w-[${Math.round(
            child.absoluteBoundingBox.width
          )}px] h-[${Math.round(
            child.absoluteBoundingBox.height
          )}px] left-[${Math.round(
            child.absoluteBoundingBox.x
          )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px] 
          ${
            child.cornerRadius
              ? `rounded-[${Math.round(child.cornerRadius)}px]`
              : ""
          } ${
            child.strokes.length !== 0
              ? `border-[${
                  child.strokeWeight
                }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                  child.strokes[0].color.r * 255
                )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                  child.strokes[0].color.b * 255
                )})]`
              : ""
          }absolute"></div>`;
        }
      } else if (child.type === "ELLIPSE") {
        return `<div className="w-[${Math.round(
          child.absoluteBoundingBox.width
        )}px] h-[${Math.round(
          child.absoluteBoundingBox.height
        )}px] left-[${Math.round(
          child.absoluteBoundingBox.x
        )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px] rounded-full ${
          child.strokes.length
            ? `bg-[rgb(${Math.round(
                child.fills[0]?.color?.r * 255
              )},${Math.round(child.fills[0]?.color?.g * 255)},${Math.round(
                child.fills[0]?.color?.b * 255
              )}]/${child.fills[0]?.color?.a * 100}]`
            : ""
        } ${
          child.cornerRadius
            ? `rounded-[${Math.round(child.cornerRadius)}px]`
            : ""
        } ${
          child.strokes.length !== 0
            ? `border-[${
                child.strokeWeight
              }px] border-${child.strokes[0].type.toLowerCase()} border-[rgb(${Math.round(
                child.strokes[0].color.r * 255
              )},${Math.round(child.strokes[0].color.g * 255)},${Math.round(
                child.strokes[0].color.b * 255
              )})]`
            : ""
        }absolute"></div>`;
      } else if (child.type === "LINE" || child.type === "VECTOR") {
        return `<div className="w-[${Math.round(
          child.absoluteBoundingBox.width
        )}px] h-[${Math.round(
          child.absoluteBoundingBox.height
        )}px] left-[${Math.round(
          child.absoluteBoundingBox.x
        )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px] ${
          child.strokes.length
            ? `bg-[rgb(${Math.round(
                child.strokes[0]?.color.r * 255
              )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
                child.strokes[0]?.color.b * 255
              )})/${
                child.strokes[0]?.opacity
                  ? child.strokes[0]?.opacity * child.strokes[0]?.color.a * 100
                  : child.strokes[0]?.color.a * 100
              }]`
            : ""
        } absolute"></div>`;
      } else if (child.type === "TEXT") {
        return `<div className="w-[${Math.round(
          child.absoluteBoundingBox.width
        )}px] h-[${Math.round(
          child.absoluteBoundingBox.height
        )}px] left-[${Math.round(
          child.absoluteBoundingBox.x
        )}px] top-[${Math.round(child.absoluteBoundingBox.y)}px] font-['${
          child.style.fontFamily
        }'] ${child.style.italic ? "italic" : ""} font-[${
          child.style.fontWeight
        }] text-[${child.style.fontSize}px] leading-[${
          Math.round(child.style.lineHeightPx * 10) / 10
        }px] ${
          child.style.letterSpacing
            ? `tracking-[${Math.round(child.style.letterSpacing * 10) / 10}px]`
            : ""
        } text-${child.style.textAlignHorizontal.toLowerCase()} text-[rgb(${Math.round(
          child.fills[0].color.r * 255
        )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
          child.fills[0].color.b * 255
        )})] absolute">\n  ${child.characters}\n</div>`;
      }
    }
  });
  return renderedChildren.join("\n");
}
