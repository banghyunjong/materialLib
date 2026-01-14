"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Fabric {
  id: string
  fabric_code: string
  art_no: string
  vendor_name: string
  category_major: string
  category_middle: string
  created_at: string
}

export default function FabricListPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchFabrics()
  }, [])

  async function fetchFabrics() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("fabric_master")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setFabrics(data || [])
    } catch (error: any) {
      console.error("Error fetching fabrics:", error)
      alert("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const filteredFabrics = fabrics.filter((f) => {
    const term = searchTerm.toLowerCase()
    return (
      (f.art_no && f.art_no.toLowerCase().includes(term)) ||
      (f.vendor_name && f.vendor_name.toLowerCase().includes(term)) ||
      (f.fabric_code && f.fabric_code.toLowerCase().includes(term)) ||
      (f.category_major && f.category_major.toLowerCase().includes(term)) ||
      (f.category_middle && f.category_middle.toLowerCase().includes(term))
    )
  })

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">원단 마스터 목록</h1>
          <p className="text-sm text-muted-foreground">
            등록된 원단 정보를 확인하고 발주서를 생성할 수 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Plus className="w-4 h-4 mr-2" /> 새 원단 등록
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="품명, 거래처, 원단코드, 분류 등 통합 검색..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchFabrics}>
          새로고침
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Fabric List Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>원단코드</TableHead>
              <TableHead>품명 (Art No)</TableHead>
              <TableHead>거래처</TableHead>
              <TableHead>분류</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : filteredFabrics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredFabrics.map((fabric) => (
                <TableRow 
                  key={fabric.id} 
                  className="hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => router.push(`/fabrics/${fabric.id}`)}
                >
                  <TableCell className="font-mono text-xs font-bold text-slate-600">
                    {fabric.fabric_code || "-"}
                  </TableCell>
                  <TableCell className="font-medium">{fabric.art_no}</TableCell>
                  <TableCell>{fabric.vendor_name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Badge variant="secondary" className="w-fit text-[10px]">{fabric.category_major || "-"}</Badge>
                      <span className="text-xs text-muted-foreground pl-1">{fabric.category_middle}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(fabric.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" asChild title="새창으로 보기">
                       <Link href={`/fabrics/${fabric.id}`} target="_blank">
                          <ExternalLink className="w-4 h-4" />
                       </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
