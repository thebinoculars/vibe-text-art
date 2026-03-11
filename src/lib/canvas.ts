export interface GenerationSettings {
  width: number;
  height: number;
  lyrics: string;
  lineSeparator: string;
  bgColor: string;
  brightness: number;
  contrast: number;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  maintainAspectRatio: boolean;
}

export async function generateTextPoster(
  canvas: HTMLCanvasElement,
  imgSrc: string,
  settings: GenerationSettings
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return reject(new Error("Could not get 2D context"));

    const {
      width,
      height,
      lyrics,
      lineSeparator,
      bgColor,
      brightness,
      contrast,
      fontFamily,
      fontSize,
      lineHeight,
    } = settings;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Calculate actual canvas size based on image aspect ratio fitting within width/height
      const scale = Math.min(width / img.width, height / img.height);
      const actualWidth = Math.round(img.width * scale);
      const actualHeight = Math.round(img.height * scale);

      // Set canvas to actual image size (not the frame size)
      canvas.width = actualWidth;
      canvas.height = actualHeight;

      // 1. Create offscreen canvas to process the original image
      const offscreen = document.createElement("canvas");
      offscreen.width = actualWidth;
      offscreen.height = actualHeight;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return reject(new Error("Could not get offscreen context"));

      // 2. Apply Brightness and Contrast
      offCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

      // 3. Draw image filling the entire canvas
      offCtx.drawImage(img, 0, 0, actualWidth, actualHeight);

      // 4. Extract pixel data
      const imgData = offCtx.getImageData(0, 0, actualWidth, actualHeight).data;

      // 5. Fill main canvas with background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, actualWidth, actualHeight);

      // 6. Format text string
      const rawText = lyrics.trim();
      // Split by newline, join with separator, remove double spaces
      const formattedText = rawText
        .split(/\r?\n/)
        .join(lineSeparator)
        .replace(/\s+/g, " ")
        .trim();
      
      // Add space at the end to separate when looping
      const textToUse = formattedText.length > 0 ? formattedText + " " : "TEXT ";

      // 7. Configure Typography
      ctx.font = `600 ${fontSize}px "${fontFamily}", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 8. Draw character by character
      const charStepX = fontSize * 0.45;
      const charStepY = lineHeight;

      let charIdx = 0;

      for (let y = charStepY / 2; y < actualHeight; y += charStepY) {
        for (let x = charStepX / 2; x < actualWidth; x += charStepX) {
          const px = Math.floor(x);
          const py = Math.floor(y);
          
          // bounds check
          if (px >= actualWidth || py >= actualHeight) continue;

          // 1D array index for RGBA
          const i = (py * actualWidth + px) * 4;

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Skip completely transparent pixels to save rendering time
          if (a > 0) {
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            const char = textToUse[charIdx % textToUse.length];
            ctx.fillText(char, x, y);
            charIdx++;
          }
        }
      }

      resolve();
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imgSrc;
  });
}
