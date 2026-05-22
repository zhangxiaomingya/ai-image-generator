import { useState, useCallback } from "react";
import { Wand2, Download, Loader2, ImageOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildImageUrl,
  downloadImage,
  type ImageStyle,
  type AspectRatio,
} from "@/lib/api";

const styles: { value: ImageStyle; label: string }[] = [
  { value: "realistic", label: "写实" },
  { value: "anime", label: "动漫" },
  { value: "oil", label: "油画" },
  { value: "watercolor", label: "水彩" },
  { value: "pixel", label: "像素风" },
  { value: "cyberpunk", label: "赛博朋克" },
];

const ratios: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "1:1" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "4:3", label: "4:3" },
];

export default function SingleImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("realistic");
  const [ratio, setRatio] = useState<AspectRatio>("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [seed, setSeed] = useState<number>(0);

  const generate = useCallback(() => {
    if (!prompt.trim()) return;
    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);
    setLoading(true);
    setError(false);
    setImageUrl(null);
    // 短暂延迟确保状态重置后再设置新 URL
    setTimeout(() => {
      setImageUrl(buildImageUrl(prompt, style, ratio, newSeed));
    }, 50);
  }, [prompt, style, ratio]);

  const handleDownload = useCallback(() => {
    if (imageUrl) {
      downloadImage(imageUrl, `lingxi-image-${seed}.jpg`);
    }
  }, [imageUrl, seed]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6">
            <Card className="glass glow-border">
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    图片描述
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="描述你想生成的画面，例如：一片樱花盛开的山谷，阳光透过花瓣洒落，远处有古老的日式神社..."
                    className="w-full h-32 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">
                    画面风格
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {styles.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setStyle(s.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          style === s.value
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 text-foreground">
                    图片比例
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ratios.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setRatio(r.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          ratio === r.value
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generate}
                    disabled={!prompt.trim() || loading}
                    variant="glow"
                    size="lg"
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5 mr-2" />
                    )}
                    {loading ? "生成中..." : "生成图片"}
                  </Button>
                  {imageUrl && !loading && (
                    <Button
                      onClick={generate}
                      variant="outline"
                      size="lg"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      重新生成
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            <Card className="glass glow-border h-full min-h-[400px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    生成结果
                  </h3>
                  {imageUrl && !loading && !error && (
                    <Button
                      onClick={handleDownload}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      下载
                    </Button>
                  )}
                </div>

                <div className="flex-1 rounded-lg bg-secondary/30 border border-border/50 flex items-center justify-center overflow-hidden relative min-h-[300px]">
                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/80 rounded-lg">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground text-sm">
                        AI正在绘制中，请稍候...
                      </p>
                      <p className="text-muted-foreground/60 text-xs mt-2">
                        首次生成可能需要20-60秒
                      </p>
                    </div>
                  )}

                  {error && !loading && (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ImageOff className="w-12 h-12 mb-3 opacity-50" />
                      <p className="mb-3">图片生成失败，请重试</p>
                      <Button onClick={generate} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        重试
                      </Button>
                    </div>
                  )}

                  {!imageUrl && !loading && !error && (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-3">
                        <Wand2 className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-sm">输入描述并点击生成按钮</p>
                      <p className="text-xs mt-1 opacity-60">
                        图片将在此处展示
                      </p>
                    </div>
                  )}

                  {imageUrl && (
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt="AI生成图片"
                      crossOrigin="anonymous"
                      onLoad={() => { setLoading(false); setError(false); }}
                      onError={() => { setLoading(false); setError(true); setImageUrl(null); }}
                      className={`w-full h-full object-contain transition-opacity duration-500 ${
                        loading ? "opacity-0 absolute" : "opacity-100"
                      }`}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
