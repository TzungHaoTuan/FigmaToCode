"use client";

import React from "react";
import { useSelector } from "react-redux";

export default function CodeBlock() {
  const pages = useSelector((state: any) => state.pages.pages);
  console.log(pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  console.log(currentPage);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);
  console.log(currentFrame);

  // JSX
  const renderChildrenJSX = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
        return renderChildrenJSX(child.children);
      } else {
        return (
          <div key={child.id}>
            {child.type === "TEXT" ? (
              <div className="ml-4">{`<${child.name.slice(0, 2)}>${
                child.characters
              }<${child.name.slice(0, 2)}>`}</div>
            ) : (
              <div className="ml-4">{`<${child.name}><${child.name}>`}</div>
            )}
          </div>
        );
      }
    });
  };

  // Declare constant variable
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
                <div>{`const ${child.name} = styled.img\``}</div>
                <div className="ml-4">{` background-image: url("Your-image-url.jpg");`}</div>
                <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
                <div className="ml-4">{` height: ${Math.round(
                  child.absoluteBoundingBox.height
                )}px;`}</div>
                <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
                <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
                {child.cornerRadius ? (
                  <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
                ) : (
                  ""
                )}
                {child.strokes.length !== 0 ? (
                  <div className="ml-4">{`border: ${child.strokeWeight}px 
              ${child.strokes[0].type.toLowerCase()} 
              rgba(
                ${Math.round(child.strokes[0].color.r * 255)},
                ${Math.round(child.strokes[0].color.g * 255)},
                ${Math.round(child.strokes[0].color.b * 255)},
                ${child.strokes[0].color.a})
                `}</div>
                ) : (
                  ""
                )}
                <div>`</div>
                <br></br>
              </div>
            );
          } else if (child.fills[0]?.type === "SOLID") {
            return (
              <div key={child.id}>
                <div>{`const ${child.name} = styled.div\``}</div>
                <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
                <div className="ml-4">{` height: ${Math.round(
                  child.absoluteBoundingBox.height
                )}px;`}</div>
                <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
                <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
                <div className="ml-4">
                  {`backgroundColor: rgba(${Math.round(
                    child.fills[0]?.color.r * 255
                  )},
                ${Math.round(child.fills[0]?.color.g * 255)},
                ${Math.round(child.fills[0]?.color.b * 255)},
                ${
                  child.fills[0].opacity
                    ? child.fills[0].opacity * child.fills[0].color.a
                    : child.fills[0].color.a
                })`}
                </div>
                {child.cornerRadius ? (
                  <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
                ) : (
                  ""
                )}
                {child.strokes.length !== 0 ? (
                  <div className="ml-4">{`border: ${child.strokeWeight}px 
              ${child.strokes[0].type.toLowerCase()} 
              rgba(
                ${Math.round(child.strokes[0].color.r * 255)},
                ${Math.round(child.strokes[0].color.g * 255)},
                ${Math.round(child.strokes[0].color.b * 255)},
                ${child.strokes[0].color.a})
                `}</div>
                ) : (
                  ""
                )}
                <div>`</div>
                <br></br>
              </div>
            );
          } else {
            return (
              <div key={child.id}>
                <div>{`const ${child.name} = styled.div\``}</div>
                <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
                <div className="ml-4">{` height: ${Math.round(
                  child.absoluteBoundingBox.height
                )}px;`}</div>
                <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
                <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
                {child.cornerRadius ? (
                  <div className="ml-4">{`border-radius: ${child.cornerRadius}px`}</div>
                ) : (
                  ""
                )}
                {child.strokes.length !== 0 ? (
                  <div className="ml-4">{`border: ${child.strokeWeight}px 
              ${child.strokes[0].type.toLowerCase()} 
              rgba(
                ${Math.round(child.strokes[0].color.r * 255)},
                ${Math.round(child.strokes[0].color.g * 255)},
                ${Math.round(child.strokes[0].color.b * 255)},
                ${child.strokes[0].color.a})
                `}</div>
                ) : (
                  ""
                )}
                <div>`</div>
                <br></br>
              </div>
            );
          }
        } else if (child.type === "ELLIPSE") {
          return (
            <div key={child.id}>
              <div>{`const Text_${child.name.slice(0, 2)} = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
              <div className="ml-4">{` border-radius: 50%;`}</div>
              <div className="ml-4">
                {` backgroundColor: rgba(${Math.round(
                  child.fills[0]?.color.r * 255
                )},
                ${Math.round(child.fills[0]?.color.g * 255)},
                ${Math.round(child.fills[0]?.color.b * 255)},
                ${
                  child.fills[0].opacity
                    ? child.fills[0].opacity * child.fills[0].color.a
                    : child.fills[0].color.a
                })`}
              </div>
              {child.strokes.length !== 0 && (
                <div className="ml-4">
                  {`border: 
                ${child.strokeWeight}px 
                ${child.strokes[0].type.toLowerCase()} 
                  rgba(
                    ${Math.round(child.strokes[0].color.r * 255)},
                    ${Math.round(child.strokes[0].color.g * 255)},
                    ${Math.round(child.strokes[0].color.b * 255)},
                    ${child.strokes[0].color.a})`}
                </div>
              )}
              <div>`</div>
              <br></br>
            </div>
          );
        } else if (child.type === "LINE") {
          return (
            <div key={child.id}>
              <div>{`const Text_${child.name} = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
              <div className="ml-4">
                {` backgroundColor: rgba(${Math.round(
                  child.strokes[0]?.color.r * 255
                )},
                ${Math.round(child.strokes[0]?.color.g * 255)},
                ${Math.round(child.strokes[0]?.color.b * 255)},
                ${
                  child.strokes[0].opacity
                    ? child.strokes[0].opacity * child.strokes[0].color.a
                    : child.strokes[0].color.a
                })`}
              </div>
              <div>`</div>
              <br></br>
            </div>
          );
        } else if (child.type === "TEXT") {
          return (
            <div key={child.id}>
              <div>{`const Text_${child.name.slice(0, 2)} = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x}px;`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y}px;`}</div>
              <div className="ml-4">{` font-family: ${child.style.fontFamily};`}</div>
              {child.style.italic && (
                <div className="ml-4">{` font-style: italic;`}</div>
              )}
              <div className="ml-4">{` font-weight: ${child.style.fontWeight};`}</div>
              <div className="ml-4">{` font-size: ${child.style.fontSize}px;`}</div>
              <div className="ml-4">{` line-height: ${
                Math.round(child.style.lineHeightPx * 10) / 10
              }px;`}</div>
              {child.style.letterSpacing !== 0 && (
                <div className="ml-4">{` letter-spacing: ${
                  Math.round(child.style.letterSpacing * 10) / 10
                }px;`}</div>
              )}
              <div className="ml-4">{` text-align: ${child.style.textAlignHorizontal.toLowerCase()};`}</div>
              <div className="ml-4">
                {` color: rgba(
                ${Math.round(child.fills[0].color.r * 255)},
                ${Math.round(child.fills[0].color.g * 255)},
                ${Math.round(child.fills[0].color.b * 255)},
                ${child.fills[0].color.a})`}
              </div>
              <div>`</div>
              <br></br>
            </div>
          );
        }
        return <div key={child.id}>{child.name}</div>;
      }
    });
  };

  return (
    <div>
      {pages.length !== 0 && <div>&lt;div&gt;</div>}

      {pages.length !== 0 &&
        pages
          .filter((page: any) => page.name === currentPage)[0]
          .frames.map((frame: any) => {
            if (frame.id === currentFrame) {
              return renderChildrenJSX(frame.children);
            }
          })}
      {pages.length !== 0 && <div>&lt;/div&gt;</div>}

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
