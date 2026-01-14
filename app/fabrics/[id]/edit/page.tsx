import FabricForm from "@/components/fabric-form/main-form"

export default async function FabricEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <FabricForm fabricId={id} />
    </div>
  )
}
