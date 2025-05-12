import type { Metadata } from "next"
import { SiteLayout } from "@/components/site-layout"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up | K-Clash",
  description: "Create a new K-Clash account",
}

export default function SignUpPage() {
  return (
    <SiteLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <SignUpForm />
        </div>
      </div>
    </SiteLayout>
  )
}
