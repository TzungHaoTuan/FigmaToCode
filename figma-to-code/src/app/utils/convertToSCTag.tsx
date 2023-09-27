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
        return `<${child.name}>${child.characters}</${child.name}>`;
      } else {
        return `<${child.name}></${child.name}>`;
      }
    }
  });
  return renderedChildren.join("\n");
}
