export interface Frame {
    id: string;
    name: string;
    children: Element[];
}

export interface Pages {
    pages: {
        pages: Page[];
    };
}
export interface Page {
    id: string;
    name: string;
    frames: Frame[];
}
export interface CurrentPage {
    currentPage: {
        page: string;
    };
}
export interface CurrentFrame {
    currentFrame: {
        frame: {
            id: string;
            name: string;
        };
    };
}
export interface frameImages {
    frameImages: Images;
}
export interface Images {
    images: Image[];
}
export interface Image {
    page: string;
    id: string;
    url: string;
}
export interface IsConverting {
    convert: {
        isConverting: boolean;
    };
}
//
export enum ElementType {
    GROUP = "GROUP",
    INSTANCE = "INSTANCE",
    FRAME = "FRAME",
    TEXT = "TEXT",
    RECTANGLE = "RECTANGLE",
    ELLIPSE = "ELLIPSE",
    LINE = "LINE",
    VECTOR = "VECTOR"
}
export interface ElementFill {
    type: string
    imageRef?: string
    color?: Color
}
export interface ElementSize {
    width: number
    height: number
}
export interface ElementPosition {
    x: number
    y: number
}
export interface ElementStroke {
    type: string
    color: Color
    opacity?: number
}
export interface ElementFontStyle {
    fontFamily: string
    fontWeight: number
    fontSize: number
    lineHeightPx: number
    letterSpacing: number
    textAlignHorizontal: string
    italic?: boolean
}
export interface Element {
    id: string;
    name: string;
    type: ElementType;
    absoluteBoundingBox: ElementSize & ElementPosition
    fills: ElementFill[];
    strokeWeight: number
    strokes: ElementStroke[]
    style?: ElementFontStyle;
    characters?: string;
    cornerRadius?: number;
    children?: Element[];
}
export interface Color {
    r: number
    g: number
    b: number
    a: number
}
//
export interface Tag {
    tag: {
        tags: {
            [ElementId: string]: string;
        };
    };
}
export interface CodeStatus {
    codeState: {
        state: boolean;
        style: string;
        isToggle: boolean;
    };
}