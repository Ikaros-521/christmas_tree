"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Lightbulb, Snowflake, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface ControlPanelProps {
  lightColor: "rainbow" | "warm" | "cool"
  onLightColorChange: (color: "rainbow" | "warm" | "cool") => void
  showSnow: boolean
  onShowSnowChange: (show: boolean) => void
  isPlaying: boolean
  onPlayingChange: (playing: boolean) => void
}

export function ControlPanel({
  lightColor,
  onLightColorChange,
  showSnow,
  onShowSnowChange,
  isPlaying,
  onPlayingChange,
}: ControlPanelProps) {
  return (
    <Card className="mt-8 p-6 bg-card/50 backdrop-blur-md border-border/50 animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
      <div className="flex flex-col gap-6">
        {/* Light color control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Lightbulb className="w-4 h-4" />
            <span>灯光颜色</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={lightColor === "rainbow" ? "default" : "outline"}
              size="sm"
              onClick={() => onLightColorChange("rainbow")}
              className={cn(
                "flex-1 transition-all",
                lightColor === "rainbow" && "bg-gradient-to-r from-primary via-secondary to-accent",
              )}
            >
              彩虹
            </Button>
            <Button
              variant={lightColor === "warm" ? "default" : "outline"}
              size="sm"
              onClick={() => onLightColorChange("warm")}
              className={cn(
                "flex-1 transition-all",
                lightColor === "warm" && "bg-gradient-to-r from-accent to-destructive",
              )}
            >
              暖色
            </Button>
            <Button
              variant={lightColor === "cool" ? "default" : "outline"}
              size="sm"
              onClick={() => onLightColorChange("cool")}
              className={cn(
                "flex-1 transition-all",
                lightColor === "cool" && "bg-gradient-to-r from-secondary to-primary",
              )}
            >
              冷色
            </Button>
          </div>
        </div>

        {/* Effects control */}
        <div className="flex gap-3">
          <Button
            variant={showSnow ? "default" : "outline"}
            size="sm"
            onClick={() => onShowSnowChange(!showSnow)}
            className="flex-1 gap-2"
          >
            <Snowflake className="w-4 h-4" />
            {showSnow ? "雪花开启" : "雪花关闭"}
          </Button>
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="sm"
            onClick={() => onPlayingChange(!isPlaying)}
            className="flex-1 gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                暂停动画
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                开始动画
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
