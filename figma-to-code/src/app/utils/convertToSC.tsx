import React from "react";

export default function convertToSCTag(children: any) {
  if (!children) {
    return null;
  }

  const renderedChildren = children.flatMap((child: any) => {
    if (
      child.type === "GROUP" ||
      child.type === "INSTANCE" ||
      child.type === "FRAME"
    ) {
      return convertToSCTag(child.children);
    } else {
      return (
        <div key={child.id}>
          {child.type === "TEXT" ? (
            <div className="ml-4">
              &lt;
              {child.name.slice(0, 4)}
              &gt;{child.characters}&lt;
              {child.name.slice(0, 4)}
              &gt;
            </div>
          ) : (
            <div className="ml-4">{`<${child.name.slice(
              0,
              4
            )}><${child.name.slice(0, 4)}>`}</div>
          )}
        </div>
      );
    }
  });
  return renderedChildren;
}
