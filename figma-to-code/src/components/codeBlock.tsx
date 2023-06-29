"use client";

import React from "react";
import { useSelector } from "react-redux";

export default function CodeBlock() {
  const pages = useSelector((state: any) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);

  // Tailwind
  const renderTai = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
        return renderTai(child.children);
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
            bg-[rgb(${Math.round(child.fills[0].color.r * 255)},${Math.round(
                    child.fills[0].color.g * 255
                  )},${Math.round(child.fills[0].color.b * 255)}]/${
                    child.fills[0].color.a * 100
                  }] 
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
          bg-[rgb(${Math.round(child.fills[0].color.r * 255)},${Math.round(
                  child.fills[0]?.color.g * 255
                )},${Math.round(child.fills[0].color.b * 255)}]/${
                  child.fills[0]?.color.a * 100
                }] 
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
          bg-[rgb(${Math.round(child.strokes[0]?.color.r * 255)},${Math.round(
                  child.strokes[0]?.color.g * 255
                )},${Math.round(child.strokes[0]?.color.b * 255)}]/${
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
            <div>
              <div key={child.id}>
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
            bg-[rgb(${Math.round(child.fills[0].color.r * 255)},${Math.round(
                  child.fills[0].color.g * 255
                )},${Math.round(child.fills[0].color.b * 255)}]/${
                  child.fills[0].color.a * 100
                }]">${child.name}</div>`}
              </div>
              <br></br>
            </div>
          );
        }
        return <div>{child.name}</div>;
      }
    });
  };

  // SC Tag
  const renderTagSC = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP") {
        return renderTagSC(child.children);
      } else {
        return (
          <div>
            <div className="ml-4">{`<${
              child.name.length >= 3 ? child.name.slice(0, 3) : child.name
            }>${child.name}<${
              child.name.length >= 3 ? child.name.slice(0, 3) : child.name
            }>`}</div>
          </div>
        );
      }
    });
  };

  // SC Style
  const renderStyleSC = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP") {
        return renderStyleSC(child.children);
      } else {
        if (child.type === "RECTANGLE") {
          return (
            <div key={child.id}>
              <div>{`const ${
                child.name.length >= 3 ? child.name.slice(0, 3) : child.name
              } = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x};`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y};`}</div>
              <div>`</div>
              <br></br>
            </div>
          );
        } else if (child.type === "TEXT") {
          return (
            <div key={child.id}>
              <div>{`const ${
                child.name.length >= 3 ? child.name.slice(0, 3) : child.name
              } = styled.div\``}</div>
              <div className="ml-4">{` width: ${child.absoluteBoundingBox.width}px;`}</div>
              <div className="ml-4">{` height: ${child.absoluteBoundingBox.height}px;`}</div>
              <div className="ml-4">{` left: ${child.absoluteBoundingBox.x};`}</div>
              <div className="ml-4">{` top: ${child.absoluteBoundingBox.y};`}</div>
              <div>`</div>
              <br></br>
            </div>
          );
        }
        return <div>{child.name}</div>;
      }
    });
  };

  return (
    <div>
      {/* Tailwind */}
      <div className="mx-10 px-10 border-2 border-black rounded-xl">
        {pages.length !== 0 &&
          pages
            .filter((page: any) => page.name === currentPage)[0]
            .frames.map((frame: any) => {
              if (frame.id === currentFrame) {
                return renderTai(frame.children);
              }
            })}
      </div>
      {/* SC */}
      <div className="mx-10 px-10 border-2 border-black rounded-xl">
        {pages.length !== 0 && <div>&lt;div&gt;</div>}

        {pages.length !== 0 &&
          pages
            .filter((page: any) => page.name === currentPage)[0]
            .frames.map((frame: any) => {
              if (frame.id === currentFrame) {
                return renderTagSC(frame.children);
              }
            })}
        {pages.length !== 0 && <div>&lt;/div&gt;</div>}

        {pages.length !== 0 &&
          pages
            .filter((page: any) => page.name === currentPage)[0]
            .frames.map((frame: any) => {
              if (frame.id === currentFrame) {
                return renderStyleSC(frame.children);
              }
            })}
      </div>
    </div>
  );
}
