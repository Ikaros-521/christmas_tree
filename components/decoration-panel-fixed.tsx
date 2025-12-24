"use client"
import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Download } from "lucide-react"
import html2canvas from "html2canvas"

interface DecorationPanelProps {
  onAddDecoration: (type: "emoji" | "image", content: string, x?: number, y?: number) => void
  treeRef: React.RefObject<HTMLDivElement>
}

const PRESET_DECORATIONS = [
  { emoji: "🐻", label: "小熊" },
  { emoji: "🎅", label: "圣诞老人" },
  { emoji: "🎁", label: "礼物" },
  { emoji: "🧦", label: "圣诞袜" },
  { emoji: "🦌", label: "驯鹿" },
  { emoji: "⛄", label: "雪人" },
  { emoji: "🔔", label: "铃铛" },
  { emoji: "🍎", label: "苹果" },
  { emoji: "🍬", label: "糖果" },
  { emoji: "🕯️", label: "蜡烛" },
  { emoji: "❄️", label: "雪花" },
  { emoji: "🎩", label: "礼帽" },
]

export function DecorationPanel({ onAddDecoration, treeRef }: DecorationPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleAddDecoration = (type: "emoji" | "image", content: string) => {
    // 在圣诞树中心位置附近添加装饰品
    const centerX = 300
    const centerY = 300
    const randomOffset = () => (Math.random() - 0.5) * 100 // 随机偏移 ±50px
    
    onAddDecoration(type, content, centerX + randomOffset(), centerY + randomOffset())
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      handleAddDecoration("image", imageUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleExport = async () => {
    if (!treeRef.current) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(treeRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      })

      const link = document.createElement("a")
      link.download = `my-christmas-tree-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/30 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">添加装饰物</h3>
        <div className="grid grid-cols-6 gap-2">
          {PRESET_DECORATIONS.map((item) => (
            <Button
              key={item.emoji}
              variant="outline"
              size="lg"
              className="h-14 text-3xl hover:scale-110 transition-transform bg-transparent"
              onClick={() => handleAddDecoration("emoji", item.emoji)}
              title={item.label}
            >
              {item.emoji}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2 bg-transparent"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-5 h-5" />
          上传自定义图片
        </Button>

        <Button variant="default" size="lg" className="w-full gap-2" onClick={handleExport} disabled={isExporting}>
          <Download className="w-5 h-5" />
          {isExporting ? "导出中..." : "导出为图片"}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1 border-t border-border pt-4">
        <p>💡 使用提示：</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>点击装饰物添加到圣诞树</li>
          <li>拖拽装饰物移动位置</li>
          <li>点击装饰物打开编辑器</li>
          <li>使用编辑器调整旋转和缩放</li>
          <li>点击空白处或×关闭编辑器</li>
        </ul>
      </div>
    </Card>
  )
}
