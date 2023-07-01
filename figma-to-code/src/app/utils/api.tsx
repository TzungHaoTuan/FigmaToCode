const api = {
  hostname: "https://api.figma.com/v1/",
  async fetchData(token: string, fileKey: string): Promise<any> {
    try {
      const response = await fetch(`${this.hostname}files/${fileKey}`, {
        headers: {
          "X-Figma-Token": token,
        },
      });

      return response.json();
    } catch (error) {
      console.error("Error fetching data from Figma API:", error);
    }
  },
  async fetchImages(token: string, fileKey: string): Promise<any> {
    try {
      const response = await fetch(`${this.hostname}files/${fileKey}/images`, {
        headers: {
          "X-Figma-Token": token,
        },
      });

      return response.json();
    } catch (error) {
      console.error("Error fetching data from Figma API:", error);
    }
  },
  async fetchFrameImages(
    token: string,
    fileKey: string,
    imageId: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.hostname}images/${fileKey}?ids=${imageId}&scale=0.3`,
        {
          headers: {
            "X-Figma-Token": token,
          },
        }
      );

      return response.json();
    } catch (error) {
      console.error("Error fetching data from Figma API:", error);
    }
  },
};

export default api;
