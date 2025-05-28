"use client"

import { useState } from "react"
import { Upload, User, Zap, Hand, Bed, Users, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ModelParameters, ProductParameters, CameraParameters, GenerationRequest } from "@/types/fashion-ai"
import { SizeGuide } from "@/components/product/SizeGuide"
import { ColorVariants } from "@/components/product/ColorVariants"
import { FabricView } from "@/components/product/FabricView"

export default function FashionAIStudio() {
  // State based on the parameter tables
  const [modelParams, setModelParams] = useState<ModelParameters>({
    gender: "female",
    age_range: "20-30",
    race_ethnicity: "Type II", // Fitzpatrick skin type
    body_shape: "hourglass",
    height_cm: 170,
    pose: "front",
  })

  const [productParams, setProductParams] = useState<Partial<ProductParameters>>({
    category: "dress",
    dimensions: {
      h_cm: 100,
      w_cm: 50,
    },
    metadata: {
      brand: "FashionAI",
      material: "Cotton Blend",
      colour: "Black",
      price_tier: "mid",
    },
    sizeGuide: {
      measurements: {
        "XS": { chest: 86, waist: 66, hips: 91 },
        "S": { chest: 91, waist: 71, hips: 96 },
        "M": { chest: 96, waist: 76, hips: 101 },
        "L": { chest: 101, waist: 81, hips: 106 },
        "XL": { chest: 106, waist: 86, hips: 111 }
      },
      internationalSizes: {
        "XS": { US: "2", UK: "6", EU: "34", AU: "6", JP: "7" },
        "S": { US: "4", UK: "8", EU: "36", AU: "8", JP: "9" },
        "M": { US: "6", UK: "10", EU: "38", AU: "10", JP: "11" },
        "L": { US: "8", UK: "12", EU: "40", AU: "12", JP: "13" },
        "XL": { US: "10", UK: "14", EU: "42", AU: "14", JP: "15" }
      },
      fitGuide: {
        "XS": { fit: "slim", description: "Fitted silhouette with a modern cut", modelHeight: 170, modelSize: "XS" },
        "S": { fit: "slim", description: "Fitted silhouette with a modern cut", modelHeight: 172, modelSize: "S" },
        "M": { fit: "regular", description: "Classic fit with comfortable ease", modelHeight: 174, modelSize: "M" },
        "L": { fit: "regular", description: "Classic fit with comfortable ease", modelHeight: 176, modelSize: "L" },
        "XL": { fit: "loose", description: "Relaxed fit with extra room", modelHeight: 178, modelSize: "XL" }
      }
    },
    colorVariants: {
      "black": {
        name: "Classic Black",
        hex: "#000000",
        images: [
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60"
        ],
        inStock: true,
        price: 99.99,
        swatchImage: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=100&auto=format&fit=crop&q=60"
      },
      "navy": {
        name: "Navy Blue",
        hex: "#000080",
        images: [
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60"
        ],
        inStock: true,
        price: 99.99,
        swatchImage: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=100&auto=format&fit=crop&q=60"
      },
      "red": {
        name: "Cherry Red",
        hex: "#FF0000",
        images: [
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format&fit=crop&q=60"
        ],
        inStock: false,
        price: 99.99,
        swatchImage: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=100&auto=format&fit=crop&q=60"
      }
    },
    fabricDetails: {
      composition: {
        "cotton": 80,
        "polyester": 15,
        "spandex": 5
      },
      care: {
        washing: [
          "Machine wash cold",
          "Use mild detergent",
          "Do not bleach",
          "Wash with similar colors"
        ],
        drying: [
          "Tumble dry low",
          "Remove promptly",
          "Do not over-dry"
        ],
        ironing: [
          "Iron on reverse side",
          "Use low heat",
          "Steam iron if needed"
        ],
        dryCleaning: [
          "Dry clean only",
          "Use professional cleaning service"
        ]
      },
      properties: {
        stretch: "slight",
        thickness: "medium",
        texture: ["smooth", "soft", "breathable"],
        season: ["spring", "summer", "fall"]
      },
      certifications: ["OEKO-TEX", "GOTS", "Fair Trade"],
      sustainability: {
        recycled: true,
        organic: true,
        fairTrade: true,
        ecoFriendly: true
      }
    }
  })

  const [cameraParams, setCameraParams] = useState<CameraParameters>({
    view_angle: "front",
    distance_m: 2.0,
    focal_length_mm: 50,
    aperture_f: 2.8,
    lighting: "studio_softbox",
    background: "white",
  })

  const [selectedCategory, setSelectedCategory] = useState("clothes")
  const [lighting, setLighting] = useState([50])
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selectedSubNav, setSelectedSubNav] = useState("model-tryon")

  // Add new state for the result image
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Update model parameters
  const updateModelParam = <K extends keyof ModelParameters>(key: K, value: ModelParameters[K]) => {
    setModelParams((prev) => ({ ...prev, [key]: value }))
  }

  // Update camera parameters
  const updateCameraParam = <K extends keyof CameraParameters>(key: K, value: CameraParameters[K]) => {
    setCameraParams((prev) => ({ ...prev, [key]: value }))
  }

  // Modify the handleGenerate function
  const handleGenerate = async () => {
    setIsGenerating(true)
    const request: Partial<GenerationRequest> = {
      model: modelParams,
      product: productParams as ProductParameters,
      camera: cameraParams,
    }
    console.log("Generation Request:", request)
    
    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, we'll use a placeholder image
      setResultImage("https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&auto=format&fit=crop&q=60")
      setIsGenerating(false)
    }, 2000)
  }

  const categories = [
    { id: "clothes", label: "Clothes", icon: "👕", active: true },
    { id: "bags", label: "Bags", icon: "👜", active: false },
    { id: "jewelry", label: "Jewelry", icon: "💎", active: false },
    { id: "home", label: "Home", icon: "🏠", active: false },
    { id: "shoes", label: "Shoes", icon: "👟", active: false },
  ]

  const subNavItems = [
    { id: "model-tryon", label: "Model Try-On", active: true },
    { id: "size-guide", label: "Size Guide", active: false },
    { id: "color-variants", label: "Color Variants", active: false },
    { id: "fabric-view", label: "Fabric View", active: false },
  ]

  const poses = [
    { id: "front", icon: User, label: "Front" },
    { id: "¾-front", icon: Zap, label: "3/4 Front" },
    { id: "side", icon: Hand, label: "Side" },
    { id: "back", icon: Bed, label: "Back" },
    { id: "overhead", icon: Users, label: "Overhead" },
  ]

  // Modify the default case in renderSubNavContent
  const renderSubNavContent = () => {
    switch (selectedSubNav) {
      case "size-guide":
        return productParams.sizeGuide ? (
          <SizeGuide sizeGuide={productParams.sizeGuide} />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">No size guide available for this product.</p>
          </div>
        )
      case "color-variants":
        return productParams.colorVariants ? (
          <ColorVariants colorVariants={productParams.colorVariants} />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">No color variants available for this product.</p>
          </div>
        )
      case "fabric-view":
        return productParams.fabricDetails ? (
          <FabricView fabricDetails={productParams.fabricDetails} />
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">No fabric details available for this product.</p>
          </div>
        )
      default:
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Upload Area */}
            <Card className="h-[600px] border-2 border-dashed border-gray-300 bg-white">
              <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">Drag & drop your product image here</p>
                  <p className="text-gray-400">or</p>
                </div>
                <Button variant="outline" className="bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100">
                  Browse Files
                </Button>
              </CardContent>
            </Card>

            {/* Result Area */}
            <Card className="h-[600px] bg-white">
              <CardContent className="flex flex-col items-center justify-center h-full">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600">Generating your try-on...</p>
                  </div>
                ) : resultImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={resultImage}
                      alt="Try-on result"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button variant="outline" size="sm" className="bg-white">
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white">
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Your try-on will appear here</p>
                    <p className="text-sm text-gray-400">Upload an image and click Generate to see the result</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-200 rounded-lg flex items-center justify-center">
              <span className="text-pink-600 font-bold">👕</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">FashionAI Studio</h1>
          </div>
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Templates
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              History
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Account
            </a>
          </nav>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-pink-100 text-pink-700 border-b-2 border-pink-500"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {subNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSubNav(item.id)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedSubNav === item.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Content Area */}
        <div className="flex-1 p-6">
          {renderSubNavContent()}
        </div>

        {/* Settings Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Model Settings</h2>

          {/* Model Profile - Based on Model Parameters Table */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Gender</Label>
            <Select
              value={modelParams.gender}
              onValueChange={(value: "female" | "male" | "non_binary") => updateModelParam("gender", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="non_binary">Non-Binary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Age Range</Label>
            <Select value={modelParams.age_range} onValueChange={(value: any) => updateModelParam("age_range", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teen">Teen</SelectItem>
                <SelectItem value="20-30">20-30</SelectItem>
                <SelectItem value="30-45">30-45</SelectItem>
                <SelectItem value="45-60+">45-60+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Body Shape</Label>
            <Select
              value={modelParams.body_shape}
              onValueChange={(value: any) => updateModelParam("body_shape", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectangle">Rectangle</SelectItem>
                <SelectItem value="pear">Pear</SelectItem>
                <SelectItem value="hourglass">Hourglass</SelectItem>
                <SelectItem value="inverted_triangle">Inverted Triangle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Height (cm)</Label>
            <Input
              type="number"
              value={modelParams.height_cm}
              onChange={(e) => updateModelParam("height_cm", Number.parseInt(e.target.value))}
              min="140"
              max="200"
            />
          </div>

          {/* Pose Selection - Based on Model Parameters Table */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3">Pose</Label>
            <div className="grid grid-cols-3 gap-2">
              {poses.map((pose) => {
                const IconComponent = pose.icon
                return (
                  <button
                    key={pose.id}
                    onClick={() => updateModelParam("pose", pose.id as any)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      modelParams.pose === pose.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    title={pose.label}
                  >
                    <IconComponent className="w-6 h-6 mx-auto text-gray-600" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Lighting - Based on Camera Parameters Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-gray-700">Lighting</Label>
              <span className="text-sm text-gray-500">{lighting[0]}%</span>
            </div>
            <Select value={cameraParams.lighting} onValueChange={(value: any) => updateCameraParam("lighting", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="studio_softbox">Studio Softbox</SelectItem>
                <SelectItem value="outdoor_sunny">Outdoor Sunny</SelectItem>
                <SelectItem value="indoor_warm">Indoor Warm</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Options - Based on Camera Parameters Table */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900">
              Advanced Options
              <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">View Angle</Label>
                <Select
                  value={cameraParams.view_angle}
                  onValueChange={(value: any) => updateCameraParam("view_angle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front</SelectItem>
                    <SelectItem value="side">Side</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="45deg">45 Degree</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Background</Label>
                <Select
                  value={cameraParams.background}
                  onValueChange={(value: any) => updateCameraParam("background", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Distance (m)</Label>
                <Input
                  type="number"
                  value={cameraParams.distance_m}
                  onChange={(e) => updateCameraParam("distance_m", Number.parseFloat(e.target.value))}
                  min="0.5"
                  max="5"
                  step="0.1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Focal Length (mm)</Label>
                <Select
                  value={cameraParams.focal_length_mm.toString()}
                  onValueChange={(value) => updateCameraParam("focal_length_mm", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="35">35mm</SelectItem>
                    <SelectItem value="50">50mm</SelectItem>
                    <SelectItem value="85">85mm</SelectItem>
                    <SelectItem value="135">135mm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Aperture (f-stop)</Label>
                <Input
                  type="number"
                  value={cameraParams.aperture_f}
                  onChange={(e) => updateCameraParam("aperture_f", Number.parseFloat(e.target.value))}
                  min="1.4"
                  max="16"
                  step="0.1"
                />
              </div>

              {/* Race/Ethnicity - Fitzpatrick Skin Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">Skin Type (Fitzpatrick)</Label>
                <Select
                  value={modelParams.race_ethnicity}
                  onValueChange={(value) => updateModelParam("race_ethnicity", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Type I">Type I (Very Fair)</SelectItem>
                    <SelectItem value="Type II">Type II (Fair)</SelectItem>
                    <SelectItem value="Type III">Type III (Medium)</SelectItem>
                    <SelectItem value="Type IV">Type IV (Olive)</SelectItem>
                    <SelectItem value="Type V">Type V (Brown)</SelectItem>
                    <SelectItem value="Type VI">Type VI (Dark Brown)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Generate Button */}
          <Button onClick={handleGenerate} className="w-full mt-8 bg-pink-600 hover:bg-pink-700">
            Generate Try-On
          </Button>

          {/* Debug Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
            <p className="font-medium mb-1">Current Parameters:</p>
            <p>
              Model: {modelParams.gender}, {modelParams.age_range}, {modelParams.body_shape}
            </p>
            <p>
              Camera: {cameraParams.view_angle}, {cameraParams.lighting}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
