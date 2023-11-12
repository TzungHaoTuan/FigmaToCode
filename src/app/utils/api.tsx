interface Images {
  [imageId: string]: string;
}
interface FrameImages {
  [imageId: string]: string;
}
interface File {
  name: string;
  document: {
    children: Page[];
  };
}
interface Page {
  id: string;
  name: string;
  children: Frame[];
}
interface Frame {
  id: string;
  name: string;
  children: object[];
}
const api = {
  hostname: "https://api.figma.com/v1/",
  async fetchData(token: string, fileKey: string): Promise<File> {
    try {
      const response = await fetch(`${this.hostname}files/${fileKey}`, {
        headers: {
          "X-Figma-Token": token,
        },
      });
      const result = await response.json();
      const file = {
        name: result.name,
        document: result.document,
      };
      return file;
    } catch (error) {
      console.error("Error fetching data from Figma API:", error);
      throw error;
    }
  },
  async fetchImages(token: string, fileKey: string): Promise<Images> {
    try {
      const response = await fetch(`${this.hostname}files/${fileKey}/images`, {
        headers: {
          "X-Figma-Token": token,
        },
      });
      const result = await response.json();
      const images = await result.meta.images;
      return images;
    } catch (error) {
      console.error("Error fetching data from Figma API:", error);
      throw error;
    }
  },
  async fetchFrameImages(
    token: string,
    fileKey: string,
    frameId: string
  ): Promise<FrameImages> {
    try {
      const response = await fetch(
        `${this.hostname}images/${fileKey}?ids=${frameId}`,
        {
          headers: {
            "X-Figma-Token": token,
          },
        }
      );
      const result = await response.json();
      const frameImages = result.images;
      return frameImages;
    } catch (error) {
      console.error("Error fetching data from Figma API:", error);
      throw error;
    }
  },
};

export default api;
