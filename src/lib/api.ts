export type ImageStyle =
  | "realistic"
  | "anime"
  | "oil"
  | "watercolor"
  | "pixel"
  | "cyberpunk";

export type ComicStyle =
  | "manga"
  | "american"
  | "ink"
  | "cartoon"
  | "picturebook";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

const stylePromptMap: Record<ImageStyle, string> = {
  realistic: "realistic, photorealistic, highly detailed, 8k uhd",
  anime: "anime style, vibrant colors, detailed illustration, studio ghibli inspired",
  oil: "oil painting, rich textures, artistic, classical master style",
  watercolor: "watercolor painting, soft colors, artistic, flowing washes",
  pixel: "pixel art, retro game style, 8-bit, dithering",
  cyberpunk: "cyberpunk, neon lights, futuristic, dystopian, blade runner style",
};

const comicStylePromptMap: Record<ComicStyle, string> = {
  manga: "manga style, Japanese comic, detailed line art, screentone shading",
  american: "American comic style, bold lines, vibrant colors, dynamic composition",
  ink: "Chinese ink wash painting, elegant brush strokes, minimalist, poetic",
  cartoon: "cartoon style, cute, colorful, playful illustration",
  picturebook: "children's picture book style, whimsical, soft colors, storybook illustration",
};

const aspectRatioMap: Record<AspectRatio, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1024, height: 576 },
  "9:16": { width: 576, height: 1024 },
  "4:3": { width: 1024, height: 768 },
};

// 生产环境直接用 Pollinations（img 标签加载无跨域限制）
// 开发环境用本地代理避免浏览器安全限制
const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3456"
  : "https://image.pollinations.ai";

export function buildImageUrl(
  prompt: string,
  style: ImageStyle,
  ratio: AspectRatio,
  seed?: number
): string {
  const styleSuffix = stylePromptMap[style];
  const fullPrompt = `${prompt}, ${styleSuffix}`;
  const { width, height } = aspectRatioMap[ratio];
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const s = seed ?? Math.floor(Math.random() * 1000000);
  return `${BASE_URL}/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${s}&nologo=true&model=flux&enhance=true`;
}

export function buildComicImageUrl(
  sceneText: string,
  style: ComicStyle,
  seed?: number
): string {
  const styleSuffix = comicStylePromptMap[style];
  const fullPrompt = `Scene illustration: ${sceneText}. ${styleSuffix}`;
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const s = seed ?? Math.floor(Math.random() * 1000000);
  return `${BASE_URL}/prompt/${encodedPrompt}?width=1024&height=1024&seed=${s}&nologo=true&model=flux&enhance=true`;
}

export function splitIntoScenes(text: string, maxScenes: number): string[] {
  const cleaned = text.trim();
  if (!cleaned) return [];

  // Try splitting by paragraphs first
  let paragraphs = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 10);

  if (paragraphs.length === 0) {
    // Fallback to sentence-based splitting
    const sentences = cleaned
      .split(/[。！？.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
    paragraphs = sentences;
  }

  if (paragraphs.length === 0) return [cleaned];

  // If too many paragraphs, merge them
  if (paragraphs.length <= maxScenes) {
    return paragraphs.slice(0, maxScenes);
  }

  const scenes: string[] = [];
  const chunkSize = Math.ceil(paragraphs.length / maxScenes);
  for (let i = 0; i < maxScenes; i++) {
    const chunk = paragraphs.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length > 0) {
      scenes.push(chunk.join(" "));
    }
  }
  return scenes;
}

export async function downloadImage(url: string, filename: string) {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error("Download failed:", e);
    window.open(url, "_blank");
  }
}
