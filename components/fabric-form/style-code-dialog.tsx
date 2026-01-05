"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2, Search, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

export function StyleCodeDialog() {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "linkedStyleCodes",
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full h-10 border-dashed text-primary border-primary/50 hover:bg-primary/5">
          <LinkIcon className="w-4 h-4 mr-2" />
          스타일 코드 연결 (Connect Style)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>스타일 코드 연결</DialogTitle>
          <DialogDescription>
            이 원단이 사용되는 스타일 코드를 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <FormField
                  control={control}
                  name={`linkedStyleCodes.${index}.code`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="스타일 코드 입력" {...field} />
                        </FormControl>
                        <Button type="button" variant="secondary" size="icon" className="shrink-0" title="조회">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {fields.length === 0 && (
               <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-md">
                 연결된 스타일 코드가 없습니다.
               </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={() => append({ code: "" })}
          >
            <Plus className="w-4 h-4 mr-2" /> 스타일 코드 추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
