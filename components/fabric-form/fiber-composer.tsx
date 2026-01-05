"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2, AlertCircle, CheckCircle2, Check, ChevronsUpDown } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const COMMON_FIBERS = ["Cotton", "Polyester", "Rayon", "Nylon", "Spandex", "Wool", "Linen", "Silk", "Acrylic", "Acetate"]

const CATEGORIES: Record<string, { label: string; value: string }[]> = {
  WOVEN: [
    { label: "평직 (Plain)", value: "PLAIN" },
    { label: "능직 (Twill)", value: "TWILL" },
    { label: "수자직 (Satin)", value: "SATIN" },
    { label: "이중직 (Double)", value: "DOUBLE" },
    { label: "자카드 (Jacquard)", value: "JACQUARD" },
    { label: "기타 (Other)", value: "OTHER" },
  ],
  KNIT: [
    { label: "싱글 (Single Jersey)", value: "SINGLE" },
    { label: "리브 (Rib)", value: "RIB" },
    { label: "양면 (Interlock)", value: "INTERLOCK" },
    { label: "쭈리 (Terry)", value: "TERRY" },
    { label: "트리코트 (Tricot)", value: "TRICOT" },
    { label: "기타 (Other)", value: "OTHER" },
  ],
  OTHERS: [
    { label: "부직포 (Non-woven)", value: "NON_WOVEN" },
    { label: "가죽 (Leather)", value: "LEATHER" },
    { label: "털 (Fur)", value: "FUR" },
    { label: "레이스 (Lace)", value: "LACE" },
  ],
}

export function FiberComposer() {
  const { control, watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "compositions",
  })

  const compositions = watch("compositions") || []
  const selectedMajor = watch("categoryMajor")

  const totalPercentage = compositions.reduce(
    (sum: number, item: any) => sum + (Number(item.percentage) || 0),
    0
  )

  const isValid = totalPercentage === 100

  const handleShortcut = (fiber: string) => {
    // 100% 숏컷: 기존 내용 지우고 하나로 세팅
    setValue("compositions", [{ fiberType: fiber, percentage: 100 }])
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
        {/* Category Section */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <FormField
            control={control}
            name="categoryMajor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>대분류 (Major)</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val)
                    setValue("categoryMiddle", "") // Reset middle category
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="대분류 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WOVEN">직물 (Woven)</SelectItem>
                    <SelectItem value="KNIT">편물 (Knit)</SelectItem>
                    <SelectItem value="OTHERS">기타 (Others)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="categoryMiddle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>중분류 (Middle)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedMajor}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedMajor ? "중분류 선택" : "대분류를 먼저 선택하세요"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedMajor && CATEGORIES[selectedMajor]?.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Shortcuts */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center mr-1">Quick 100%:</span>
          {COMMON_FIBERS.slice(0, 6).map((fiber) => (
            <Button
              key={fiber}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handleShortcut(fiber)}
            >
              {fiber} 100%
            </Button>
          ))}
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
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? COMMON_FIBERS.find(
                                (fiber) => fiber.toLowerCase() === field.value.toLowerCase()
                              ) || field.value
                              : "소재 선택 (Type to search)"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="소재 검색..."
                            onValueChange={(search) => {
                              // Allow custom input if not found in list (simple handling)
                              if (search && !COMMON_FIBERS.some(f => f.toLowerCase().includes(search.toLowerCase()))) {
                                // logic to allow setting value could be here or just use the input value itself
                                // For now, let's just let them pick or we might need a way to set custom.
                                // Actually, shadcn command input is for filtering.
                                // To allow custom input in Combobox is a bit tricky with strict Command.
                                // We will use the approach: if no match, show 'Create "search"'.
                              }
                            }}
                          />
                          <CommandList>
                            <CommandEmpty>
                              <Button
                                variant="ghost"
                                className="w-full justify-start h-8 font-normal"
                                onClick={() => {
                                  // This is a workaround to get the typed value if possible, 
                                  // but standard CommandInput doesn't expose it easily to the click handler of empty.
                                  // A simpler way for "Free Text + Autocomplete" is using a DataList or just simple suggestions.
                                  // Given the constraints, I will make the CommandInput behave as a search, and if they press Enter, we might need a custom item.
                                  // Let's stick to selecting from list for now, or use the Input directly if they want custom?
                                  // User said "c -> cotton", implying autocomplete.
                                  // I'll add a 'Direct Input' option if they really need it, but for now standard list.
                                }}
                              >
                                목록에 없음 (직접 입력은 아직 미지원)
                              </Button>
                            </CommandEmpty>
                            <CommandGroup>
                              {COMMON_FIBERS.map((fiber) => (
                                <CommandItem
                                  value={fiber}
                                  key={fiber}
                                  onSelect={() => {
                                    field.onChange(fiber)
                                    // Close popover handled by wrapping component usually, but here we might need state.
                                    // Since we are inside map, managing open state for each row is complex.
                                    // We can rely on basic Radix behavior or use a controlled component wrapper.
                                    // FOR SIMPLICITY: We rely on the loose interactions. The user clicks, it sets value.
                                    // To close, they click outside. (A bit hacky but works for MVP without extra state).
                                  }}
                                >
                                  {fiber}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      fiber.toLowerCase() === field.value?.toLowerCase()
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
                          className="pr-7"
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
                disabled={fields.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => append({ fiberType: "", percentage: 0 })}
        >
          <Plus className="w-4 h-4 mr-2" /> 소재 추가
        </Button>

        {!isValid && totalPercentage > 0 && (
          <p className="text-xs text-destructive font-medium">
            * 혼용률 합계가 {totalPercentage}%입니다. 100%가 되도록 조정해주세요.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
