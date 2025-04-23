"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trophy, Users, MessageSquare, Video, User, Menu, Shield } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import { playSound, SOUNDS } from "@/lib/sound-utils"

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()

  // Mock admin status - in a real app, this would come from authentication
  const isAdmin = true

  const routes = [
    {
      name: "1v1 Arena",
      href: "/arena",
      icon: <Trophy className="h-4 w-4 mr-2" />,
      color: "text-yellow-500",
    },
    {
      name: "Clan Wars",
      href: "/clan-wars",
      icon: <Users className="h-4 w-4 mr-2" />,
      color: "text-blue-500",
    },
    {
      name: "Chill Hub",
      href: "/chill-hub",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      color: "text-green-500",
    },
    {
      name: "Clips",
      href: "/clips",
      icon: <Video className="h-4 w-4 mr-2" />,
      color: "text-red-500",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4 mr-2" />,
      color: "text-purple-500",
    },
  ]

  // Add admin route if user is admin
  if (isAdmin) {
    routes.push({
      name: "Admin",
      href: "/admin",
      icon: <Shield className="h-4 w-4 mr-2" />,
      color: "text-red-500",
      isAdmin: true,
    })
  }

  // Handle click with sound
  const handleClick = () => {
    playSound(SOUNDS.CLICK, 0.3)
  }

  // Animation variants for the logo
  const letterVariants = {
    hover: (i: number) => ({
      y: [-2, -8, -2],
      color: ["#8b5cf6", "#3b82f6", "#8b5cf6"],
      transition: {
        y: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.6,
          ease: "easeInOut",
          delay: i * 0.05,
        },
        color: {
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          ease: "easeInOut",
          delay: i * 0.05,
        },
      },
    }),
    initial: {
      y: 0,
      color: "#8b5cf6",
    },
  }

  // Get primary color based on theme
  const getPrimaryColor = () => {
    switch (theme) {
      case "pink":
        return "from-pink-500 to-purple-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "orange":
        return "from-orange-500 to-amber-500"
      default:
        return "from-purple-500 to-blue-500"
    }
  }

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2" onClick={handleClick}>
          <motion.div className="flex items-center" initial="initial" whileHover="hover">
            {Array.from("K-CLASH").map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                className="text-xl font-bold"
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </Link>
        <nav className="hidden md:flex items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary button-with-sound",
                pathname === route.href ? "text-primary" : "text-muted-foreground",
              )}
              onClick={handleClick}
            >
              <span className={pathname === route.href ? "text-primary" : route.color}>{route.icon}</span>
              {route.name}
              {route.isAdmin && (
                <Badge variant="outline" className="ml-1 bg-red-500/10 text-red-500 border-red-500/20">
                  Admin
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="hidden md:flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild onClick={handleClick} className="button-with-sound">
          <Link href="/">Sign In</Link>
        </Button>
        <Button size="sm" asChild onClick={handleClick} className="button-with-sound">
          <Link href="/">Sign Up</Link>
        </Button>
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" onClick={handleClick} className="button-with-sound">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex flex-col space-y-4 py-4">
            <Link
              href="/"
              className="flex items-center space-x-2 px-2"
              onClick={() => {
                setIsOpen(false)
                handleClick()
              }}
            >
              <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getPrimaryColor()}`}>
                K-CLASH
              </span>
            </Link>
            <div className="flex flex-col space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => {
                    setIsOpen(false)
                    handleClick()
                  }}
                  className={cn(
                    "flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent button-with-sound",
                    pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className={pathname === route.href ? "text-primary" : route.color}>{route.icon}</span>
                  {route.name}
                  {route.isAdmin && (
                    <Badge variant="outline" className="ml-1 bg-red-500/10 text-red-500 border-red-500/20">
                      Admin
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="outline" size="sm" asChild onClick={handleClick} className="button-with-sound">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild onClick={handleClick} className="button-with-sound">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
