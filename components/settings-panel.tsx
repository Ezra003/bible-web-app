"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsPanelProps {
  fontSize: string
  setFontSize: (size: string) => void
  onClose: () => void
}

export default function SettingsPanel({ fontSize, setFontSize, onClose }: SettingsPanelProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Customize your reading experience</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close settings">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Font Size</h3>
            <RadioGroup defaultValue={fontSize} onValueChange={setFontSize} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="text-sm">
                  Small
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-base">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="text-lg">
                  Large
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x-large" id="x-large" />
                <Label htmlFor="x-large" className="text-xl">
                  Extra Large
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </CardFooter>
    </Card>
  )
}

