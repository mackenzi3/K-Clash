import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteLayout } from "@/components/site-layout"

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 - Page Not Found</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/">Go back home</Link>
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
