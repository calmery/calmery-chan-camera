import { CANVAS_LAYER_KIND, ICanvasLayer } from "./types/CanvasLayer";

const convertDataUrlToBlob = (dataUrl: string) => {
  const type = dataUrl
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  const decodedData = atob(dataUrl.split(",")[1]);
  const buffer = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    buffer[i] = decodedData.charCodeAt(i);
  }
  return new Blob([buffer.buffer], { type });
};

export const convertSvgToDataUrl = (
  svgText: string,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const svg = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    const image = new Image();
    const errorMessage =
      "画像の変換に失敗したよ！\n何度も失敗するときは教えてね...！";

    image.onerror = () => reject(errorMessage);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (context === null) {
        return reject(errorMessage);
      }

      context.drawImage(image, 0, 0, width, height);
      const blob = convertDataUrlToBlob(canvas.toDataURL("image/png"));
      resolve(URL.createObjectURL(blob));
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

    image.onerror = () => reject(null);
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

      if (width < 418 || height < 418) {
        return reject(
          "画像のサイズが小さすぎるよ！\n縦横 600px 以上の画像を使ってね！"
        );
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (context === null) {
        return reject(null);
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
