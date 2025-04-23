"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Play } from "lucide-react"
import { playSound, SOUNDS, toggleSounds, areSoundsEnabled, preloadSounds } from "@/lib/sound-utils"

export function SoundTest() {
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [volume, setVolume] = useState(50)
  const [soundStatus, setSoundStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Initialize sound status
    const initialStatus: Record<string, boolean> = {}
    Object.keys(SOUNDS).forEach((key) => {
      initialStatus[key] = false
    })
    setSoundStatus(initialStatus)

    // Check if sounds are enabled
    setSoundsEnabled(areSoundsEnabled())

    // Preload sounds
    preloadSounds()
  }, [])

  const handleToggleSounds = () => {
    const enabled = toggleSounds()
    setSoundsEnabled(enabled)

    // Play a test sound if enabled
    if (enabled) {
      playSound(SOUNDS.CLICK, volume / 100)
    }
  }

  const testSound = (soundKey: string) => {
    // Update status to indicate sound is playing
    setSoundStatus((prev) => ({ ...prev, [soundKey]: true }))

    // Play the sound
    playSound(SOUNDS[soundKey], volume / 100)

    // Reset status after a short delay
    setTimeout(() => {
      setSoundStatus((prev) => ({ ...prev, [soundKey]: false }))
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sound Test</CardTitle>
        <CardDescription>Test the sound effects used in the application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {soundsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <Label htmlFor="sounds-toggle">Sound Effects</Label>
          </div>
          <Switch id="sounds-toggle" checked={soundsEnabled} onCheckedChange={handleToggleSounds} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="volume-slider">Volume</Label>
            <span className="text-sm text-muted-foreground">{volume}%</span>
          </div>
          <Slider
            id="volume-slider"
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => setVolume(values[0])}
            disabled={!soundsEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Test Sounds</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SOUNDS).map(([key, path]) => (
              <Button
                key={key}
                variant="outline"
                className="justify-start"
                onClick={() => testSound(key)}
                disabled={!soundsEnabled || soundStatus[key]}
              >
                <Play className={`h-4 w-4 mr-2 ${soundStatus[key] ? "text-primary" : ""}`} />
                {key.toLowerCase()}
                <span className="text-xs text-muted-foreground ml-auto">{path.split("/").pop()}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Sound files should be placed in the public/sounds directory
      </CardFooter>
    </Card>
  )
}
