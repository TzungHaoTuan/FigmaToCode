"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function CodeBlock() {
  const [currentStyle, setCurrentStyle] = useState("Tailwind");

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
        return <div key={child.id}>{child.name}</div>;
      }
    });
  };

  // SC Tag
  const renderTagSC = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
        return renderTagSC(child.children);
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

  // SC Style
  const renderStyleSC = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP" || child.type === "INSTANCE") {
        return renderStyleSC(child.children);
      } else {
        if (child.type === "RECTANGLE") {
          return (
            <div key={child.id}>
              <div>{`const Text_${child.name} = styled.div\``}</div>
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
      <div className="flex">
        <button
          onClick={() => setCurrentStyle("Tailwind")}
          className="mx-10 px-10 border-2 border-black rounded-xl"
        >
          Tailwind
        </button>
        <button
          onClick={() => setCurrentStyle("SC")}
          className="mx-10 px-10 border-2 border-black rounded-xl"
        >
          Styled Component
        </button>
      </div>

      {/* Tailwind */}
      <div className="mx-10 px-10 border-2 border-black rounded-xl">
        {currentStyle === "Tailwind" &&
          pages.length !== 0 &&
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
        {currentStyle === "SC" && pages.length !== 0 && (
          <div>
            <div>&lt;div&gt;</div>
            {pages
              .filter((page: any) => page.name === currentPage)[0]
              .frames.map((frame: any) => {
                if (frame.id === currentFrame) {
                  return renderTagSC(frame.children);
                }
              })}
            <div>&lt;/div&gt;</div>
            <br></br>
            {pages
              .filter((page: any) => page.name === currentPage)[0]
              .frames.map((frame: any) => {
                if (frame.id === currentFrame) {
                  return renderStyleSC(frame.children);
                }
              })}
          </div>
        )}
      </div>
    </div>
  );
}
