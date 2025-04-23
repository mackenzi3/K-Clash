import type { Metadata } from "next"
import { SponsorshipComponent } from "@/components/sponsorship-component"

export const metadata: Metadata = {
  title: "Sponsorship Opportunities | K-Clash",
  description: "Partner with K-Clash to reach Kenya's growing gaming community",
}

export default function SponsorsPage() {
  return <SponsorshipComponent />
}
