import type { Metadata } from "next"
import { SiteLayout } from "@/components/site-layout"
import { SystemSettingsMigration } from "@/components/system-settings-migration"

export const metadata: Metadata = {
  title: "Admin Setup | K-Clash",
  description: "Set up the K-Clash admin system",
}

export default function AdminSetupPage() {
  return (
    <SiteLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">K-Clash Setup</h1>
          <SystemSettingsMigration />
        </div>
      </div>
    </SiteLayout>
  )
}
