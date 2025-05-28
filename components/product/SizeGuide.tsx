import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProductParameters } from "@/types/fashion-ai"

interface SizeGuideProps {
  sizeGuide: ProductParameters["sizeGuide"]
  onSizeSelect?: (size: string) => void
}

export function SizeGuide({ sizeGuide, onSizeSelect }: SizeGuideProps) {
  const [selectedRegion, setSelectedRegion] = React.useState("US")
  const [userMeasurements, setUserMeasurements] = React.useState({
    chest: "",
    waist: "",
    hips: "",
  })

  const handleMeasurementChange = (key: string, value: string) => {
    setUserMeasurements(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="measurements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="international">International Sizes</TabsTrigger>
          <TabsTrigger value="fit">Fit Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="measurements">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chest (cm)</Label>
                    <Input
                      type="number"
                      value={userMeasurements.chest}
                      onChange={(e) => handleMeasurementChange("chest", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Waist (cm)</Label>
                    <Input
                      type="number"
                      value={userMeasurements.waist}
                      onChange={(e) => handleMeasurementChange("waist", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hips (cm)</Label>
                    <Input
                      type="number"
                      value={userMeasurements.hips}
                      onChange={(e) => handleMeasurementChange("hips", e.target.value)}
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Size</TableHead>
                      <TableHead>Chest</TableHead>
                      <TableHead>Waist</TableHead>
                      <TableHead>Hips</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(sizeGuide.measurements).map(([size, measurements]) => (
                      <TableRow key={size}>
                        <TableCell>{size}</TableCell>
                        <TableCell>{measurements.chest} cm</TableCell>
                        <TableCell>{measurements.waist} cm</TableCell>
                        <TableCell>{measurements.hips} cm</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="international">
          <Card>
            <CardHeader>
              <CardTitle>International Size Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="EU">European Union</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="JP">Japan</SelectItem>
                  </SelectContent>
                </Select>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Size</TableHead>
                      <TableHead>{selectedRegion}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(sizeGuide.internationalSizes).map(([size, conversions]) => (
                      <TableRow key={size}>
                        <TableCell>{size}</TableCell>
                        <TableCell>{conversions[selectedRegion as keyof typeof conversions]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fit">
          <Card>
            <CardHeader>
              <CardTitle>Fit Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(sizeGuide.fitGuide).map(([size, fit]) => (
                  <div key={size} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Size {size}</h3>
                    <p className="text-sm text-gray-600 mb-2">{fit.description}</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        Fit: {fit.fit}
                      </span>
                      {fit.modelHeight && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          Model Height: {fit.modelHeight}cm
                        </span>
                      )}
                      {fit.modelSize && (
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                          Model Size: {fit.modelSize}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 