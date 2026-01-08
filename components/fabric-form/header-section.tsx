import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { supabase } from "@/lib/supabase"
import { Loader2, Check, AlertCircle } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function HeaderSection() {
  const { control, getValues, setError, clearErrors } = useFormContext()
  const [checking, setChecking] = useState(false)
  const [dupStatus, setDupStatus] = useState<"idle" | "available" | "duplicate">("idle")

  const checkDuplication = async () => {
    const artNo = getValues("artNo")
    if (!artNo) {
      setError("artNo", { message: "품명을 입력해주세요." })
      return
    }

    setChecking(true)
    setDupStatus("idle")
    
    try {
      const { data, error } = await supabase
        .from("fabric_master")
        .select("id")
        .eq("art_no", artNo)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setDupStatus("duplicate")
        setError("artNo", { message: "이미 존재하는 품명입니다." })
      } else {
        setDupStatus("available")
        clearErrors("artNo")
      }
    } catch (err) {
      console.error(err)
      alert("중복 확인 중 오류가 발생했습니다.")
    } finally {
      setChecking(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Row 2: Art No, Vendor, Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Art No */}
          <FormField
            control={control}
            name="artNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>품명 (Art No)<span className="text-red-500 ml-1">*</span></FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      placeholder="원단 품명" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        setDupStatus("idle") // Reset status on change
                      }}
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant={dupStatus === "available" ? "default" : "outline"} 
                    className="shrink-0 min-w-[80px]"
                    onClick={checkDuplication}
                    disabled={checking}
                  >
                    {checking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : dupStatus === "available" ? (
                      <>
                        <Check className="w-4 h-4 mr-1" /> OK
                      </>
                    ) : (
                      "중복확인"
                    )}
                  </Button>
                </div>
                <FormMessage />
                {dupStatus === "duplicate" && (
                  <p className="text-xs text-destructive flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" /> 중복
                  </p>
                )}
                {dupStatus === "available" && (
                   <p className="text-xs text-green-600 flex items-center mt-1">
                    <Check className="w-3 h-3 mr-1" /> 사용가능
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Vendor Name */}
          <FormField
            control={control}
            name="vendorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>거래처</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="거래처명" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" className="shrink-0">
                    조회
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>단가 (Price)</FormLabel>
                <div className="flex gap-2">
                  <FormField
                    control={control}
                    name="currency"
                    render={({ field: currencyField }) => (
                      <Select
                        onValueChange={currencyField.onChange}
                        value={currencyField.value}
                        defaultValue={currencyField.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="단위" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="KRW">₩</SelectItem>
                          <SelectItem value="USD">$</SelectItem>
                          <SelectItem value="CNY">¥</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
