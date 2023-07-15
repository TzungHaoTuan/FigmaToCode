import React from "react";

export default function ConvertToSCTag(children: any) {
  if (!children) {
    return null;
  }

  const renderedChildren = children.flatMap((child: any) => {
    if (
      child.type === "GROUP" ||
      child.type === "INSTANCE" ||
      child.type === "FRAME"
    ) {
      return ConvertToSCTag(child.children);
    } else {
      if (child.type === "TEXT") {
        return `<${child.name.slice(0, 4)}>${
          child.characters
        }</${child.name.slice(0, 4)}>`;
      } else {
        return `<${child.name.slice(0, 4)}></${child.name.slice(0, 4)}>`;
      }
    }
  });
  return renderedChildren.join("\n");
}
