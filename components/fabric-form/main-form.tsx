"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, ShoppingCart, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/hooks/use-toast"

import { HeaderSection } from "./header-section"
import { FiberComposer } from "./fiber-composer"
import { SwatchList } from "./swatch-list"
import { StyleCodeDialog } from "./style-code-dialog"
import { PriceHistoryDialog } from "./price-history-dialog"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  artNo: z.string().min(1, "품명을 입력해주세요."),
  materialAlias: z.string().default(""),
  vendorName: z.string().default(""),
  categoryMajor: z.string().default(""),
  categoryMiddle: z.string().default(""),
  isFixedMaterial: z.boolean().default(false),
  
  // Physical properties consolidated into JSON
  specs: z.any().default({}),

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
  priceHistory: z.array(z.object({
    price: z.number(),
    effectiveDate: z.string(),
    vendorName: z.string(),
    currency: z.string().default("USD"),
  })).default([]),
  originalSpec: z.string().optional(),
})

interface FabricFormProps {
  fabricId?: string
}

export default function FabricForm({ fabricId }: FabricFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const { toast } = useToast() // Commented out until I verify toast availability

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artNo: "",
      materialAlias: "",
      vendorName: "",
      categoryMajor: "",
      categoryMiddle: "",
      isFixedMaterial: false,
      specs: {},
      
      compositions: [{ fiberType: "PES", percentage: 100 }],
      swatches: [{ colorName: "", pantoneCode: "", memo: "", styleCode: "" }],
      linkedStyleCodes: [],
      priceHistory: [],
      originalSpec: "",
    },
  })

  // Fetch Data if fabricId exists
  useEffect(() => {
    if (!fabricId) return

    async function loadData() {
      setIsLoading(true)
      try {
        // 1. Master
        const { data: master, error: masterError } = await supabase
          .from('fabric_master')
          .select('*')
          .eq('id', fabricId)
          .single()
        
        if (masterError) throw masterError

        // 2. Compositions
        const { data: compositions, error: compError } = await supabase
          .from('fabric_mixing_ratio')
          .select('*')
          .eq('fabric_id', fabricId)
        
        if (compError) throw compError

        // 3. Colors
        const { data: colors, error: colorError } = await supabase
          .from('fabric_color')
          .select('*')
          .eq('fabric_id', fabricId)
        
        if (colorError) throw colorError

        // 4. Style Links
        const { data: links, error: linkError } = await supabase
          .from('fabric_style_link')
          .select('*')
          .eq('fabric_id', fabricId)
        
        if (linkError) throw linkError

        // 5. Price History
        const { data: prices, error: priceError } = await supabase
          .from('fabric_price_history')
          .select('*')
          .eq('fabric_id', fabricId)
          .order('effective_date', { ascending: false })
        
        if (priceError) throw priceError

        // Reset Form
        form.reset({
          artNo: master.art_no || "",
          materialAlias: master.material_alias || "",
          vendorName: master.vendor_name || "",
          categoryMajor: master.category_major || "",
          categoryMiddle: master.category_middle || "",
          isFixedMaterial: master.is_fixed_material || false,
          specs: master.specs || {},
          
          compositions: compositions?.map(c => ({ fiberType: c.fiber_type, percentage: c.percentage })) || [],
          swatches: colors?.map(c => ({ colorName: c.color_name, pantoneCode: c.pantone_code || "", memo: c.memo || "", styleCode: c.style_code || "" })) || [],
          linkedStyleCodes: links?.map(l => ({ code: l.style_code })) || [],
          priceHistory: prices?.map(p => ({
            price: p.price,
            effectiveDate: p.effective_date,
            vendorName: p.vendor_name || "",
            currency: p.currency || "USD"
          })) || [],
          originalSpec: master.original_spec_text || "",
        })

      } catch (error) {
        console.error("Failed to load fabric data:", error)
        alert("데이터를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [fabricId, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const total = values.compositions.reduce((sum, item) => sum + item.percentage, 0)
    if (total !== 100) {
      alert(`혼용률 합계가 ${total}%입니다. 100%여야 저장이 가능합니다.`)
      return
    }

    setIsSubmitting(true)

    try {
      let targetId = fabricId
      
      // Generate search_text for full-text search
      const searchText = [
        values.artNo,
        values.materialAlias,
        values.vendorName,
        values.categoryMajor,
        values.categoryMiddle,
        values.originalSpec,
        JSON.stringify(values.specs),
        values.compositions.map(c => `${c.fiberType} ${c.percentage}%`).join(" ")
      ].filter(Boolean).join(" ");

      if (fabricId) {
        // UPDATE Logic
        const { error: updateError } = await supabase
          .from('fabric_master')
          .update({
            art_no: values.artNo,
            material_alias: values.materialAlias,
            vendor_name: values.vendorName,
            category_major: values.categoryMajor,
            category_middle: values.categoryMiddle,
            is_fixed_material: values.isFixedMaterial,
            specs: values.specs,
            original_spec_text: values.originalSpec,
            search_text: searchText,
          })
          .eq('id', fabricId)

        if (updateError) throw updateError

        // Delete existing related data to replace with new data (simplest strategy)
        await supabase.from('fabric_mixing_ratio').delete().eq('fabric_id', fabricId)
        await supabase.from('fabric_color').delete().eq('fabric_id', fabricId)
        await supabase.from('fabric_style_link').delete().eq('fabric_id', fabricId)
        await supabase.from('fabric_price_history').delete().eq('fabric_id', fabricId)

      } else {
        // INSERT Logic
        const { data: masterData, error: masterError } = await supabase
          .from('fabric_master')
          .insert({
            art_no: values.artNo,
            material_alias: values.materialAlias,
            vendor_name: values.vendorName,
            category_major: values.categoryMajor,
            category_middle: values.categoryMiddle,
            is_fixed_material: values.isFixedMaterial,
            // Physical Properties
            specs: values.specs,
            original_spec_text: values.originalSpec,
            search_text: searchText,
          })
          .select()
          .single()

        if (masterError) throw masterError
        if (!masterData) throw new Error("No data returned from master insert")
        
        targetId = masterData.id
      }

      // Insert Related Data (for both Update and Insert)
      // 2. Insert Mixing Ratios
      const mixingData = values.compositions.map(comp => ({
        fabric_id: targetId,
        fiber_type: comp.fiberType, 
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
        fabric_id: targetId,
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
          fabric_id: targetId,
          style_code: link.code,
        }))

        const { error: linkError } = await supabase
          .from('fabric_style_link')
          .insert(linkData)

        if (linkError) throw linkError
      }

      // 5. Insert Price History
      if (values.priceHistory && values.priceHistory.length > 0) {
        const priceData = values.priceHistory.map(p => ({
          fabric_id: targetId,
          price: p.price,
          effective_date: p.effectiveDate,
          vendor_name: p.vendorName,
          currency: p.currency,
        }))

        const { error: priceError } = await supabase
          .from('fabric_price_history')
          .insert(priceData)

        if (priceError) throw priceError
      }

      
      if (fabricId) {
         alert("성공적으로 수정되었습니다.")
      } else {
         if (confirm("성공적으로 저장되었습니다! 발주로 바로 이동하시겠습니까?")) {
           router.push(`/order/create?fabricId=${targetId}`)
         }
      }

    } catch (error: any) {
      console.error("Save Error:", JSON.stringify(error, null, 2))
      alert(`저장 중 오류가 발생했습니다: ${error.message || error.details || "알 수 없는 오류"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center">Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto space-y-4 pb-10 px-4">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b py-3 mb-4 flex items-center justify-between shadow-sm -mx-4 px-4">
          <div className="flex items-center gap-3">
             <h1 className="text-xl font-bold tracking-tight">{fabricId ? "원단 정보 수정" : "원단 마스터 등록"}</h1>
             <span className="text-xs text-muted-foreground hidden sm:inline-block">
               | {fabricId ? "기존 원단 정보를 수정합니다." : "새로운 원단 정보를 등록합니다."}
             </span>
          </div>
          <div className="flex gap-2">
            {fabricId && (
               <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`/order/create?fabricId=${fabricId}`)}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                발주서 보기
              </Button>
            )}
            <Button type="submit" size="sm" className="shadow-md" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {fabricId ? "수정 저장" : "저장"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-6 bg-primary rounded-full" />
                 <h2 className="text-lg font-semibold">스타일 코드 연결</h2>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
                 <StyleCodeDialog />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-6 bg-primary rounded-full" />
                 <h2 className="text-lg font-semibold">가격 정보</h2>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm h-full">
                 <PriceHistoryDialog />
              </div>
            </section>
          </div>

          <Separator />

          <section className="space-y-4">
            <SwatchList />
          </section>
        </div>
      </form>
    </Form>
  )
}