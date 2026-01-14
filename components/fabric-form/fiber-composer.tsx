"use client"

import { useState, useEffect } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Trash2, AlertCircle, CheckCircle2, ChevronsUpDown, Check } from "lucide-react"
import { SmartInput } from "./smart-input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const FIBER_CODES = [
  { code: "CO", label: "Cotton" },
  { code: "LI", label: "Linen" },
  { code: "WO", label: "Wool" },
  { code: "SE", label: "Silk" },
  { code: "PES", label: "Polyester" },
  { code: "PA", label: "Polyamide (Nylon)" },
  { code: "PU", label: "Polyurethane" },
  { code: "EL", label: "Elastane (Spandex)" },
  { code: "PAN", label: "Acrylic" },
  { code: "CV", label: "Viscose" },
  { code: "CMD", label: "Modal" },
  { code: "CLY", label: "Lyocell" },
]

const FABRIC_PROPERTIES = [
  {
    group: "평직 (Plain)",
    items: [
      { code: "PL", label: "기본 평직" },
      { code: "PO", label: "옥스포드" },
      { code: "PB", label: "바스켓" },
      { code: "PR", label: "립스탑" },
      { code: "PP", label: "포플린" },
      { code: "PC", label: "캔버스" },
    ]
  },
  {
    group: "능직 (Twill)",
    items: [
      { code: "TW", label: "기본 능직" },
      { code: "TD", label: "데님" },
      { code: "TH", label: "헤링본" },
      { code: "TB", label: "브로큰 트윌" },
      { code: "TS", label: "서지" },
    ]
  },
  {
    group: "주자직 (Satin)",
    items: [
      { code: "SA", label: "새틴" },
      { code: "SN", label: "면 주자" },
      { code: "SC", label: "크레이프 백" },
    ]
  },
  {
    group: "변형 (Fancy)",
    items: [
      { code: "DO", label: "도비" },
      { code: "DP", label: "피케" },
      { code: "JA", label: "자카드" },
      { code: "VL", label: "벨벳/벨로아" },
      { code: "CO", label: "코듀로이" },
      { code: "SE", label: "시어서커" },
    ]
  },
  {
    group: "니트 (Knit)",
    items: [
      { code: "KS", label: "싱글 저지" },
      { code: "KI", label: "인터록" },
      { code: "KR", label: "립 (시보리)" },
    ]
  },
  {
    group: "기타 (Etc)",
    items: [
      { code: "ZZ", label: "기타" },
    ]
  }
]

