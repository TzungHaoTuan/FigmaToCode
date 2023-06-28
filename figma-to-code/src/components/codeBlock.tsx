"use client";

import React from "react";
import { useSelector } from "react-redux";

export default function CodeBlock() {
  const pages = useSelector((state: any) => state.pages.pages);
  const currentPage = useSelector((state: any) => state.currentPage.page);
  const currentFrame = useSelector((state: any) => state.currentFrame.frame);

  // JSX
  const renderChildrenJSX = (children: any) => {
    if (!children) {
      return null;
    }

    return children.map((child: any) => {
      if (child.type === "GROUP") {
        return renderChildrenJSX(child.children);
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

  // Declare constant variable
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
