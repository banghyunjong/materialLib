"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2, X, Hash } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function SwatchList() {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "swatches",
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">색상 및 팬톤 코드 (Colors & Pantone)</h3>
        <Button
          type="button"
          size="sm"
          onClick={() => append({ colorName: "", pantoneCode: "", memo: "" })}
        >
          <Plus className="w-4 h-4 mr-2" /> 색상 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative group overflow-hidden border-l-4 border-l-primary/30">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={() => remove(index)}
            >
              <X className="w-3 h-3" />
            </Button>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <FormField
                  control={control}
                  name={`swatches.${index}.colorName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">색상명 (Color Name)</FormLabel>
                      <FormControl>
                        <Input placeholder="예: L/Beige" className="h-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name={`swatches.${index}.pantoneCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">팬톤 코드 (Pantone Code)</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="예: 13-0647 TCX" className="h-9 pl-8" {...field} />
                        </FormControl>
                        <Hash className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`swatches.${index}.memo`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">비고 (Memo)</FormLabel>
                      <FormControl>
                        <Input placeholder="특이사항 입력" className="h-9 border-dashed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`swatches.${index}.styleCode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">스타일 코드 연결 (Style Code)</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="연결할 스타일 코드" className="h-9" {...field} />
                        </FormControl>
                        <Button type="button" variant="outline" size="sm" className="h-9 shrink-0">
                          조회
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50 text-muted-foreground">
          등록된 색상이 없습니다. 상단의 '색상 추가' 버튼을 눌러주세요.
        </div>
      )}
    </div>
  )
}
