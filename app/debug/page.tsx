"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { testApiConnection, getAvailableModels } from "../actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DebugPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [modelsResult, setModelsResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      const result = await testApiConnection()
      setTestResult(result)
    } catch (error) {
      setTestResult({ success: false, error: "Test failed" })
    } finally {
      setLoading(false)
    }
  }

  const handleTestModels = async () => {
    setLoading(true)
    try {
      const result = await getAvailableModels()
      setModelsResult(result)
    } catch (error) {
      setModelsResult({ success: false, error: "Models test failed" })
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
          <h1 className="text-3xl font-bold text-white">API Debug Panel</h1>
        </div>

        <div className="grid gap-6 max-w-4xl">
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">API Connection Test</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={handleTestConnection} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  Test Connection
                </Button>
                <Button onClick={handleTestModels} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                  Test Models Endpoint
                </Button>
              </div>

              {testResult && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Connection Test Result:</h3>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
                </div>
              )}

              {modelsResult && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Models Test Result:</h3>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(modelsResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Current Issue Analysis</h2>
            <div className="text-gray-300 space-y-2">
              <p>
                <strong>Error:</strong> 401 Unauthorized from Google's AI service
              </p>
              <p>
                <strong>Cause:</strong> The Infip API is failing to authenticate with Google's backend
              </p>
              <p>
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Verify your API key is correct and active</li>
                <li>Check if the Infip service is operational</li>
                <li>Try a different model (img3 instead of img4)</li>
                <li>Contact Infip support if the issue persists</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
