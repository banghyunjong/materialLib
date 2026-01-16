"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Sparkles, ArrowRight, Loader2, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { analyzeFabricText } from "@/app/actions/analyze-fabric"
import { cn } from "@/lib/utils"

export function SmartInput() {
  const { setValue, watch } = useFormContext()
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Watch fields for summary display
  const originalSpec = watch("originalSpec")
  const specs = watch("specs") || {}

  const handleAnalyze = async () => {
    if (!input.trim()) return
    
    setLoading(true)
    try {
      const result = await analyzeFabricText(input)
      
      if (!result.success) {
        alert("분석에 실패했습니다: " + result.error)
        return
      }

      const data = result.data
      
      // Save Original Text
      setValue("originalSpec", input)

      // Save analyzed data to 'specs' JSON field
      setValue("specs", data)
      
      // Update UI selection for category
      if (data.ui_view?.fabric_code) {
         setValue("categoryMiddle", data.ui_view.fabric_code)
      }
      if (data.categoryMajor) {
         setValue("categoryMajor", data.categoryMajor)
      }
      
      // Update Compositions (Mix Ratio)
      if (data.compositions && Array.isArray(data.compositions) && data.compositions.length > 0) {
         setValue("compositions", data.compositions)
      }

      setIsOpen(false)
      setInput("") 
      
    } catch (err) {
      console.error(err)
      alert("오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="space-y-3">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
          AI 스마트 입력 열기 (텍스트 붙여넣기로 자동 완성)
        </Button>

        {/* Read-Only Result Box */}
        {originalSpec && (
          <div className="bg-slate-50/80 border rounded-lg p-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold border-b pb-2">
               <FileText className="w-3 h-3 text-blue-500" />
               <span>AI 분석 완료 데이터</span>
               <span className="text-[10px] text-muted-foreground font-normal ml-auto">입력값 기반 자동 표시</span>
             </div>
             
             <div className="grid gap-3">
               <div>
                 <div className="text-[10px] text-muted-foreground mb-1 font-medium">사용자 입력 텍스트</div>
                 <div className="bg-white p-2 rounded border text-slate-700 break-all font-mono text-xs">
                   {originalSpec}
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-slate-50 border rounded-lg p-4 space-y-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          AI 원단 정보 분석
        </label>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0 rounded-full">
            ✕
        </Button>
      </div>
      
      <Textarea 
        placeholder="원단 스펙 텍스트를 붙여넣으세요. 예: 70D/36F FDY FD*160D/96F ATY FD 228T/ 120GSM/ PD WR/ TASLAN"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[80px] text-sm resize-none bg-white"
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          취소
        </Button>
        <Button 
          type="button" 
          size="sm" 
          onClick={handleAnalyze} 
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              자동 입력 적용
              <ArrowRight className="w-3 h-3 ml-1 opacity-50" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}