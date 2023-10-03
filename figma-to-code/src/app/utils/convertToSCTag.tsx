import { Element, ElementType } from "@/types";

export default function convertToSCTag(
  children: Element[] | undefined
): string | null {
  if (!children) {
    return null;
  }
  const renderedChildren = children.flatMap((child: Element) => {
    switch (child.type) {
      case ElementType.GROUP:
      case ElementType.INSTANCE:
      case ElementType.FRAME:
        return convertToSCTag(child.children);
      case ElementType.TEXT:
        return `<${child.name}>${child.characters}</${child.name}>`;
      default:
        return `<${child.name}></${child.name}>`;
    }
  });
  const styledComponentsTag = renderedChildren.filter(
    (child) => child !== null
  );
  return styledComponentsTag.length > 0 ? styledComponentsTag.join("\n") : null;
}
