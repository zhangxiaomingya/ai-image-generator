import { Sparkles, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>免费AI文生图创作平台</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up leading-tight">
          用文字
          <span className="text-gradient"> 描绘想象 </span>
          让AI为你
          <br className="hidden sm:block" />
          <span className="text-gradient">创造视觉奇迹</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed">
          输入文字描述即可生成精美图片，或将整篇小说转化为连贯的故事图集。
          <br className="hidden sm:block" />
          无需注册，完全免费，即刻开始创作。
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>即时生成</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>多种风格</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span>完全免费</span>
          </div>
        </div>
      </div>
    </section>
  );
}
