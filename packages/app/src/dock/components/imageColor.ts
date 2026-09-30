/**
 * The characteristic color of a picture (an account's profile picture), for
 * the active app's glow in the rail. Pixels are weighted by saturation, so a
 * colorful jacket or background wins over a muddy average. Cached per URL;
 * resolves to null when the picture can't be read.
 */

const cache = new Map<string, Promise<string | null>>();
const SAMPLE = 24;

const extract = (url: string) => new Promise<string | null>(resolve => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onerror = () => resolve(null);
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = SAMPLE;
      canvas.height = SAMPLE;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
      const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE);

      let r = 0;
      let g = 0;
      let b = 0;
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3] / 255;
        if (alpha < 0.5) continue;
        const max = Math.max(data[i], data[i + 1], data[i + 2]);
        const min = Math.min(data[i], data[i + 1], data[i + 2]);
        const saturation = max ? (max - min) / max : 0;
        const weight = alpha * (0.1 + saturation * saturation);
        r += data[i] * weight;
        g += data[i + 1] * weight;
        b += data[i + 2] * weight;
        total += weight;
      }
      if (!total) return resolve(null);
      resolve(`rgb(${Math.round(r / total)}, ${Math.round(g / total)}, ${Math.round(b / total)})`);
    } catch (e) {
      // a picture from another origin can taint the canvas: fall back
      resolve(null);
    }
  };
  img.src = url;
});

export const getImageColor = (url: string): Promise<string | null> => {
  if (!cache.has(url)) cache.set(url, extract(url));
  return cache.get(url)!;
};
