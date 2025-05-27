// Model Parameters Table
export interface ModelParameters {
  gender: "female" | "male" | "non_binary"
  age_range: "teen" | "20-30" | "30-45" | "45-60+"
  race_ethnicity: string // open list or Fitzpatrick skin type
  body_shape: "rectangle" | "pear" | "hourglass" | "inverted_triangle"
  height_cm: number
  pose: "front" | "¾-front" | "side" | "back" | "overhead"
  // Optional extras
  tattoos?: string
  hair_length?: string
  facial_expression?: string
}

// Product Parameters Table
export interface ProductParameters {
  category: "bag" | "wallet" | "dress" | "shirt" | "pants" | "shoes" | "jewelry"
  image: string // binary / URL
  dimensions: {
    h_cm: number
    w_cm: number
    d_cm?: number // optional depth for bags, diameter for jewelry
    weight?: number // optional
  }
  metadata: {
    brand?: string
    material?: string
    colour?: string
    price_tier?: "budget" | "mid" | "luxury"
  }
}

// Camera/Rendering Parameters Table
export interface CameraParameters {
  view_angle: "front" | "side" | "top" | "45deg"
  distance_m: number
  focal_length_mm: number
  aperture_f: number
  lighting: "studio_softbox" | "outdoor_sunny" | "indoor_warm" | "flat"
  background: "white" | "lifestyle" | "transparent"
}

// Combined generation request
export interface GenerationRequest {
  model: ModelParameters
  product: ProductParameters
  camera: CameraParameters
}
