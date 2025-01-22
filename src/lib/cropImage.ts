import { Area } from "react-easy-crop";

export default async function getCroppedImg(imageSrc: File, cropArea: Area) {
  const canvas = document.createElement("canvas");
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(imageSrc);
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
  });

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg");
  });
}
