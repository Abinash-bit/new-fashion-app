import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProductParameters } from "@/types/fashion-ai"

interface FabricViewProps {
  fabricDetails: ProductParameters["fabricDetails"]
}

export function FabricView({ fabricDetails }: FabricViewProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="composition">Composition</TabsTrigger>
          <TabsTrigger value="care">Care Guide</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Fabric Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Properties */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Properties</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Stretch</p>
                      <Badge variant="secondary">{fabricDetails.properties.stretch}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Thickness</p>
                      <Badge variant="secondary">{fabricDetails.properties.thickness}</Badge>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Texture</p>
                      <div className="flex flex-wrap gap-2">
                        {fabricDetails.properties.texture.map((texture: string, index: number) => (
                          <Badge key={index} variant="outline">{texture}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Season</p>
                      <div className="flex flex-wrap gap-2">
                        {fabricDetails.properties.season.map((season: string, index: number) => (
                          <Badge key={index} variant="outline">{season}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                {fabricDetails.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {fabricDetails.certifications.map((cert: string, index: number) => (
                        <Badge key={index} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="composition">
          <Card>
            <CardHeader>
              <CardTitle>Fabric Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(fabricDetails.composition).map(([material, percentage]) => (
                  <div key={material}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{material}</span>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                    <Progress value={Number(percentage)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care">
          <Card>
            <CardHeader>
              <CardTitle>Care Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Washing</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {fabricDetails.care.washing.map((instruction: string, index: number) => (
                      <li key={index} className="text-gray-600">{instruction}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Drying</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {fabricDetails.care.drying.map((instruction: string, index: number) => (
                      <li key={index} className="text-gray-600">{instruction}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Ironing</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {fabricDetails.care.ironing.map((instruction: string, index: number) => (
                      <li key={index} className="text-gray-600">{instruction}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Dry Cleaning</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {fabricDetails.care.dryCleaning.map((instruction: string, index: number) => (
                      <li key={index} className="text-gray-600">{instruction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fabricDetails.sustainability.recycled}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="text-sm font-medium">Recycled Materials</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fabricDetails.sustainability.organic}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="text-sm font-medium">Organic</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fabricDetails.sustainability.fairTrade}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="text-sm font-medium">Fair Trade</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fabricDetails.sustainability.ecoFriendly}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="text-sm font-medium">Eco-Friendly</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 