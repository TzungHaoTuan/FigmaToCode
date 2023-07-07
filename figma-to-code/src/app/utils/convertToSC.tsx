import React from "react";

export default function convertToSCTag(children: any) {
  if (!children) {
    return null;
  }

  return children.map((child: any) => {
    if (child.type === "GROUP" || child.type === "INSTANCE") {
      return convertToSCTag(child.children);
    } else {
      return (
        <div key={child.id}>
          {child.type === "TEXT" ? (
            <div className="ml-4">
              &lt;
              {child.name}
              &gt;{child.characters}&lt;
              {child.name}
              &gt;
            </div>
          ) : (
            <div className="ml-4">{`<${child.name}><${child.name}>`}</div>
          )}
        </div>
      );
    }
  });
}
