"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Trophy, Zap, Star, ArrowRight } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { playSound, SOUNDS } from "@/lib/sound-utils"

export function SponsorshipComponent() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("opportunities")
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Handle click with sound
  const handleClick = () => {
    playSound(SOUNDS.CLICK, 0.3)
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    handleClick()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleClick()
    setFormSubmitted(true)
    // In a real app, you would send this data to your backend
    setTimeout(() => {
      setFormSubmitted(false)
    }, 3000)
  }

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case "pink":
        return {
          gradientFrom: "from-pink-500",
          gradientTo: "to-purple-500",
          accentColor: "bg-pink-500/10 text-pink-500 border-pink-500/20",
          iconColor: "text-pink-500",
          buttonHover: "hover:bg-pink-500/90",
        }
      case "blue":
        return {
          gradientFrom: "from-blue-500",
          gradientTo: "to-indigo-500",
          accentColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          iconColor: "text-blue-500",
          buttonHover: "hover:bg-blue-500/90",
        }
      case "green":
        return {
          gradientFrom: "from-green-500",
          gradientTo: "to-emerald-500",
          accentColor: "bg-green-500/10 text-green-500 border-green-500/20",
          iconColor: "text-green-500",
          buttonHover: "hover:bg-green-500/90",
        }
      case "orange":
        return {
          gradientFrom: "from-orange-500",
          gradientTo: "to-amber-500",
          accentColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
          iconColor: "text-orange-500",
          buttonHover: "hover:bg-orange-500/90",
        }
      default:
        return {
          gradientFrom: "from-purple-500",
          gradientTo: "to-blue-500",
          accentColor: "bg-primary/10 text-primary border-primary/20",
          iconColor: "text-primary",
          buttonHover: "hover:bg-primary/90",
        }
    }
  }

  const themeStyles = getThemeStyles()

  const sponsorshipTiers = [
    {
      name: "Bronze",
      price: "KSh 50,000",
      description: "Perfect for small businesses looking to enter the gaming market",
      features: ["Logo placement on the platform", "Mention in monthly newsletter", "Social media shoutout"],
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: "Silver",
      price: "KSh 150,000",
      description: "Ideal for established brands seeking targeted exposure",
      features: ["All Bronze benefits", "Sponsored tournaments", "Social media campaign", "Banner ads on platform"],
      icon: <Users className="h-5 w-5" />,
      popular: true,
    },
    {
      name: "Gold",
      price: "KSh 300,000",
      description: "For brands wanting significant presence in the gaming community",
      features: [
        "All Silver benefits",
        "Premium ad placement",
        "Co-branded events",
        "Exclusive content",
        "Monthly performance reports",
      ],
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      name: "Platinum",
      price: "KSh 500,000+",
      description: "Ultimate partnership for maximum brand integration",
      features: [
        "All Gold benefits",
        "Title sponsorship",
        "Product integration",
        "Custom branded experiences",
        "VIP access to all events",
        "Dedicated account manager",
      ],
      icon: <Zap className="h-5 w-5" />,
    },
  ]

  const stats = [
    { label: "Active Users", value: "25,000+" },
    { label: "Monthly Tournaments", value: "12" },
    { label: "Engagement Rate", value: "78%" },
    { label: "User Growth", value: "32% MoM" },
  ]

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Partner with K-Clash</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect your brand with Kenya's most engaged gaming community and reach thousands of passionate gamers
        </p>
      </div>

      <Tabs defaultValue="opportunities" value={activeTab} onValueChange={handleTabChange} className="mb-12">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="audience">Our Audience</TabsTrigger>
          <TabsTrigger value="contact">Get in Touch</TabsTrigger>
        </TabsList>
        <TabsContent value="opportunities" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sponsorshipTiers.map((tier) => (
              <Card key={tier.name} className={tier.popular ? `border-2 ${themeStyles.accentColor}` : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <span className={`mr-2 ${themeStyles.iconColor}`}>{tier.icon}</span>
                        {tier.name}
                      </CardTitle>
                      <CardDescription className="mt-2">{tier.description}</CardDescription>
                    </div>
                    {tier.popular && <Badge className={themeStyles.accentColor}>Popular</Badge>}
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground"> / quarter</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className={`h-5 w-5 mr-2 shrink-0 ${themeStyles.iconColor}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${tier.popular ? `bg-primary ${themeStyles.buttonHover}` : ""}`}
                    onClick={() => {
                      handleClick()
                      setActiveTab("contact")
                    }}
                  >
                    Select Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="audience" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Audience</h2>
              <p className="text-muted-foreground mb-6">
                K-Clash connects you with Kenya's most engaged gaming community. Our platform brings together gamers of
                all levels, from casual players to professional esports athletes.
              </p>

              <h3 className="text-xl font-semibold mb-3">Demographics</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 ${themeStyles.iconColor}`} />
                  <span>18-34 years old (75%)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 ${themeStyles.iconColor}`} />
                  <span>Urban centers (65%)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 ${themeStyles.iconColor}`} />
                  <span>Tech-savvy early adopters</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 ${themeStyles.iconColor}`} />
                  <span>Higher education (70%)</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Popular Games</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-secondary">Call of Duty</Badge>
                <Badge className="bg-secondary">FIFA</Badge>
                <Badge className="bg-secondary">Fortnite</Badge>
                <Badge className="bg-secondary">PUBG Mobile</Badge>
                <Badge className="bg-secondary">Valorant</Badge>
                <Badge className="bg-secondary">League of Legends</Badge>
              </div>

              <Button
                className={`mt-4 bg-primary ${themeStyles.buttonHover}`}
                onClick={() => {
                  handleClick()
                  setActiveTab("contact")
                }}
              >
                Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div>
              <div
                className={`p-6 rounded-lg bg-gradient-to-br ${themeStyles.gradientFrom} ${themeStyles.gradientTo} text-white mb-8`}
              >
                <h3 className="text-xl font-bold mb-4">Platform Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-white/10 p-4 rounded-lg">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm opacity-80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Success Stories</CardTitle>
                  <CardDescription>See how brands have successfully partnered with K-Clash</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <p className="italic mb-2">
                      "Our tournament sponsorship with K-Clash increased our brand awareness among gamers by 45% and
                      drove a 28% increase in website traffic."
                    </p>
                    <p className="font-medium">- Marketing Director, TechCo Kenya</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <p className="italic mb-2">
                      "The engagement rates we saw from our K-Clash partnership exceeded all our expectations. The ROI
                      was incredible."
                    </p>
                    <p className="font-medium">- Brand Manager, Nairobi Energy Drinks</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="contact" className="mt-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Contact Our Sponsorship Team</CardTitle>
                <CardDescription>
                  Fill out the form below and our team will get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className={`h-12 w-12 mx-auto mb-4 ${themeStyles.iconColor}`} />
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                      Your inquiry has been submitted successfully. Our team will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sponsorshipTier">Interested In</Label>
                      <select id="sponsorshipTier" className="w-full p-2 rounded-md border border-input bg-background">
                        <option value="">Select a sponsorship tier</option>
                        <option value="bronze">Bronze Tier</option>
                        <option value="silver">Silver Tier</option>
                        <option value="gold">Gold Tier</option>
                        <option value="platinum">Platinum Tier</option>
                        <option value="custom">Custom Partnership</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your sponsorship goals"
                        className="min-h-[120px]"
                      />
                    </div>
                    <Button type="submit" className={`w-full bg-primary ${themeStyles.buttonHover}`}>
                      Submit Inquiry
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Elevate Your Brand?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Join the growing list of companies partnering with K-Clash to connect with Kenya's gaming community
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className={`bg-primary ${themeStyles.buttonHover}`}
            onClick={() => {
              handleClick()
              setActiveTab("contact")
            }}
          >
            Become a Sponsor
          </Button>
          <Button variant="outline" onClick={handleClick}>
            Download Media Kit
          </Button>
        </div>
      </div>
    </div>
  )
}
