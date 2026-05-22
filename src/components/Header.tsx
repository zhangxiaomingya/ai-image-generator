import { Wand2, BookOpen } from "lucide-react";

interface HeaderProps {
  activeTab: "single" | "story";
  onTabChange: (tab: "single" | "story") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-gradient">灵犀绘梦</span>
        </div>

        <nav className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
          <button
            onClick={() => onTabChange("single")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "single"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">单图生成</span>
          </button>
          <button
            onClick={() => onTabChange("story")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              activeTab === "story"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">故事图集</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
