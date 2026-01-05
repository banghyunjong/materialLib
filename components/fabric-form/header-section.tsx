"use client"

import { useFormContext } from "react-hook-form"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const BRANDS = ["ROEM", "SPAO", "MIXXO", "WHO.A.U"]
const SEASONS = ["1", "2", "3", "4"]

export function HeaderSection() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Selection */}
          <FormField
            control={control}
            name="brand"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>브랜드</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    {BRANDS.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <RadioGroupItem value={brand} id={brand} />
                        <FormLabel htmlFor={brand} className="font-normal cursor-pointer">
                          {brand}
                        </FormLabel>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Season Selection */}
          <div className="flex gap-4">
            <FormField
              control={control}
              name="seasonYear"
              render={({ field }) => (
                <FormItem className="flex-[1.2]">
                  <FormLabel>연도 (Year)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[2024, 2025, 2026].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="seasonMonth"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>월 (Month)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="seasonTerm"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>시즌 (Term)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SEASONS.map((term) => (
                        <SelectItem key={term} value={term}>
                          {term}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Art No with Check Button */}
          <FormField
            control={control}
            name="artNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>품명 (Art No)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="원단 품명을 입력하세요" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" className="shrink-0">
                    중복확인
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vendor Name with Search Button */}
          <FormField
            control={control}
            name="vendorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>거래처</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="거래처명을 입력하세요" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" className="shrink-0">
                    조회
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6">
          {/* Width */}
          <FormField
            control={control}
            name="width"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>규격 (Width)</FormLabel>
                <FormControl>
                  <Input placeholder="예: 58/60 inch" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            control={control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>중량 (Weight)</FormLabel>
                <FormControl>
                  <Input placeholder="예: 250 g/y" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
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
