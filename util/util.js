import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(inputURL);

      if (!response.ok) {
        console.error("Fetch failed:", response.statusText);
        return reject("Image fetch failed");
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        console.error("Invalid MIME type:", contentType);
        return reject("URL does not point to a valid image");
      }

      const buffer = await response.buffer();

      Jimp.read(buffer, (err, image) => {
        if (err || !image) {
          console.error("Jimp failed to read buffer:", err?.message || "No image returned");
          return reject("Unable to read image buffer");
        }

        const outPath = path.join(__dirname, `filtered.${Math.floor(Math.random() * 10000)}.jpg`);
        image
          .resize(256, 256)
          .quality(60)
          .greyscale()
          .write(outPath, () => {
            resolve(outPath);
          });
      });
    } catch (error) {
      console.error("Unexpected error:", error.message);
      reject("Image processing failed");
    }
  });
}

export function deleteLocalFiles(files) {
  for (const file of files) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}