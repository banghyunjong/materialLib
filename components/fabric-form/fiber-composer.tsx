"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Trash2, AlertCircle, CheckCircle2, ChevronsUpDown, Check } from "lucide-react"
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

        {/* Fabric Property Selector (All Visible Grid) */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-bold mb-4">원단 속성 선택 (Fabric Property)</h3>
          <FormField
            control={control}
            name="categoryMiddle"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {FABRIC_PROPERTIES.map((group) => (
                    <div key={group.group} className="space-y-3 p-4 bg-slate-50/50 rounded-lg border">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">
                        {group.group}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {group.items.map((item) => {
                          const isSelected = field.value === item.code
                          return (
                            <Button
                              key={item.code}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              className={cn(
                                "h-auto py-2 px-2 flex flex-col items-start gap-0.5 text-left",
                                isSelected ? "bg-slate-900 border-slate-900 shadow-sm" : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                              )}
                              onClick={() => {
                                field.onChange(item.code);
                                setValue("categoryMajor", group.group);
                              }}
                            >
                              <span className={cn("text-xs font-extrabold", isSelected ? "text-white" : "text-slate-900")}>
                                {item.code}
                              </span>
                              <span className={cn("text-[10px] truncate w-full", isSelected ? "text-slate-300" : "text-muted-foreground")}>
                                {item.label}
                              </span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Physical Properties (New Section) */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-sm font-bold mb-4">물성 정보 (Physical Properties)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Yarn Count */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border">
               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">번수 (Yarn Count)</h4>
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="yarnCountWarp"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">경사 (Warp)</FormLabel>
                        <FormControl>
                          <Input placeholder="예: CM 40s" className="h-8 text-sm" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="yarnCountWeft"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">위사 (Weft)</FormLabel>
                        <FormControl>
                          <Input placeholder="예: 75D/36F" className="h-8 text-sm" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </div>
            </div>

            {/* Density */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-lg border">
               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">밀도 (Density)</h4>
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="densityWarp"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">경사 (Warp)</FormLabel>
                        <FormControl>
                          <Input placeholder="예: 110" className="h-8 text-sm" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="densityWeft"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">위사 (Weft)</FormLabel>
                        <FormControl>
                          <Input placeholder="예: 90" className="h-8 text-sm" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </div>
            </div>

            {/* Quality Specs */}
            <div className="col-span-1 md:col-span-2 space-y-3 bg-slate-50/50 p-4 rounded-lg border">
               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2">품질 스펙 (Quality Specs)</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="shrinkage"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">수축율 (Shrinkage)</FormLabel>
                        <FormControl>
                          <Input placeholder="예: -3%" className="h-8 text-sm" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="colorFastness"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-xs">견뢰도 (Color Fastness)</FormLabel>
                        <FormControl>
                          <Input placeholder="예: 4-5 Grade" className="h-8 text-sm" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
               </div>
            </div>
          </div>

          {/* Width & Weight (Moved from Header) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-slate-50/50 p-4 rounded-lg border">
              <FormField
                control={control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">규격 (Width)</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 58/60 inch" className="h-9" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">중량 (Weight)</FormLabel>
                    <div className="flex gap-2 relative">
                        <FormControl>
                          <Input placeholder="예: 250" className="h-9 pr-12" {...field} />
                        </FormControl>
                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">g/y</span>
                    </div>
                  </FormItem>
                )}
              />
          </div>
        </div>

        {!isValid && totalPercentage > 0 && (
          <p className="text-xs text-destructive font-medium">
            * 혼용률 합계가 {totalPercentage}%입니다. 100%가 되도록 조정해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  )
}