export function FiberComposer() {
  const { control, watch, setValue } = useFormContext()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "compositions",
  })

  const compositions = watch("compositions") || []
  const specs = watch("specs") || {}
  const originalSpec = watch("originalSpec")
  
  const totalPercentage = compositions.reduce(
    (sum: number, item: any) => sum + (Number(item.percentage) || 0),
    0
  )

  const isValid = totalPercentage === 100

  const handleAddFiber = (fiberCode: string) => {
    append({ fiberType: fiberCode, percentage: 0 })
  }

  const handleSet100 = () => {
    if (fields.length === 0) return
    const lastIndex = fields.length - 1
    const currentFiber = compositions[lastIndex]?.fiberType || ""
    update(lastIndex, { fiberType: currentFiber, percentage: 100 })
  }

  return (
    <Card className={cn("border-2", isValid ? "border-green-200" : "border-amber-200")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-bold">소재 구성 및 분류</CardTitle>
        <div className="flex items-center gap-2">
          {isValid ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% 완료
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
              <AlertCircle className="w-3 h-3" /> 합계: {totalPercentage}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Toolbar: Fibers on Left, 100% on Right */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4 border rounded-lg bg-slate-50/50">
          <div className="flex flex-wrap gap-2 flex-1">
            {FIBER_CODES.map((fiber) => (
              <Button
                key={fiber.code}
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 font-semibold min-w-[3rem]"
                title={fiber.label}
                onClick={() => handleAddFiber(fiber.code)}
              >
                {fiber.code}
              </Button>
            ))}
          </div>
          
          <div className="w-full md:w-auto border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
             <Button
                type="button"
                variant="default"
                size="sm"
                className="w-full md:w-auto font-bold bg-slate-900 hover:bg-slate-800"
                onClick={handleSet100}
              >
                100%
              </Button>
          </div>
        </div>

        {/* Dynamic List */}
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <FormField
                control={control}
                name={`compositions.${index}.fiberType`}
                render={({ field }) => (
                  <FormItem className="flex-[2]">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-mono",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? FIBER_CODES.find(
                                (fiber) => fiber.code === field.value
                              )?.code || field.value
                              : "소재 선택"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="소재 검색..." />
                          <CommandList>
                            <CommandEmpty>검색 결과 없음</CommandEmpty>
                            <CommandGroup>
                              {FIBER_CODES.map((fiber) => (
                                <CommandItem
                                  value={fiber.code + " " + fiber.label}
                                  key={fiber.code}
                                  onSelect={() => {
                                    field.onChange(fiber.code)
                                  }}
                                >
                                  <span className="font-bold w-12">{fiber.code}</span>
                                  <span className="text-muted-foreground text-xs">{fiber.label}</span>
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      fiber.code === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`compositions.${index}.percentage`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pr-7 font-mono text-right"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
                disabled={fields.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          {fields.length === 0 && (
            <div className="text-center py-6 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
              상단의 소재 버튼을 클릭하여 혼용률을 입력하세요.
            </div>
          )}
        </div>

        {/* AI Smart Input */}
        <div className="mt-6">
           <SmartInput />
        </div>

        {/* JSON Spec View (Split Layout) */}
        <div className="mt-8 border-t pt-4">
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-tight">상세 스펙 관리 (Detail Specs)</h3>
             <span className="text-[10px] text-muted-foreground">* 우측 폼을 수정하면 좌측 JSON 데이터도 자동 업데이트됩니다.</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Raw JSON View */}
            <div className="space-y-2">
               <label className="text-[10px] font-semibold text-slate-500">JSON Data (Read Only)</label>
               <textarea 
                  className="w-full h-[450px] p-4 text-xs font-mono bg-slate-900 text-green-400 rounded-lg border-0 focus:ring-1 focus:ring-green-500 resize-none leading-relaxed"
                  value={JSON.stringify(specs, null, 2)}
                  readOnly
               />
            </div>

            {/* Right: Smart Editor Form */}
            <div className="space-y-5 p-5 bg-slate-50 rounded-lg border h-fit">
               <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <h4 className="text-sm font-bold text-slate-700">스펙 간편 수정</h4>
               </div>

               {/* 0. Meta Info (Material & Construction) */}
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="specs.meta.predicted_material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">소재 (Material)</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. Nylon" className="h-8 text-xs bg-white" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="specs.meta.construction_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">구조 (Construction)</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. Taslan" className="h-8 text-xs bg-white" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </div>

               {/* 1. Fabric Code & Name */}
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="specs.ui_view.fabric_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">원단 구분 (Code)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs bg-white">
                              <SelectValue placeholder="선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FABRIC_PROPERTIES.map((group) => (
                              <div key={group.group}>
                                <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground bg-slate-50">
                                  {group.group}
                                </div>
                                {group.items.map((item) => (
                                  <SelectItem key={item.code} value={item.code} className="text-xs pl-4">
                                    <span className="font-bold mr-2">{item.code}</span>
                                    <span className="text-muted-foreground">{item.label}</span>
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="specs.physical_spec.density_total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">밀도 (Total Density)</FormLabel>
                        <FormControl>
                           <div className="relative">
                             <Input placeholder="ex. 228" className="h-8 text-xs bg-white pr-6" {...field} />
                             <span className="absolute right-2 top-2 text-[10px] text-muted-foreground">T</span>
                           </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </div>

               {/* 2. Width & Weight */}
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="specs.physical_spec.width_inch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">규격 (Width)</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. 58/60" className="h-8 text-xs bg-white" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="specs.physical_spec.weight_gsm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">중량 (Weight)</FormLabel>
                        <FormControl>
                           <div className="relative">
                             <Input placeholder="ex. 120" className="h-8 text-xs bg-white pr-8" {...field} />
                             <span className="absolute right-2 top-2 text-[10px] text-muted-foreground">GSM</span>
                           </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </div>

               {/* 3. Yarn Specs (Detailed) */}
               <div className="space-y-4 pt-2 border-t border-dashed">
                  <h5 className="text-xs font-bold text-muted-foreground">원사 정보 (Yarn Spec)</h5>
                  
                  {/* Warp */}
                  <div className="space-y-2 bg-white p-2 rounded border">
                    <span className="text-[11px] font-bold text-slate-700 block border-b pb-1 mb-1">경사 (Warp)</span>
                    <div className="grid grid-cols-4 gap-2">
                       <FormField
                          control={control}
                          name="specs.yarn_spec.warp.denier"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Denier</FormLabel>
                              <FormControl>
                                <Input placeholder="70" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={control}
                          name="specs.yarn_spec.warp.filament"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Filament</FormLabel>
                              <FormControl>
                                <Input placeholder="36" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={control}
                          name="specs.yarn_spec.warp.process_type"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Process</FormLabel>
                              <FormControl>
                                <Input placeholder="FDY" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={control}
                          name="specs.yarn_spec.warp.luster"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Luster</FormLabel>
                              <FormControl>
                                <Input placeholder="FD" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                    </div>
                  </div>

                  {/* Weft */}
                  <div className="space-y-2 bg-white p-2 rounded border">
                    <span className="text-[11px] font-bold text-slate-700 block border-b pb-1 mb-1">위사 (Weft)</span>
                    <div className="grid grid-cols-4 gap-2">
                       <FormField
                          control={control}
                          name="specs.yarn_spec.weft.denier"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Denier</FormLabel>
                              <FormControl>
                                <Input placeholder="160" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={control}
                          name="specs.yarn_spec.weft.filament"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Filament</FormLabel>
                              <FormControl>
                                <Input placeholder="96" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={control}
                          name="specs.yarn_spec.weft.process_type"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Process</FormLabel>
                              <FormControl>
                                <Input placeholder="ATY" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                       <FormField
                          control={control}
                          name="specs.yarn_spec.weft.luster"
                          render={({ field }) => (
                            <FormItem className="col-span-1 space-y-0">
                              <FormLabel className="text-[9px] text-slate-500">Luster</FormLabel>
                              <FormControl>
                                <Input placeholder="FD" className="h-6 text-xs px-1" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                       />
                    </div>
                  </div>
               </div>
               
               {/* 3.5 Finishings */}
               <div className="space-y-3 pt-2 border-t border-dashed">
                  <h5 className="text-xs font-bold text-muted-foreground">후가공 (Finishings)</h5>
                  <FormField
                    control={control}
                    name="specs.physical_spec.finishings_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                             placeholder="ex. PD, WR (쉼표로 구분)" 
                             className="h-8 text-xs bg-white" 
                             value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""} 
                             onChange={(e) => field.onChange(e.target.value.split(",").map((s: string) => s.trim()))} 
                          />
                        </FormControl>
                        <p className="text-[10px] text-muted-foreground">* 약어(Code)로 입력 (ex. PD, WR)</p>
                      </FormItem>
                    )}
                  />
               </div>

               {/* 4. Summary KR */}
               <div className="pt-2 border-t border-dashed">
                  <FormField
                    control={control}
                    name="specs.meta.summary_kr"
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel className="text-xs font-bold text-blue-600">분석 요약 (한글)</FormLabel>
                         <FormControl>
                           <textarea 
                             className="w-full min-h-[60px] p-2 text-xs bg-white border rounded-md focus:ring-1 focus:ring-blue-500 resize-none"
                             placeholder="AI 분석 요약 내용"
                             {...field}
                           />
                         </FormControl>
                      </FormItem>
                    )}
                  />
               </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}