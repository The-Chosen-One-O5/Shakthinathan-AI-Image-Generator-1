"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Loader2, ImageIcon, Sparkles } from "lucide-react"
import { generateImage, getAvailableModels } from "./actions"
import Link from "next/link"

export default function Home() {
  const [prompt, setPrompt] = useState("A majestic dragon soaring through cloudy skies...")
  const [model, setModel] = useState("img4")
  const [aspectRatio, setAspectRatio] = useState("1024x1024")
  const [count, setCount] = useState("1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [availableModels, setAvailableModels] = useState<any[]>([])

  useEffect(() => {
    const fetchModels = async () => {
      const result = await getAvailableModels()
      if (result.success && result.models) {
        setAvailableModels(result.models)
        console.log("Available models:", result.models)
      }
    }
    fetchModels()
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateImage({
        prompt: prompt.trim(),
        model,
        size: aspectRatio,
        n: Number.parseInt(count),
      })

      if (result.success && result.images) {
        setGeneratedImages(result.images)
      } else {
        setError(result.error || "Failed to generate images")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const aspectRatioOptions = [
    { value: "1024x1024", label: "Square" },
    { value: "1792x1024", label: "Landscape" },
    { value: "1024x1792", label: "Portrait" },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
            SHAKTHINATHAN AI
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your imagination into stunning visuals with our advanced AI image generation platform
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/history">
              <Button
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-transparent transition-all duration-200"
              >
                View Generation History
              </Button>
            </Link>
            <Link href="/debug">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white bg-transparent transition-all duration-200"
              >
                Debug API
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Generation Settings */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold text-white">Generation Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A majestic dragon soaring through cloudy skies..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 min-h-[100px] resize-none focus:border-purple-500 focus:ring-purple-500"
                  maxLength={4000}
                />
                <div className="text-xs text-gray-500 mt-1">{prompt.length}/4000 characters</div>
              </div>

              {/* AI Model */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">AI Model</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {availableModels.length > 0 ? (
                      availableModels.map((modelData) => (
                        <SelectItem key={modelData.id} value={modelData.id} className="text-white hover:bg-gray-700">
                          {modelData.id.toUpperCase()} ({modelData.tier || "Standard"})
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="img3" className="text-white hover:bg-gray-700">
                          IMG3 (🚀 Advanced)
                        </SelectItem>
                        <SelectItem value="img4" className="text-white hover:bg-gray-700">
                          IMG4 (⚡ Latest)
                        </SelectItem>
                        <SelectItem value="uncen" className="text-white hover:bg-gray-700">
                          UNCEN (🔓 Unrestricted)
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Aspect Ratio and Count */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {aspectRatioOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Count</label>
                  <Select value={count} onValueChange={setCount}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="1" className="text-white hover:bg-gray-700">
                        1
                      </SelectItem>
                      <SelectItem value="2" className="text-white hover:bg-gray-700">
                        2
                      </SelectItem>
                      <SelectItem value="3" className="text-white hover:bg-gray-700">
                        3
                      </SelectItem>
                      <SelectItem value="4" className="text-white hover:bg-gray-700">
                        4
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Images...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Generate Images
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Right Panel - Generated Images */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            {generatedImages.length === 0 && !isGenerating && !error ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Create</h3>
                <p className="text-gray-400 max-w-sm leading-relaxed">
                  Enter a detailed prompt and watch as our AI transforms your words into stunning visual art
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                    <p className="text-gray-300">Generating your images...</p>
                  </div>
                )}

                {generatedImages.length > 0 && (
                  <div className="grid gap-4">
                    {generatedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Generated image ${index + 1}`}
                          className="w-full rounded-lg shadow-lg transition-transform duration-200 group-hover:scale-[1.02]"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=400&width=400"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <Button onClick={() => window.open(imageUrl, "_blank")} variant="secondary" size="sm">
                            View Full Size
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
