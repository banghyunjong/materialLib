import FabricForm from "@/components/fabric-form/main-form"
import { supabase } from "@/lib/supabase"

export default async function Home() {
  // Temporary: Check connection
  const { count, error } = await supabase
    .from('fabric_master')
    .select('*', { count: 'exact', head: true })

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mb-4 flex items-center gap-2 p-2 rounded bg-white shadow-sm w-fit">
        <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
        <span className="text-xs font-medium text-slate-600">
          Supabase: {error ? error.message : `Connected (${count} rows)`}
        </span>
      </div>
      <FabricForm />
    </main>
  )
}