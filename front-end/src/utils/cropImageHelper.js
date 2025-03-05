// utils/cropImageHelper.js
export default function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // ตั้งค่า canvas ให้เป็นขนาด crop
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // วาดรูปลง canvas ให้ตรงกับตำแหน่ง crop
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // แปลง canvas เป็น blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg", 1);
    };

    image.onerror = (error) => reject(error);
  });
}
