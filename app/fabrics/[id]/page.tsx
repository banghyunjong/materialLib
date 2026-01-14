import FabricForm from "@/components/fabric-form/main-form"

export default function FabricEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <FabricForm fabricId={params.id} />
    </div>
  )
}
