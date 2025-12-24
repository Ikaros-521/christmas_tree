"use client"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SettingsPanelProps {
  showSnow: boolean
  onShowSnowChange: (show: boolean) => void
  showLights: boolean
  onShowLightsChange: (show: boolean) => void
  showTitle: boolean
  onShowTitleChange: (show: boolean) => void
  showSubtitle: boolean
  onShowSubtitleChange: (show: boolean) => void
}

export function SettingsPanel({
  showSnow,
  onShowSnowChange,
  showLights,
  onShowLightsChange,
  showTitle,
  onShowTitleChange,
  showSubtitle,
  onShowSubtitleChange,
}: SettingsPanelProps) {
  return (
    <Card className="w-full max-w-3xl p-6 bg-card/60 backdrop-blur-md border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">截图设置</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
            <Label className="text-sm">雪花效果</Label>
            <Switch checked={showSnow} onCheckedChange={onShowSnowChange} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
            <Label className="text-sm">灯光（彩灯）</Label>
            <Switch checked={showLights} onCheckedChange={onShowLightsChange} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
            <Label className="text-sm">显示标题（圣诞快乐 2025）</Label>
            <Switch checked={showTitle} onCheckedChange={onShowTitleChange} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
            <Label className="text-sm">显示副标题（装饰你的专属圣诞树...）</Label>
            <Switch checked={showSubtitle} onCheckedChange={onShowSubtitleChange} />
          </div>
        </div>
      </div>
    </Card>
  )
}