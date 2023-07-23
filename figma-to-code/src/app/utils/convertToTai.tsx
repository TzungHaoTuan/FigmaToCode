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
          return `<img className="w-[${child.absoluteBoundingBox.width}px] h-[${
            child.absoluteBoundingBox.height
          }px] left-[${child.absoluteBoundingBox.x}px] top-[${
            child.absoluteBoundingBox.y
          }px] ${
            child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
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
          } absolute" src="https://s3-alpha-sig.figma.com/img/dffb/20d1/a909dc365b7d46d988c5a614a7114877?Expires=1690761600&Signature=dBLHuttUrGuh~CWK96sddb6-iWZbSBxqPjJTWjsRfp3rfalgeyQtPU5rYWdd0BjQYf7wycHD0QxQP36fo1P9y46mQX-w9JHOue6hPyRdCPev4ECZ7sQwUgDqBYt3ya2jB2hePctqh5KCP2o4e-u23IScoFaGGbK9wvcssPndVbjUWyx30VyScP7Mt5w0ANB50pLbmox-PtrLUB~OxWmBidFZcPIsoE~EPOhy31CuIdV0sJ1otyo3ttQhPuwsTuvnzN-iKp6V4AZ6wxNTWJAeHUF1P2MotIUFVSxT3Cf7exPZ130MWlamxAwam-uNj65-XgZWvLZn0PFSWVtpTItnNw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"/>`;
        } else if (child.fills[0]?.type === "SOLID") {
          return `<div className="w-[${child.absoluteBoundingBox.width}px] h-[${
            child.absoluteBoundingBox.height
          }px] left-[${Math.round(
            child.absoluteBoundingBox.x
          )}px] top-[${Math.round(
            child.absoluteBoundingBox.y
          )}px] bg-[rgb(${Math.round(
            child.fills[0].color.r * 255
          )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
            child.fills[0].color.b * 255
          )})] ${
            child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
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
          return `<div className="w-[${child.absoluteBoundingBox.width}px] h-[${
            child.absoluteBoundingBox.height
          }px] ml-[${child.absoluteBoundingBox.x}px] mt-[${
            child.absoluteBoundingBox.y
          }px] ${
            child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
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
        return `<div className="rounded-full w-[${
          child.absoluteBoundingBox.width
        }px] h-[${child.absoluteBoundingBox.height}px] ml-[${
          child.absoluteBoundingBox.x
        }px] mt-[${child.absoluteBoundingBox.y}px] bg-[rgb(${Math.round(
          child.fills[0]?.color?.r * 255
        )},${Math.round(child.fills[0]?.color?.g * 255)},${Math.round(
          child.fills[0]?.color?.b * 255
        )}]/${child.fills[0]?.color?.a * 100}] ${
          child.cornerRadius ? `rounded-[${child.cornerRadius}px]` : ""
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
        return `<div className="w-[${
          Math.round(child.absoluteBoundingBox.width * 10) / 10
        }px] h-[${
          Math.round(child.absoluteBoundingBox.height * 10) / 10
        }px] ml-[${child.absoluteBoundingBox.x}px] mt-[${
          child.absoluteBoundingBox.y
        }px] bg-[rgb(${Math.round(
          child.strokes[0]?.color.r * 255
        )},${Math.round(child.strokes[0]?.color.g * 255)},${Math.round(
          child.strokes[0]?.color.b * 255
        )})/${
          child.strokes[0]?.opacity
            ? child.strokes[0]?.opacity * child.strokes[0]?.color.a * 100
            : child.strokes[0]?.color.a * 100
        }]absolute"></div>`;
      } else if (child.type === "TEXT") {
        return `<div className="w-[${child.absoluteBoundingBox.width}px] h-[${
          child.absoluteBoundingBox.height
        }px] left-[${child.absoluteBoundingBox.x}px] top-[${
          child.absoluteBoundingBox.y
        }px] font-['${child.style.fontFamily}'] ${
          child.style.italic ? "italic" : ""
        } font-[${child.style.fontWeight}] text-[${
          child.style.fontSize
        }px] leading-[${Math.round(child.style.lineHeightPx * 10) / 10}px] ${
          child.style.letterSpacing
            ? `tracking-[${Math.round(child.style.letterSpacing * 10) / 10}px]`
            : ""
        } text-[${child.style.textAlignHorizontal.toLowerCase()}] text-[rgb(${Math.round(
          child.fills[0].color.r * 255
        )},${Math.round(child.fills[0].color.g * 255)},${Math.round(
          child.fills[0].color.b * 255
        )})] absolute">${child.characters}</div>`;
      }
    }
  });
  return renderedChildren.join("\n");
}
