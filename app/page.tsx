"use client"

import { useState, useRef } from "react"
import { ChristmasTree } from "@/components/christmas-tree"
import { SnowEffect } from "@/components/snow-effect"
import { ControlPanel } from "@/components/control-panel"
import { SettingsPanel } from "@/components/settings-panel"
import { DecorationPanel } from "@/components/decoration-panel"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface Decoration {
  id: string
  type: "emoji" | "image"
  content: string
  x: number
  y: number
  rotation: number
  scale: number
}

export default function Home() {
  const [lightColor, setLightColor] = useState<"rainbow" | "warm" | "cool">("rainbow")
  const [showSnow, setShowSnow] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [decorations, setDecorations] = useState<Decoration[]>([])
  const [showDecorationPanel, setShowDecorationPanel] = useState(true)
  const treeRef = useRef<HTMLDivElement>(null)
  const [showTitle, setShowTitle] = useState(true)
  const [showSubtitle, setShowSubtitle] = useState(true)
  const [showLights, setShowLights] = useState(true)

  const handleAddDecoration = (type: "emoji" | "image", content: string, x?: number, y?: number) => {
    const newDecoration: Decoration = {
      id: `decoration-${Date.now()}-${Math.random()}`,
      type,
      content,
      x: x || 300,
      y: y || 300,
      rotation: 0,
      scale: 1,
    }
    setDecorations([...decorations, newDecoration])
  }

  const handleDecorationUpdate = (id: string, updates: Partial<Decoration>) => {
    setDecorations((prev) => prev.map((dec) => (dec.id === id ? { ...dec, ...updates } : dec)))
  }

  const handleDecorationRemove = (id: string) => {
    setDecorations((prev) => prev.filter((dec) => dec.id !== id))
  }

  const handleReset = () => {
    setDecorations([])
    setLightColor("rainbow")
    setShowSnow(true)
    setIsPlaying(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950">
      {showSnow && <SnowEffect />}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 桌面端装饰面板显隐切换 */}
        <div className="hidden lg:block fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDecorationPanel((prev) => !prev)}
            className="bg-card/90 backdrop-blur-sm border-border"
          >
            {showDecorationPanel ? "隐藏装饰面板" : "显示装饰面板"}
          </Button>
        </div>
        <div className="text-center mb-8 space-y-4">
          {showTitle && (
            <h1 className="text-5xl md:text-7xl font-bold text-balance bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-in fade-in slide-in-from-top duration-1000">
              圣诞快乐 2025
            </h1>
          )}
          {showSubtitle && (
            <p className="text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-top duration-1000 delay-200">
              装饰你的专属圣诞树，创造属于你的圣诞回忆
            </p>
          )}
        </div>

        <div className={`grid gap-8 items-start ${showDecorationPanel ? "lg:grid-cols-[1fr_400px]" : "lg:grid-cols-1"}`}>
          <div className="flex flex-col items-center gap-6">
            <ChristmasTree
              lightColor={lightColor}
              showLights={showLights}
              isPlaying={isPlaying}
              decorations={decorations}
              onDecorationUpdate={handleDecorationUpdate}
              onDecorationRemove={handleDecorationRemove}
              treeRef={treeRef}
            />
            <SettingsPanel
              showSnow={showSnow}
              onShowSnowChange={setShowSnow}
              showLights={showLights}
              onShowLightsChange={setShowLights}
              showTitle={showTitle}
              onShowTitleChange={setShowTitle}
              showSubtitle={showSubtitle}
              onShowSubtitleChange={setShowSubtitle}
            />
          </div>
          {showDecorationPanel && (
            <div>
              <DecorationPanel onAddDecoration={handleAddDecoration} treeRef={treeRef} />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 bg-card/50 backdrop-blur-sm border-primary/50 hover:scale-105 transition-all hover:border-primary/70"
            onClick={handleReset}
          >
            <Sparkles className="w-5 h-5" />
            重置圣诞树
          </Button>
        </div>
      </div>
    </main>
  )
}
