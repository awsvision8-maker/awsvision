const MAX_WIDTH = 1280;
const JPEG_QUALITY = 0.72;
export const MAX_OUTPUT_BYTES = 450_000;
export const MAX_SOURCE_FILE_MB = 25;
export const MAX_SOURCE_FILE_BYTES = MAX_SOURCE_FILE_MB * 1024 * 1024;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image compression failed"))),
      "image/jpeg",
      quality
    );
  });
}

/** Resize and compress uploads so signup stays under server body limits. */
export async function compressImageFile(
  file: File,
  maxWidth = MAX_WIDTH
): Promise<{ file: File; preview: string }> {
  const img = await loadImageFromFile(file);
  const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image");

  ctx.drawImage(img, 0, 0, width, height);

  let quality = JPEG_QUALITY;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_OUTPUT_BYTES && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }

  if (blob.size > MAX_OUTPUT_BYTES) {
    throw new Error(
      `Image is still too large after compression (${Math.round(blob.size / 1024)}KB). Use a smaller photo.`
    );
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "document";
  const compressed = new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  const preview = canvas.toDataURL("image/jpeg", quality);

  return { file: compressed, preview };
}

export async function compressDataUrl(dataUrl: string, fileName: string): Promise<{ file: File; preview: string }> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], fileName, { type: blob.type || "image/jpeg" });
  return compressImageFile(file);
}
