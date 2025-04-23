import { EnvVariablesCheck } from "@/components/env-variables-check"

export default function EnvCheckPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>
      <EnvVariablesCheck />
    </div>
  )
}
