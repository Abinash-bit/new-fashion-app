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
  isGenerating?: boolean
}

type TabName = 'lifestyle' | 'studio' | 'flatlay' | 'editorial' | 'details' | 'background-edit'

export function ClothingPhotographyTabs({
  onImageGenerated,
  onGarmentImageUpload,
  generatedImage,
  onTabChange,
  isGenerating = false,
}: ClothingPhotographyTabsProps) {
  const [selectedTab, setSelectedTab] = React.useState<TabName>("lifestyle")
  const [garmentImage, setGarmentImage] = React.useState<File | null>(null)
  const [tabLoadingStates, setTabLoadingStates] = React.useState<Record<TabName, boolean>>({
    lifestyle: false,
    studio: false,
    flatlay: false,
    editorial: false,
    details: false,
    'background-edit': false
  })

  // Add state for background edit parameters
  const [backgroundEditParams, setBackgroundEditParams] = React.useState({
    garment_type: "",
    surface_type: "",
    camera_view_angle: "",
    camera_distance_meters: "",
    camera_focal_length_mm: "",
    camera_aperture_f_number: "",
    camera_lighting_condition: "",
    camera_background: ""
  })

  // Clear image when tab changes
  React.useEffect(() => {
    setGarmentImage(null)
  }, [selectedTab])

  // Update parent component when tab changes
  React.useEffect(() => {
    onTabChange?.(selectedTab)
  }, [selectedTab, onTabChange])

  // Update tab loading state when isGenerating changes
  React.useEffect(() => {
    if (isGenerating) {
      setTabLoadingStates(prev => ({
        ...prev,
        [selectedTab]: true
      }))
    } else {
      setTabLoadingStates(prev => ({
        ...prev,
        [selectedTab]: false
      }))
    }
  }, [isGenerating, selectedTab])

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

    setTabLoadingStates(prev => ({
      ...prev,
      [selectedTab]: true
    }))

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
      } else if (selectedTab === "background-edit") {
        console.log('Calling background edit API')
        // Create FormData for background edit API call
        const formData = new FormData()
        formData.append('garment_images', garmentImage)
        formData.append('camera_lighting_condition', 'indoor_warm')
        formData.append('garment_type', 'clothing')
        formData.append('camera_focal_length_mm', '10')
        formData.append('camera_background', 'white')
        formData.append('surface_type', 'string')
        formData.append('camera_view_angle', '30')
        formData.append('camera_aperture_f_number', '10')
        formData.append('camera_distance_meters', '6')

        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/background_edit', {
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
      } else if (selectedTab === "editorial") {
        console.log('Calling editorial API')
        // Editorial tab: ONLY call the editorial endpoint
        const formData = new FormData()
        formData.append('garment_images', garmentImage)
        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/editorial', {
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
      }
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setTabLoadingStates(prev => ({
        ...prev,
        [selectedTab]: false
      }))
    }
  }

  const renderInputs = () => {
    switch (selectedTab) {
      case "lifestyle":
      case "studio":
      case "editorial":
      case "flatlay":
      case "details":
      case "background-edit":
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
      <Tabs defaultValue="lifestyle" className="w-full" onValueChange={(value) => setSelectedTab(value as TabName)}>
        <TabsList className="grid w-full grid-cols-6 bg-transparent">
          <TabsTrigger value="lifestyle" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Lifestyle Images</TabsTrigger>
          <TabsTrigger value="studio" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Studio & Minimal</TabsTrigger>
          <TabsTrigger value="flatlay" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Flat Lay & Ghost</TabsTrigger>
          <TabsTrigger value="editorial" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Editorial & Fashion</TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Detail Shots</TabsTrigger>
          <TabsTrigger value="background-edit" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">Background Edit</TabsTrigger>
        </TabsList>

        {/* Only render the default output box for non-background-edit tabs */}
        {selectedTab !== 'background-edit' && (
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
                    {tabLoadingStates[selectedTab] ? (
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
        )}
        <TabsContent value="background-edit">
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Background Edit</h3>
                  {/* Garment Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Garment Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {garmentImage ? (
                        <div className="relative">
                          <img src={URL.createObjectURL(garmentImage)} alt="Uploaded garment" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setGarmentImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload garment image for background edit</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleImageUpload}
                              id="clothes-background-edit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('clothes-background-edit-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Background Edit Parameters */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium mb-2">Background Edit Parameters</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Garment Type</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.garment_type}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, garment_type: e.target.value }))}
                          placeholder="e.g., t-shirt, dress, pants"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Surface Type</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.surface_type}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, surface_type: e.target.value }))}
                          placeholder="e.g., cotton, silk, denim"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Camera View Angle</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_view_angle}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_view_angle: e.target.value }))}
                          placeholder="e.g., front, side, 45-degree"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Camera Distance (meters)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_distance_meters}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_distance_meters: e.target.value }))}
                          placeholder="e.g., 2.0"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Camera Focal Length (mm)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_focal_length_mm}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_focal_length_mm: e.target.value }))}
                          placeholder="e.g., 50"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Camera Aperture (f-number)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_aperture_f_number}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_aperture_f_number: e.target.value }))}
                          placeholder="e.g., 2.8"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Camera Lighting Condition</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_lighting_condition}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_lighting_condition: e.target.value }))}
                          placeholder="e.g., natural, studio, warm"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Camera Background</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_background}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_background: e.target.value }))}
                          placeholder="e.g., white, lifestyle, urban"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleGenerate}
                    disabled={!garmentImage || tabLoadingStates['background-edit']}
                    className="w-full mt-4"
                  >
                    {tabLoadingStates['background-edit'] ? 'Generating...' : 'Generate Background Edit'}
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Background Edit Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {tabLoadingStates['background-edit'] ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating background edit...</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative w-full h-full">
                      <img src={generatedImage} alt="Background edit result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <p className="text-gray-600">Background edit result will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload garment image and click Generate Background Edit to see result</p>
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