import { useState, useCallback } from "react";
import {
  BookOpen,
  Loader2,
  Download,
  ImageOff,
  Images,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  buildComicImageUrl,
  splitIntoScenes,
  downloadImage,
  type ComicStyle,
} from "@/lib/api";

const comicStyles: { value: ComicStyle; label: string }[] = [
  { value: "manga", label: "日式漫画" },
  { value: "american", label: "美式漫画" },
  { value: "ink", label: "水墨风" },
  { value: "cartoon", label: "卡通" },
  { value: "picturebook", label: "绘本" },
];

interface Scene {
  text: string;
  url: string;
  loaded: boolean;
  error: boolean;
}

export default function StoryGalleryGenerator() {
  const [storyText, setStoryText] = useState("");
  const [style, setStyle] = useState<ComicStyle>("manga");
  const [sceneCount, setSceneCount] = useState(4);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!storyText.trim()) return;
    setGenerating(true);
    setGenerated(true);

    const sceneTexts = splitIntoScenes(storyText, sceneCount);
    const newScenes: Scene[] = sceneTexts.map((text, i) => ({
      text,
      url: buildComicImageUrl(text, style, Math.floor(Math.random() * 1000000) + i),
      loaded: false,
      error: false,
    }));

    setScenes(newScenes);
    setTimeout(() => setGenerating(false), 500);
  }, [storyText, style, sceneCount]);

  const loadedCount = scenes.filter((s) => s.loaded || s.error).length;
  const allLoaded = scenes.length > 0 && loadedCount === scenes.length;

  const handleDownloadAll = useCallback(() => {
    scenes.forEach((scene, i) => {
      if (!scene.error) {
        setTimeout(() => {
          downloadImage(scene.url, `lingxi-story-scene-${i + 1}.jpg`);
        }, i * 800);
      }
    });
  }, [scenes]);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Controls */}
        <Card className="glass glow-border">
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                故事内容
              </label>
              <textarea
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="粘贴你的作文、小说或故事内容到这里。AI会自动将其分解为多个场景并生成配图..."
                className="w-full h-40 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-foreground">
                  绘画风格
                </label>
                <div className="flex flex-wrap gap-2">
                  {comicStyles.map((s) => (
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
                  场景数量: {sceneCount}
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={sceneCount}
                  onChange={(e) => setSceneCount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>2张</span>
                  <span>8张</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={!storyText.trim() || generating}
                variant="glow"
                size="lg"
                className="flex-1"
              >
                {generating ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <BookOpen className="w-5 h-5 mr-2" />
                )}
                {generating ? "生成中..." : "生成故事图集"}
              </Button>
              {generated && allLoaded && (
                <Button onClick={handleDownloadAll} variant="outline" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  下载全部
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gallery */}
        {generated && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Images className="w-5 h-5 text-primary" />
                故事图集
              </h3>
              <span className="text-sm text-muted-foreground">
                {loadedCount} / {scenes.length} 完成
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {scenes.map((scene, i) => (
                <Card
                  key={i}
                  className="glass overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
                >
                  <div className="aspect-square bg-secondary/30 relative overflow-hidden">
                    {!scene.loaded && !scene.error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-background/80">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <p className="text-xs text-muted-foreground">
                          场景 {i + 1} 绘制中...
                        </p>
                      </div>
                    )}
                    {scene.error && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <ImageOff className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">生成失败</p>
                      </div>
                    )}
                    <img
                      key={scene.url}
                      src={scene.url}
                      alt={`场景 ${i + 1}`}
                      onLoad={() =>
                        setScenes((prev) =>
                          prev.map((s, idx) =>
                            idx === i ? { ...s, loaded: true, error: false } : s
                          )
                        )
                      }
                      onError={() =>
                        setScenes((prev) =>
                          prev.map((s, idx) =>
                            idx === i ? { ...s, loaded: true, error: true } : s
                          )
                        )
                      }
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                        scene.loaded && !scene.error ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {scene.loaded && !scene.error && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30"
                          onClick={() =>
                            downloadImage(scene.url, `lingxi-story-scene-${i + 1}.jpg`)
                          }
                        >
                          <Download className="w-3 h-3 mr-1" />
                          下载
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {scene.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {allLoaded && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    setGenerated(false);
                    setScenes([]);
                  }}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新生成
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
