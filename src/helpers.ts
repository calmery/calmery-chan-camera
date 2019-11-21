import { CANVAS_LAYER_KIND, ICanvasLayer } from "./types/CanvasLayer";

export const convertSvgToDataUrl = (
  svgText: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const svg = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    const image = new Image();

    image.onerror = () => reject();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (context === null) {
        return reject();
      }

      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };

    image.src = url;
  });
};

export const download = (name: string, body: string) => {
  const a = document.createElement("a");
  a.href = body;
  a.download = name;
  a.click();
};

export const convertUrlToLayer = (
  kind: CANVAS_LAYER_KIND,
  imageUrl: string
): Promise<ICanvasLayer> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      let { width, height } = image;

      // あまりにも画像サイズが大きいと出力の段階で落ちるので 1500px に落とす
      if (width > 1500 || height > 1500) {
        if (width > height) {
          height = 1500 / (width / height);
          width = 1500;
        } else {
          width = 1500 / (height / width);
          height = 1500;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (context === null) {
        return reject();
      }

      context.drawImage(image, 0, 0, width, height);

      resolve({
        kind,
        base64: canvas.toDataURL("image/png"),
        width,
        height,
        x: 0,
        y: 0,
        effects: {
          scale: 1,
          rotate: 0
        }
      });
    };

    image.src = imageUrl;
  });
};