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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StyleCodeDialog } from "./style-code-dialog"

const BRANDS = ["ROEM", "SPAO", "MIXXO", "WHO.A.U", "NEW BALANCE"]
const SEASONS = ["1", "2", "3", "4"]

export function HeaderSection() {
  const { control } = useFormContext()

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Row 1: Brand & Season | Connect Style Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="flex gap-4 items-end">
            {/* Brand Selection */}
            <FormField
              control={control}
              name="brand"
              render={({ field }) => (
                <FormItem className="min-w-[120px]">
                  <FormLabel>브랜드</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BRANDS.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Season Group */}
            <div className="flex gap-2 flex-1">
              <FormField
                control={control}
                name="seasonYear"
                render={({ field }) => (
                  <FormItem className="flex-[1.2]">
                    <FormLabel>연도</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="YY" />
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
                    <FormLabel>월</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {month}
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
                    <FormLabel>시즌</FormLabel>
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

          {/* Connect Style Code Button (Dialog) */}
          <div className="pb-[2px]">
            <StyleCodeDialog />
          </div>
        </div>

        {/* Row 2: Art No & Vendor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Art No */}
          <FormField
            control={control}
            name="artNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>품명 (Art No)</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="원단 품명" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" className="shrink-0">
                    중복확인
                  </Button>
                </div>
                <FormMessage />
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
        </div>

        {/* Row 3: Width, Weight, Price */}
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
