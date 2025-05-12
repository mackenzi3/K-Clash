import Head from "next/head"

interface SeoProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
}

export function Seo({
  title = "K-Clash | Kenya's Premier Gaming Platform",
  description = "Compete in 1v1 battles, clan wars, and share your gaming moments with Kenya's gaming community.",
  canonical,
  ogImage = "/og-image.jpg",
  noIndex = false,
}: SeoProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://k-clash.vercel.app"
  const fullTitle = title.includes("K-Clash") ? title : `${title} | K-Clash`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical || siteUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* No index if specified */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Head>
  )
}
