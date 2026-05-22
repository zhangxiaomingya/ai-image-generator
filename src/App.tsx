import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SingleImageGenerator from "@/components/SingleImageGenerator";
import StoryGalleryGenerator from "@/components/StoryGalleryGenerator";

function App() {
  const [activeTab, setActiveTab] = useState<"single" | "story">("single");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        <Hero />
        {activeTab === "single" ? (
          <SingleImageGenerator />
        ) : (
          <StoryGalleryGenerator />
        )}
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50 mt-12">
        <p>灵犀绘梦 - 免费AI文生图创作平台</p>
        <p className="mt-1 text-xs opacity-60">
          由 Pollinations AI 提供免费图片生成服务
        </p>
      </footer>
    </div>
  );
}

export default App;
