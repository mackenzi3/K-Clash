import { SupabaseConnectionTest } from "@/components/supabase-connection-test"
import { SupabaseDataExample } from "@/components/supabase-data-example"

export const metadata = {
  title: "K-Clash - Supabase Diagnostics",
  description: "Test and diagnose Supabase connection and data operations",
}

export default function SupabaseDiagnosticsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Diagnostics</h1>

      <div className="grid grid-cols-1 gap-6">
        <SupabaseConnectionTest />
        <SupabaseDataExample />
      </div>
    </div>
  )
}
