"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ImageIcon } from "lucide-react"
import Link from "next/link"
import { getImageHistory } from "../actions"

interface ImageGeneration {
  id: string
  prompt: string
  model: string
  size: string
  count: number
  images: string[]
  created_at: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ImageGeneration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const result = await getImageHistory()
      if (result.success && result.data) {
        setHistory(result.data)
      }
    } catch (error) {
      console.error("Failed to load history:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Generator
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Generation History</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-300">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700 p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No generations yet</h2>
            <p className="text-gray-400 mb-4">Start creating some amazing images to see them here!</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                Generate Images
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {history.map((generation) => (
              <Card key={generation.id} className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">{generation.prompt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Model: {generation.model}</span>
                      <span>Size: {generation.size}</span>
                      <span>Count: {generation.count}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(generation.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {generation.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={`Generated image ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <Button onClick={() => window.open(imageUrl, "_blank")} variant="secondary" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
