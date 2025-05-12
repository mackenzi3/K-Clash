import type { Metadata } from "next"
import { SiteLayout } from "@/components/site-layout"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In | K-Clash",
  description: "Sign in to your K-Clash account",
}

export default function SignInPage() {
  return (
    <SiteLayout>
      <div className="container py-12">
        <div className="mx-auto max-w-md">
          <SignInForm />
        </div>
      </div>
    </SiteLayout>
  )
}
