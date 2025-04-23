import { EnvCheck } from "@/components/env-check"

export default function EnvCheckPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Check</h1>
      <EnvCheck />
    </div>
  )
}
