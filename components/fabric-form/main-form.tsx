"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, ShoppingCart, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/hooks/use-toast"

import { HeaderSection } from "./header-section"
import { FiberComposer } from "./fiber-composer"
import { SwatchList } from "./swatch-list"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  brand: z.string().min(1, "브랜드를 선택해주세요."),
  seasonYear: z.string().min(1, "연도를 선택해주세요."),
  seasonMonth: z.string().min(1, "월을 선택해주세요."),
  seasonTerm: z.string().min(1, "시즌을 선택해주세요."),
  artNo: z.string().min(1, "품명을 입력해주세요."),
  vendorName: z.string().default(""),
  width: z.string().default(""),
  weight: z.string().default(""),
  price: z.string().default(""),
  currency: z.string().default("USD"),
  categoryMajor: z.string().default(""),
  categoryMiddle: z.string().default(""),
  compositions: z.array(z.object({
    fiberType: z.string().min(1, "소재명을 입력하세요."),
    percentage: z.number().min(1).max(100),
  })).min(1, "최소 하나 이상의 소재를 입력하세요."),
  swatches: z.array(z.object({
    colorName: z.string().min(1, "색상명을 입력하세요."),
    pantoneCode: z.string().default(""),
    memo: z.string().default(""),
    styleCode: z.string().default(""),
  })),
  linkedStyleCodes: z.array(z.object({
    code: z.string().min(1, "스타일 코드를 입력하세요."),
  })).default([]),
})

export default function FabricForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const { toast } = useToast() // Commented out until I verify toast availability

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "SPAO",
      seasonYear: "2025",
      seasonMonth: "1",
      seasonTerm: "1",
      artNo: "",
      vendorName: "",
      width: "",
      weight: "",
      price: "",
      currency: "USD",
      categoryMajor: "",
      categoryMiddle: "",
      compositions: [{ fiberType: "Polyester", percentage: 100 }],
      swatches: [{ colorName: "", pantoneCode: "", memo: "", styleCode: "" }],
      linkedStyleCodes: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const total = values.compositions.reduce((sum, item) => sum + item.percentage, 0)
    if (total !== 100) {
      alert(`혼용률 합계가 ${total}%입니다. 100%여야 저장이 가능합니다.`)
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Insert Master Data
      const { data: masterData, error: masterError } = await supabase
        .from('fabric_master')
        .insert({
          brand: values.brand,
          season_year: values.seasonYear, // Schema says TEXT
          season_month: values.seasonMonth,
          season_term: values.seasonTerm,
          art_no: values.artNo,
          vendor_name: values.vendorName,
          category_major: values.categoryMajor,
          category_middle: values.categoryMiddle,
          width: values.width,
          weight: values.weight,
          price: values.price ? parseFloat(values.price) : null,
          currency: values.currency,
        })
        .select()
        .single()

      if (masterError) throw masterError
      if (!masterData) throw new Error("No data returned from master insert")

      const fabricId = masterData.id

      // 2. Insert Mixing Ratios
      const mixingData = values.compositions.map(comp => ({
        fabric_id: fabricId,
        // CODE GENERATION: "Cotton" -> "CO", "Polyester" -> "PO"
        fiber_type: comp.fiberType.substring(0, 2).toUpperCase(),
        percentage: comp.percentage,
      }))

      if (mixingData.length > 0) {
        const { error: mixingError } = await supabase
          .from('fabric_mixing_ratio')
          .insert(mixingData)

        if (mixingError) throw mixingError
      }

      // 3. Insert Colors (Fabric Color - formerly detail)
      const colorData = values.swatches.map(swatch => ({
        fabric_id: fabricId,
        color_name: swatch.colorName,
        pantone_code: swatch.pantoneCode,
        style_code: swatch.styleCode,
        memo: swatch.memo,
      }))

      if (colorData.length > 0) {
        const { error: colorError } = await supabase
          .from('fabric_color')
          .insert(colorData)

        if (colorError) throw colorError
      }

      // 4. Insert Style Links (Common Style Codes)
      if (values.linkedStyleCodes && values.linkedStyleCodes.length > 0) {
        const linkData = values.linkedStyleCodes.map(link => ({
          fabric_id: fabricId,
          style_code: link.code,
        }))

        const { error: linkError } = await supabase
          .from('fabric_style_link')
          .insert(linkData)

        if (linkError) throw linkError
      }

      alert("성공적으로 저장되었습니다!")
      // form.reset() // Optional: reset form after success

    } catch (error: any) {
      console.error("Save Error:", error)
      alert(`저장 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-8 pb-20">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b py-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">원단 마스터 등록</h1>
            <p className="text-sm text-muted-foreground">새로운 원단 정보를 시스템에 등록합니다.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="lg" onClick={() => alert("발주 시스템으로 이동합니다.")}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              발주
            </Button>
            <Button type="submit" size="lg" className="shadow-lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  마스터 저장
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-semibold">기본 정보</h2>
            </div>
            <HeaderSection />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-semibold">소재 구성</h2>
            </div>
            <FiberComposer />
          </section>

          <Separator />

          <section className="space-y-4">
            <SwatchList />
          </section>
        </div>
      </form>
    </Form>
  )
}