"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Download } from "lucide-react"
import { toPng } from "html-to-image"

interface DecorationPanelProps {
  onAddDecoration: (type: "emoji" | "image", content: string, x?: number, y?: number) => void
  treeRef?: React.RefObject<HTMLDivElement>
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
  { emoji: "🌙", label: "月亮" },
  { emoji: "⭐", label: "星星" },
]

export function DecorationPanel({ onAddDecoration, treeRef }: DecorationPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAddDecoration = (type: "emoji" | "image", content: string) => {
    // 在圣诞树中心位置附近添加装饰品
    const centerX = 300
    const centerY = 300
    const randomOffset = () => (Math.random() - 0.5) * 100 // 随机偏移 ±50px
    
    onAddDecoration(type, content, centerX + randomOffset(), centerY + randomOffset())
    setIsMobileMenuOpen(false) // 添加装饰品后关闭移动菜单
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
    if (!treeRef?.current) return

    setIsExporting(true)
    try {
      const node = treeRef.current
      const nodeRect = node.getBoundingClientRect()
      const starEl = node.querySelector('[data-export-star]') as HTMLElement | null
      let extraTop = 0
      if (starEl) {
        const starRect = starEl.getBoundingClientRect()
        // 计算星星超出容器顶部的距离，并为光晕额外留白
        const overflowTop = Math.max(0, nodeRect.top - starRect.top)
        extraTop = overflowTop + 20 // 为发光效果加 20px 安全边距
      } else {
        // 兜底：未知布局时保留适度顶部边距
        extraTop = 48
      }
      const extraBottom = 64 // 底部阴影预留约 24px
      const width = node.clientWidth
      const height = node.clientHeight + extraTop + extraBottom

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'transparent',
        width,
        height,
        style: {
          paddingTop: `${extraTop}px`,
          paddingBottom: `${extraBottom}px`,
          backgroundColor: 'transparent',
        },
        filter: (node) => {
          const el = node as HTMLElement
          const tag = el.tagName?.toUpperCase()
          // 过滤掉脚本/样式标签以及不可见元素
          const isIgnoredTag = tag === 'STYLE' || tag === 'SCRIPT'
          const isHidden = el.style && (el.style.display === 'none' || el.style.visibility === 'hidden')
          return !isIgnoredTag && !isHidden
        },
      })

      const link = document.createElement('a')
      link.download = `my-christmas-tree-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      {/* 移动端菜单按钮 */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-card/90 backdrop-blur-sm border-border"
        >
          <Upload className="w-4 h-4" />
          装饰
        </Button>
      </div>

      {/* 移动端装饰面板 - 全屏覆盖 */}
      <div className={`
        lg:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40 p-4 pt-20
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">装饰面板</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1"
          >
            ✕
          </Button>
        </div>

        {/* 装饰品网格 */}
        <div className="grid grid-cols-4 gap-3">
          {PRESET_DECORATIONS.map((item) => (
            <Button
              key={item.emoji}
              variant="outline"
              size="lg"
              className="h-12 text-2xl hover:scale-110 transition-transform bg-transparent"
              onClick={() => {
                handleAddDecoration("emoji", item.emoji)
                setIsMobileMenuOpen(false)
              }}
              title={item.label}
            >
              {item.emoji}
            </Button>
          ))}
        </div>

        {/* 功能按钮 */}
        <div className="space-y-4">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 bg-transparent"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5" />
            上传图片
          </Button>

          <Button variant="default" size="lg" className="w-full gap-2" onClick={handleExport} disabled={isExporting}>
            <Download className="w-5 h-5" />
            {isExporting ? "导出中..." : "导出为图片"}
          </Button>
        </div>

        {/* 使用提示 */}
        <div className="text-xs text-muted-foreground border-t border-border pt-4">
          <p>💡 使用提示：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>点击装饰物添加到圣诞树</li>
            <li>拖拽装饰物移动位置</li>
            <li>点击装饰物打开编辑器</li>
            <li>使用编辑器调整旋转和缩放</li>
          </ul>
        </div>
      </div>

      {/* 桌面端装饰面板 */}
      <Card className="hidden lg:block p-6 bg-card/80 backdrop-blur-sm border-primary/30 space-y-6">
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
    </>
  )
}
