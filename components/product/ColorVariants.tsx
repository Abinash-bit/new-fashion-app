import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProductParameters } from "@/types/fashion-ai"

interface ColorVariantsProps {
  colorVariants: ProductParameters["colorVariants"]
  onColorSelect?: (colorId: string) => void
}

export function ColorVariants({ colorVariants, onColorSelect }: ColorVariantsProps) {
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId)
    onColorSelect?.(colorId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Color Options</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-md",
              viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"
            )}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-md",
              viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"
            )}
          >
            List
          </button>
        </div>
      </div>

      <div className={cn(
        "gap-4",
        viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "space-y-4"
      )}>
        {Object.entries(colorVariants).map(([colorId, color]) => (
          <Card
            key={colorId}
            className={cn(
              "cursor-pointer transition-all",
              selectedColor === colorId ? "ring-2 ring-primary" : "hover:shadow-md"
            )}
            onClick={() => handleColorSelect(colorId)}
          >
            <CardContent className="p-4">
              <div className="aspect-square relative mb-4">
                <img
                  src={color.images[0]}
                  alt={color.name}
                  className="w-full h-full object-cover rounded-md"
                />
                {!color.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{color.name}</h3>
                  {color.price && (
                    <span className="text-sm font-medium">${color.price}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.swatchImage && (
                    <img
                      src={color.swatchImage}
                      alt={`${color.name} swatch`}
                      className="w-6 h-6 object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  {color.inStock ? (
                    <Badge variant="secondary">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedColor && (
        <Tabs defaultValue="images" className="mt-8">
          <TabsList>
            <TabsTrigger value="images">Product Images</TabsTrigger>
            <TabsTrigger value="details">Color Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {colorVariants[selectedColor].images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${colorVariants[selectedColor].name} view ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Color Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Color Name</dt>
                    <dd className="mt-1">{colorVariants[selectedColor].name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Hex Code</dt>
                    <dd className="mt-1">{colorVariants[selectedColor].hex}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Availability</dt>
                    <dd className="mt-1">
                      {colorVariants[selectedColor].inStock ? "In Stock" : "Out of Stock"}
                    </dd>
                  </div>
                  {colorVariants[selectedColor].price && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Price</dt>
                      <dd className="mt-1">${colorVariants[selectedColor].price}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 