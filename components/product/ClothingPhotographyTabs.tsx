import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { ModelParameters, CameraParameters } from "@/types/fashion-ai"

interface ClothingPhotographyTabsProps {
  onImageGenerated?: (imageUrl: string) => void
  onGarmentImageUpload?: (file: File) => void
  generatedImage?: string | null
  onTabChange?: (tab: string) => void
}

export function ClothingPhotographyTabs({
  onImageGenerated,
  onGarmentImageUpload,
  generatedImage,
  onTabChange,
}: ClothingPhotographyTabsProps) {
  const [selectedTab, setSelectedTab] = React.useState("lifestyle")
  const [garmentImage, setGarmentImage] = React.useState<File | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)

  // Clear image when tab changes
  React.useEffect(() => {
    setGarmentImage(null)
    setIsGenerating(false)
  }, [selectedTab])

  // Update parent component when tab changes
  React.useEffect(() => {
    onTabChange?.(selectedTab)
  }, [selectedTab, onTabChange])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setGarmentImage(file)
      if (onGarmentImageUpload) onGarmentImageUpload(file)
      const imageUrl = URL.createObjectURL(file)
      onImageGenerated?.(imageUrl)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setGarmentImage(file)
      if (onGarmentImageUpload) onGarmentImageUpload(file)
      const imageUrl = URL.createObjectURL(file)
      onImageGenerated?.(imageUrl)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const UploadArea = () => (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {garmentImage ? (
        <div className="relative">
          <img src={URL.createObjectURL(garmentImage)} alt="Uploaded garment" className="w-full h-48 object-contain" />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              setGarmentImage(null)
            }}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="w-8 h-8 mx-auto text-gray-400" />
          <p className="text-sm text-gray-600">Drag & drop your garment image here</p>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
              id="garment-upload"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById('garment-upload')?.click()}
            >
              Browse Files
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  const handleGenerate = async () => {
    if (!garmentImage) return

    setIsGenerating(true)
    try {
      console.log('Selected tab:', selectedTab)
      
      if (selectedTab === "flatlay") {
        console.log('Calling mannequin API')
        // Create FormData for mannequin API call
        const formData = new FormData()
        formData.append('garment_images', garmentImage)

        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/mannequin', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('API call failed')
        }

        const imageBlob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageGenerated?.(reader.result as string)
        }
        reader.readAsDataURL(imageBlob)
      } else if (selectedTab === "studio" || selectedTab === "editorial") {
        console.log('Calling try-on API')
        // Create FormData for API call
        const formData = new FormData()
        formData.append('garment_images', garmentImage)
        formData.append('camera_lighting_condition', 'indoor_warm')
        formData.append('garment_type', 'clothing')
        formData.append('camera_focal_length_mm', '10')
        formData.append('model_race_ethnicity', 'asian')
        formData.append('model_age_range', '18-25')
        formData.append('model_pose', 'standing')
        formData.append('camera_background', 'lifestyle')
        formData.append('camera_view_angle', 'front')
        formData.append('model_gender', 'female')
        formData.append('camera_aperture_f_number', '10')
        formData.append('camera_distance_meters', '20')
        formData.append('model_body_shape', 'pear')

        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/tryon', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('API call failed')
        }

        const imageBlob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageGenerated?.(reader.result as string)
        }
        reader.readAsDataURL(imageBlob)
      } else if (selectedTab === "details") {
        console.log('Calling detail API')
        // Create FormData for detail API call
        const formData = new FormData()
        formData.append('garment_images', garmentImage)

        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/detail', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('API call failed')
        }

        const imageBlob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageGenerated?.(reader.result as string)
        }
        reader.readAsDataURL(imageBlob)
      } else {
        // For other tabs, use the existing mock implementation
        await new Promise(resolve => setTimeout(resolve, 2000))
        const mockImageUrl = URL.createObjectURL(garmentImage)
        onImageGenerated?.(mockImageUrl)
      }
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderInputs = () => {
    switch (selectedTab) {
      case "lifestyle":
      case "studio":
      case "editorial":
      case "flatlay":
      case "details":
        return (
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2">Garment Image</Label>
            <UploadArea />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="lifestyle" className="w-full" onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 bg-transparent">
          <TabsTrigger value="lifestyle" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Lifestyle Images</TabsTrigger>
          <TabsTrigger value="studio" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Studio & Minimal</TabsTrigger>
          <TabsTrigger value="flatlay" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Flat Lay & Ghost</TabsTrigger>
          <TabsTrigger value="editorial" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Editorial & Fashion</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Detail Shots</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedTab === "lifestyle" && "Lifestyle Images"}
                    {selectedTab === "studio" && "Studio & Minimal Shots"}
                    {selectedTab === "flatlay" && "Flat Lay & Ghost Mannequin"}
                    {selectedTab === "editorial" && "Editorial & High Fashion"}
                    {selectedTab === "details" && "Detail Shots"}
                  </h3>
                  
                  {renderInputs()}
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Generated Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating image...</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative w-full h-full">
                      <img src={generatedImage} alt="Generated result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📸</span>
                      </div>
                      <p className="text-gray-600">Generated image will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload garment image and adjust parameters to see the result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 