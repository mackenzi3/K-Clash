import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnvVariablesCheck } from "@/components/env-variables-check"
import { SupabaseConnectionTest } from "@/components/supabase-connection-test"
import { SoundTest } from "@/components/sound-test"

export const metadata = {
  title: "K-Clash - System Diagnostics",
  description: "Diagnose and troubleshoot K-Clash system issues",
}

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">System Diagnostics</h1>

      <Tabs defaultValue="supabase" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="sounds">Sounds</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
        </TabsList>

        <TabsContent value="supabase" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Supabase Diagnostics</CardTitle>
              <CardDescription>Check your Supabase connection and database status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SupabaseConnectionTest />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sounds" className="space-y-6 mt-6">
          <SoundTest />
        </TabsContent>

        <TabsContent value="environment" className="space-y-6 mt-6">
          <EnvVariablesCheck />
        </TabsContent>
      </Tabs>
    </div>
  )
}
