import { DatabaseConnectionTest } from "@/components/database-connection-test"
import { DatabaseSetup } from "@/components/database-setup"

export default function SetupPage() {
  return (
    <div className="container py-10 space-y-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">K-Clash Platform Setup</h1>
          <p className="text-muted-foreground">Complete the following steps to set up your K-Clash platform</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Step 1: Verify Database Connection</h2>
            <DatabaseConnectionTest />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Step 2: Set Up Database Tables</h2>
            <DatabaseSetup />
          </section>
        </div>
      </div>
    </div>
  )
}
