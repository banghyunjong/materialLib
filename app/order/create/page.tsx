"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Printer, Save, ArrowLeft } from "lucide-react"

interface FabricMaster {
  id: string
  art_no: string
  vendor_name: string
  width: string
  weight: string
  price: number
  currency: string
  category_major: string
  category_middle: string
}

interface MixingRatio {
  fiber_type: string
  percentage: number
}

interface FabricColor {
  id: string
  color_name: string
  pantone_code: string
  style_code: string
  memo: string
}

function OrderCreateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fabricId = searchParams.get("fabricId")

  const [loading, setLoading] = useState(true)
  const [fabric, setFabric] = useState<FabricMaster | null>(null)
  const [compositions, setCompositions] = useState<MixingRatio[]>([])
  const [colors, setColors] = useState<FabricColor[]>([])

  useEffect(() => {
    if (!fabricId) {
      // Don't alert immediately during render or initial mount if possible, 
      // but here we just check for ID.
      // alert("잘못된 접근입니다. (Fabric ID missing)") 
      // Avoiding alert in useEffect to prevent double alerts in Strict Mode or fast re-renders
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        // 1. Fetch Master
        const { data: masterData, error: masterError } = await supabase
          .from('fabric_master')
          .select('*')
          .eq('id', fabricId)
          .single()

        if (masterError) throw masterError
        setFabric(masterData)

        // 2. Fetch Mixing Ratio
        const { data: mixData, error: mixError } = await supabase
          .from('fabric_mixing_ratio')
          .select('*')
          .eq('fabric_id', fabricId)

        if (mixError) throw mixError
        setCompositions(mixData || [])

        // 3. Fetch Colors
        const { data: colorData, error: colorError } = await supabase
          .from('fabric_color')
          .select('*')
          .eq('fabric_id', fabricId)

        if (colorError) throw colorError
        setColors(colorData || [])

      } catch (error: any) {
        console.error("Error fetching data:", error)
        alert("데이터를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fabricId])

  if (!fabricId) {
     return (
       <div className="flex flex-col items-center justify-center h-screen gap-4">
         <p>잘못된 접근입니다. (Fabric ID missing)</p>
         <Button onClick={() => router.back()}>뒤로가기</Button>
       </div>
     )
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!fabric) {
    return <div className="flex h-screen items-center justify-center">데이터를 찾을 수 없습니다.</div>
  }

  const compositionString = compositions
    .map(c => `${c.fiber_type} ${c.percentage}%`)
    .join(", ")

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg p-8 min-h-[297mm] print:shadow-none print:w-full">
        {/* Actions (Hidden on Print) */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              인쇄 / PDF 저장
            </Button>
            <Button onClick={() => alert("저장 기능은 준비중입니다.")}>
              <Save className="w-4 h-4 mr-2" />
              발주서 저장
            </Button>
          </div>
        </div>

        {/* Order Sheet Content */}
        <div className="space-y-6">
          
          {/* Title */}
          <div className="text-center border-b-2 border-black pb-4">
            <h1 className="text-3xl font-bold uppercase tracking-wider">Fabric Purchase Order</h1>
            <p className="text-sm text-gray-500 mt-1">원단 발주 의뢰서</p>
          </div>

          {/* Header Info Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Supplier */}
            <div className="border border-gray-300 rounded-sm p-4">
              <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1 border-b">Supplier (공급자)</h3>
              <div className="space-y-1 text-sm">
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-600">Vendor:</span>
                  <span className="col-span-2 font-bold">{fabric.vendor_name || "-"}</span>
                </div>
                {/* Placeholder for fields not in master */}
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-600">Contact:</span>
                  <span className="col-span-2 text-gray-400">________________</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-600">Tel/Fax:</span>
                  <span className="col-span-2 text-gray-400">________________</span>
                </div>
              </div>
            </div>

            {/* Buyer */}
            <div className="border border-gray-300 rounded-sm p-4">
              <h3 className="font-bold text-lg mb-2 bg-gray-100 p-1 border-b">Buyer (발주자)</h3>
              <div className="space-y-1 text-sm">
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-600">Date:</span>
                  <span className="col-span-2">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="font-semibold text-gray-600">Order No:</span>
                  <span className="col-span-2 text-red-500 font-mono">NEW (Auto-Gen)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fabric Specification */}
          <div className="border border-gray-300 rounded-sm">
            <h3 className="font-bold text-sm bg-gray-100 p-2 border-b">Fabric Specification</h3>
            <div className="grid grid-cols-2 text-sm">
              <div className="p-2 border-r border-b grid grid-cols-3">
                <span className="font-semibold text-gray-600">Art No.</span>
                <span className="col-span-2 font-bold">{fabric.art_no}</span>
              </div>
              <div className="p-2 border-b grid grid-cols-3">
                <span className="font-semibold text-gray-600">Composition</span>
                <span className="col-span-2">{compositionString}</span>
              </div>
              <div className="p-2 border-r border-b grid grid-cols-3">
                <span className="font-semibold text-gray-600">Width / Weight</span>
                <span className="col-span-2">{fabric.width} / {fabric.weight}</span>
              </div>
               <div className="p-2 border-b grid grid-cols-3">
                <span className="font-semibold text-gray-600">Price</span>
                <span className="col-span-2">{fabric.currency} {fabric.price?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Order Details Table */}
          <div>
            <h3 className="font-bold text-sm mb-2">Order Details</h3>
            <table className="w-full border-collapse border border-gray-400 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Color / Pattern</th>
                  <th className="border border-gray-300 p-2 text-left">Pantone / Ref</th>
                  <th className="border border-gray-300 p-2 text-center w-24">Qty</th>
                  <th className="border border-gray-300 p-2 text-center w-20">Unit</th>
                  <th className="border border-gray-300 p-2 text-center w-32">Delivery</th>
                  <th className="border border-gray-300 p-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {colors.map((color, idx) => (
                  <tr key={color.id}>
                    <td className="border border-gray-300 p-2 font-medium">{color.color_name}</td>
                    <td className="border border-gray-300 p-2 text-gray-600">{color.pantone_code}</td>
                    <td className="border border-gray-300 p-0">
                      <input 
                        type="number" 
                        className="w-full h-full p-2 text-center outline-none bg-yellow-50 focus:bg-white" 
                        placeholder="0" 
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">YDS</td>
                    <td className="border border-gray-300 p-0">
                       <input 
                        type="date" 
                        className="w-full h-full p-2 text-center outline-none bg-yellow-50 focus:bg-white text-xs" 
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                       <input 
                        type="text" 
                        className="w-full h-full p-2 outline-none bg-transparent" 
                        defaultValue={color.memo}
                      />
                    </td>
                  </tr>
                ))}
                {/* Empty Rows for filling */}
                {[...Array(Math.max(0, 5 - colors.length))].map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-gray-300 p-2">&nbsp;</td>
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 p-2 bg-gray-50"></td>
                    <td className="border border-gray-300 p-2 text-center">YDS</td>
                    <td className="border border-gray-300 p-2 bg-gray-50"></td>
                    <td className="border border-gray-300 p-2"></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 p-2 text-right" colSpan={2}>TOTAL</td>
                  <td className="border border-gray-300 p-2 text-center text-blue-600">-</td>
                  <td className="border border-gray-300 p-2 text-center">YDS</td>
                  <td className="border border-gray-300 p-2" colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Terms & Footer */}
          <div className="grid grid-cols-2 gap-8 mt-8 border-t pt-4">
             <div className="text-xs space-y-2 text-gray-500">
               <p className="font-bold text-black">Terms & Conditions:</p>
               <ol className="list-decimal list-inside space-y-1">
                 <li>All goods must be inspected upon receipt.</li>
                 <li>Please sign and return one copy of this order.</li>
                 <li>Delivery date must be strictly observed.</li>
               </ol>
             </div>
             <div className="flex flex-col justify-end items-end space-y-8">
                <div className="text-center w-48">
                  <div className="border-b border-black h-8 mb-1"></div>
                  <span className="text-sm font-bold">Authorized Signature</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function OrderCreatePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <OrderCreateContent />
    </Suspense>
  )
}