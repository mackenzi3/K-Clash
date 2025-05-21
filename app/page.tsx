import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { PremiumSection } from "@/components/premium-section"
import { SiteLayout } from "@/components/site-layout"

export default function Home() {
  return (
    <SiteLayout>
      <HeroSection />
      <FeaturesSection />
      <PremiumSection />
    </SiteLayout>
  )
}
