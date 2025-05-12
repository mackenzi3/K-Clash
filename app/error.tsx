"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteLayout } from "@/components/site-layout"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <SiteLayout hideNav hideFooter>
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Something went wrong!</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We apologize for the inconvenience. Our team has been notified of this issue.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
