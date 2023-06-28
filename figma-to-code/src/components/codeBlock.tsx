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

  console.log(pages[0].frames[0].children);

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
            <div>
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
            <div>
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
