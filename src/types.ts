export interface Frame {
    id: string;
    name: string;
    absoluteBoundingBox: ElementSize & ElementPosition;
    primaryAxisAlignItems?: string
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
    children: Frame[];
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
    color: Color
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
    primaryAxisAlignItems?: string;
    layoutMode?: string;
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
// user state
export interface State {
    user: User;
    figmaData: {
        data: FigmaData;
    };
    collect: {
        isCollecting: boolean;
        collected: boolean
    };
    convert: {
        isConverting: boolean
    }
    collection: {
        frames: CollectionFrames;
    }
}
export interface User {
    profile: {
        name: string;
        email: string;
        photo: string;
        uid: string;
        login: boolean;
    };
}
export interface FigmaData {
    name: string;
    document: {
        id: string;
        name: string;
        type: string;
        children: Page[];
    };
}

export interface CollectionFrames {
    [frameId: string]: { imagePath: string; children: Element[]; absoluteBoundingBox: { x: number, y: number }; primaryAxisAlignItems: string };
}
export interface ConvertedFrames {
    [frameId: string]: ConvertedFramesData
}
export interface ConvertedFramesData {
    imageUrl: string | null;
    tailwind: string | null;
    styledComponentsTag: string | null;
    styledComponentsStyle: string | null;
}