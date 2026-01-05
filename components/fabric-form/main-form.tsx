"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Save, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

import { HeaderSection } from "./header-section"
import { FiberComposer } from "./fiber-composer"
import { SwatchList } from "./swatch-list"

const formSchema = z.object({
  brand: z.string().min(1, "브랜드를 선택해주세요."),
  seasonYear: z.string().min(1, "연도를 선택해주세요."),
  seasonMonth: z.string().min(1, "월을 선택해주세요."),
  seasonTerm: z.string().min(1, "시즌을 선택해주세요."),
  artNo: z.string().min(1, "품명을 입력해주세요."),
  vendorName: z.string().optional(),
  width: z.string().optional(),
  weight: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().default("USD"),
  categoryMajor: z.string().optional(),
  categoryMiddle: z.string().optional(),
  compositions: z.array(z.object({
    fiberType: z.string().min(1, "소재명을 입력하세요."),
    percentage: z.number().min(1).max(100),
  })).min(1, "최소 하나 이상의 소재를 입력하세요."),
  swatches: z.array(z.object({
    colorName: z.string().min(1, "색상명을 입력하세요."),
    pantoneCode: z.string().optional(),
    memo: z.string().optional(),
    styleCode: z.string().optional(),
  })),
  linkedStyleCodes: z.array(z.object({
    code: z.string().min(1, "스타일 코드를 입력하세요."),
  })).optional(),
})

export default function FabricForm() {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const total = values.compositions.reduce((sum, item) => sum + item.percentage, 0)
    if (total !== 100) {
      alert(`혼용률 합계가 ${total}%입니다. 100%여야 저장이 가능합니다.`)
      return
    }
    console.log("Submit Values:", values)
    alert("콘솔에 데이터가 출력되었습니다. (Supabase 연결 전)")
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
            <Button type="submit" size="lg" className="shadow-lg">
              <Save className="w-4 h-4 mr-2" />
              마스터 저장
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