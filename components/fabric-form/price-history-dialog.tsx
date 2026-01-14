"use client"

import { useState } from "react"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { FormLabel } from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function PriceHistoryDialog() {
  const { control, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceHistory",
  })
  const [isOpen, setIsOpen] = useState(false)
  
  // Local state for adding new entry
  const [newPrice, setNewPrice] = useState("")
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [newVendor, setNewVendor] = useState("")

  // Auto-fill vendor from master vendor if empty
  const masterVendor = watch("vendorName")

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && !newVendor && masterVendor) {
      setNewVendor(masterVendor)
    }
  }

  const handleAdd = () => {
    if (!newPrice) return alert("가격을 입력해주세요.")
    
    append({
      price: parseFloat(newPrice),
      effectiveDate: newDate,
      vendorName: newVendor,
      currency: "USD"
    })
    
    setNewPrice("")
    // Keep the vendor/date for convenience or reset? Let's reset date to today, keep vendor?
    setNewDate(new Date().toISOString().split('T')[0])
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full h-10 border-dashed text-primary border-primary/50 hover:bg-primary/5">
          <Plus className="w-4 h-4 mr-2" />
          가격 등록 및 이력 관리 (Price History)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>가격 정보 등록</DialogTitle>
          <DialogDescription>
            원단의 가격, 거래처, 날짜 정보를 관리합니다. 달러($) 기준입니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Area */}
          <div className="grid grid-cols-7 gap-3 items-end p-4 bg-slate-50 rounded-lg border">
             <div className="col-span-2">
               <FormLabel className="text-xs font-semibold text-muted-foreground">날짜 (Date)</FormLabel>
               <Input 
                 type="date" 
                 value={newDate} 
                 onChange={(e) => setNewDate(e.target.value)}
                 className="bg-white" 
               />
             </div>
             <div className="col-span-3">
               <FormLabel className="text-xs font-semibold text-muted-foreground">업체 (Vendor)</FormLabel>
               <Input 
                 placeholder="업체명" 
                 value={newVendor} 
                 onChange={(e) => setNewVendor(e.target.value)}
                 className="bg-white" 
               />
             </div>
             <div className="col-span-2">
               <FormLabel className="text-xs font-semibold text-muted-foreground">가격 (USD)</FormLabel>
               <div className="flex gap-2">
                 <Input 
                   type="number" 
                   placeholder="0.00" 
                   value={newPrice} 
                   onChange={(e) => setNewPrice(e.target.value)}
                   className="bg-white" 
                 />
                 <Button type="button" size="icon" onClick={handleAdd} className="shrink-0">
                   <Plus className="w-4 h-4" />
                 </Button>
               </div>
             </div>
          </div>

          {/* List Area */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>업체</TableHead>
                  <TableHead className="text-right">가격 (USD)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field: any, index) => (
                  <TableRow key={field.id}>
                    <TableCell>{field.effectiveDate}</TableCell>
                    <TableCell>{field.vendorName || "-"}</TableCell>
                    <TableCell className="text-right font-medium">${Number(field.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {fields.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                      등록된 가격 이력이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" onClick={() => setIsOpen(false)}>닫기 (Close)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
