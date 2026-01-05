"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2, Camera, X } from "lucide-react"
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
        <h3 className="text-base font-bold">색상 및 스와치 (Swatches)</h3>
        <Button
          type="button"
          size="sm"
          onClick={() => append({ colorName: "", memo: "", swatchImg: null })}
        >
          <Plus className="w-4 h-4 mr-2" /> 색상 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative group">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={() => remove(index)}
            >
              <X className="w-3 h-3" />
            </Button>
            <CardContent className="p-4 space-y-4">
              {/* Image Placeholder / Uploader */}
              <div className="aspect-square bg-muted rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">이미지 업로드</span>
              </div>

              <div className="space-y-3">
                <FormField
                  control={control}
                  name={`swatches.${index}.colorName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">색상명</FormLabel>
                      <FormControl>
                        <Input placeholder="예: L/Beige" size={1} className="h-8 text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`swatches.${index}.memo`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">비고 (Memo)</FormLabel>
                      <FormControl>
                        <Input placeholder="기타 특징" className="h-8 text-sm" {...field} />
                      </FormControl>
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
