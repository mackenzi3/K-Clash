import { DatabaseConnectionTest } from "@/components/database-connection-test"
import { SiteLayout } from "@/components/site-layout"

export default function SetupPage() {
  return (
    <SiteLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-center mb-8">K-Clash Database Setup</h1>
        <p className="text-center mb-8 text-muted-foreground max-w-2xl mx-auto">
          This page helps you verify your Supabase connection and set up your database. Make sure your environment
          variables are correctly configured.
        </p>

        <div className="mb-8">
          <DatabaseConnectionTest />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            After confirming your connection is working, run the SQL schema in your Supabase SQL editor.
          </p>
        </div>
      </div>
    </SiteLayout>
  )
}
