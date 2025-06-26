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
import { ClothingPhotographyTabs } from "@/components/product/ClothingPhotographyTabs"

export default function FashionAIStudio() {
  // State based on the parameter tables
  const [modelParams, setModelParams] = useState<ModelParameters>({
    gender: "female",
    age_range: "18-25",
    race_ethnicity: "white",
    body_shape: "hourglass",
    height_cm: 170,
    pose: "standing",
    garment_type: "clothing"
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
      },
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
    focal_length_mm: 50.0,
    aperture_f: 2.8,
    lighting: "studio_softbox",
    background: "white"
  })

  const [selectedCategory, setSelectedCategory] = useState("clothes")
  const [selectedTab, setSelectedTab] = useState("lifestyle")
  const [lighting, setLighting] = useState([50])
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selectedSubNav, setSelectedSubNav] = useState("model-tryon")

  // Add new state for the result image
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedGarmentImage, setUploadedGarmentImage] = useState<File | null>(null)

  // Add new state for bag-specific features
  const [bagSubNav, setBagSubNav] = useState("try-on")
  const [uploadedBagImage, setUploadedBagImage] = useState<string | null>(null)
  const [bagDimensions, setBagDimensions] = useState({
    length: "",
    width: "",
    height: "",
    depth: ""
  })
  const [occasion, setOccasion] = useState("casual")
  const [outfitStyle, setOutfitStyle] = useState("modern")

  // Add new state for wallet-specific features
  const [walletSubNav, setWalletSubNav] = useState("size-guide")
  const [uploadedWalletImages, setUploadedWalletImages] = useState<string[]>([])
  const [walletDimensions, setWalletDimensions] = useState({
    length: "",
    width: "",
    height: "",
    depth: "",
    length2: "",
    width2: "",
    height2: ""
  })

  // Add new state for jewelry-specific features
  const [jewelrySubNav, setJewelrySubNav] = useState("model-shot")
  const [uploadedJewelryImages, setUploadedJewelryImages] = useState<string[]>([])
  const [jewelryDimensions, setJewelryDimensions] = useState({
    length: "",
    width: "",
    height: ""
  })

  // Add new state for shoe-specific features
  const [shoeSubNav, setShoeSubNav] = useState("model-shot")
  const [uploadedShoeImages, setUploadedShoeImages] = useState<string[]>([])

  // Add new state for background edit form fields
  const [backgroundEditParams, setBackgroundEditParams] = useState({
    garment_type: "",
    surface_type: "",
    camera_view_angle: "",
    camera_distance_meters: "",
    camera_focal_length_mm: "",
    camera_aperture_f_number: "",
    camera_lighting_condition: "",
    camera_background: ""
  })

  // inside bags tab inside model tryon simulation when i am uploading the bag image and in model settings when i click on the generate tryon button  the tryon api is not getting called only that tab is facing problem do not disturb any other tab.

  // Bag-specific navigation items
  const bagNavItems = [
    { id: "try-on", label: "Model Try-On Simulation" },
    { id: "fits-inside", label: "What Fits Inside" },
    { id: "size-comparison", label: "Smart Size Comparison" },
    { id: "occasion-styling", label: "Occasion-Based Styling" },
    { id: "outfit-visualization", label: "Outfit & Product Visualization" },
    { id: "multiview", label: "Multiview" },
    { id: "background-edit", label: "Background Edit" },
    { id: "detail-shots", label: "Detail Shots" },
  ]

  // Wallet-specific navigation items
  const walletNavItems = [
    { id: "size-guide", label: "Interactive Size Guide" },
    { id: "cross-category", label: "Cross-Category Pairing" },
    { id: "occasion-styling", label: "Occasion-Based Styling" },
    { id: "detail-shots", label: "Detail Shots" },
    { id: "multiview", label: "Multiview" },
    { id: "background-edit", label: "Background Edit" },
  ]

  // Jewelry-specific navigation items
  const jewelryNavItems = [
    { id: "model-shot", label: "AI Model Shot Generator" },
    { id: "outfit-match", label: "Outfit-to-Jewelry Match Visualizer" },
    { id: "occasion-styling", label: "Occasion-Based Styling Suggestions" },
    { id: "size-comparison", label: "Visual Size Comparison Tool" }
  ]

  // Shoe-specific navigation items
  const shoeNavItems = [
    { id: "model-shot", label: "Model Shot Generator" },
    { id: "outfit-match", label: "Outfit Match Preview" },
    { id: "multiview", label: "Multiview" },
    { id: "background-edit", label: "Background Edit" },
    { id: "detail-shots", label: "Detail Shots" },
  ]

  // Modify the updateModelParam function
  const updateModelParam = <K extends keyof ModelParameters>(key: K, value: ModelParameters[K]) => {
    setModelParams(prev => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  }

  // Modify the updateCameraParam function
  const updateCameraParam = <K extends keyof CameraParameters>(key: K, value: CameraParameters[K]) => {
    setCameraParams(prev => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  }

  // Modify the clearState function to be more selective
  const clearState = () => {
    // Only clear if there's actually something to clear
    if (uploadedGarmentImage) setUploadedGarmentImage(null);
    if (uploadedBagImage) setUploadedBagImage(null);
    if (uploadedWalletImages.length > 0) setUploadedWalletImages([]);
    if (uploadedJewelryImages.length > 0) setUploadedJewelryImages([]);
    if (uploadedShoeImages.length > 0) setUploadedShoeImages([]);
    if (resultImage) setResultImage(null);
    
    // Only reset dimensions if they have values
    if (Object.values(bagDimensions).some(v => v !== "")) {
      setBagDimensions({
        length: "",
        width: "",
        height: "",
        depth: ""
      });
    }
    
    if (Object.values(walletDimensions).some(v => v !== "")) {
      setWalletDimensions({
        length: "",
        width: "",
        height: "",
        depth: "",
        length2: "",
        width2: "",
        height2: ""
      });
    }
    
    if (Object.values(jewelryDimensions).some(v => v !== "")) {
      setJewelryDimensions({
        length: "",
        width: "",
        height: ""
      });
    }
    
    // Clear background edit parameters if they have values
    if (Object.values(backgroundEditParams).some(v => v !== "")) {
      setBackgroundEditParams({
        garment_type: "",
        surface_type: "",
        camera_view_angle: "",
        camera_distance_meters: "",
        camera_focal_length_mm: "",
        camera_aperture_f_number: "",
        camera_lighting_condition: "",
        camera_background: ""
      });
    }
  };

  // Modify the tab change handlers to be more selective
  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategory !== categoryId) {
      clearState();
      setSelectedCategory(categoryId);
    }
  };

  const handleBagSubNavChange = (subNavId: string) => {
    if (bagSubNav !== subNavId) {
      clearState();
      setBagSubNav(subNavId);
    }
  };

  const handleWalletSubNavChange = (subNavId: string) => {
    if (walletSubNav !== subNavId) {
      clearState();
      setWalletSubNav(subNavId);
    }
  };

  const handleJewelrySubNavChange = (subNavId: string) => {
    if (jewelrySubNav !== subNavId) {
      clearState();
      setJewelrySubNav(subNavId);
    }
  };

  const handleShoeSubNavChange = (subNavId: string) => {
    if (shoeSubNav !== subNavId) {
      clearState();
      setShoeSubNav(subNavId);
    }
  };

  const handleClothesTabChange = (tabId: string) => {
    if (selectedTab !== tabId) {
      clearState();
      setSelectedTab(tabId);
    }
  };

  // Modify the handleGenerate function
  const handleGenerate = async () => {
    if (!uploadedGarmentImage) return

    setIsGenerating(true)
    let formData = new FormData()

    try {
      // Check if we're in shoes outfit match section
      if (selectedCategory === 'shoes' && shoeSubNav === 'outfit-match') {
        if (!uploadedShoeImages[0]) {
          console.log('Missing shoe image for outfit match');
          setIsGenerating(false);
          return;
        }

        // Add first image (File object)
        formData.append('garment_images', uploadedGarmentImage);
        
        // Convert second image URL to File object
        try {
          const response = await fetch(uploadedShoeImages[0]);
          const blob = await response.blob();
          const file = new File([blob], 'second_image.png', { type: blob.type });
          formData.append('garment_images', file);
        } catch (error) {
          console.error('Error converting second image:', error);
          setIsGenerating(false);
          return;
        }
        
        // Add model and camera parameters
        formData.append('camera_lighting_condition', cameraParams.lighting);
        formData.append('garment_type', modelParams.garment_type);
        formData.append('camera_focal_length_mm', cameraParams.focal_length_mm.toString());
        formData.append('model_race_ethnicity', modelParams.race_ethnicity);
        formData.append('model_age_range', modelParams.age_range);
        formData.append('model_pose', modelParams.pose);
        formData.append('camera_background', cameraParams.background);
        formData.append('camera_view_angle', cameraParams.view_angle);
        formData.append('model_gender', modelParams.gender);
        formData.append('camera_aperture_f_number', cameraParams.aperture_f.toString());
        formData.append('camera_distance_meters', cameraParams.distance_m.toString());
        formData.append('model_body_shape', modelParams.body_shape);

        try {
          const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/outfit-match', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API call failed: ${errorText}`);
          }

          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setResultImage(base64data);
            setIsGenerating(false);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error in outfit match:', error);
          setIsGenerating(false);
        }
        return;
      }

      // Check if we're in jewelry size comparison section
      if (selectedCategory === 'jewelry' && jewelrySubNav === 'size-comparison') {
        if (!jewelryDimensions.length || !jewelryDimensions.width || !jewelryDimensions.height) {
          console.log('Missing dimensions for size comparison');
          setIsGenerating(false);
          return;
        }

        // Add image and dimensions
        formData.append('garment_images', uploadedGarmentImage);
        formData.append('garment_type', modelParams.garment_type);
        formData.append('product_height', jewelryDimensions.height);
        formData.append('product_width', jewelryDimensions.width);
        formData.append('product_length', jewelryDimensions.length);

        try {
          const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/size', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API call failed: ${errorText}`);
          }

          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setResultImage(base64data);
            setIsGenerating(false);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error in size comparison:', error);
          setIsGenerating(false);
        }
        return;
      }

      // Check if we're in jewelry occasion-based styling section
      if (selectedCategory === 'jewelry' && jewelrySubNav === 'occasion-styling') {
        formData.append('garment_images', uploadedGarmentImage)
        
        // Add model and camera parameters
        formData.append('camera_lighting_condition', cameraParams.lighting)
        formData.append('garment_type', 'jewellery and watches')
        formData.append('camera_focal_length_mm', cameraParams.focal_length_mm.toString())
        formData.append('model_race_ethnicity', modelParams.race_ethnicity)
        formData.append('model_age_range', modelParams.age_range)
        formData.append('model_pose', modelParams.pose)
        formData.append('camera_background', cameraParams.background)
        formData.append('camera_view_angle', cameraParams.view_angle)
        formData.append('model_gender', modelParams.gender)
        formData.append('camera_aperture_f_number', cameraParams.aperture_f.toString())
        formData.append('camera_distance_meters', cameraParams.distance_m.toString())
        formData.append('model_body_shape', modelParams.body_shape)

        try {
          const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/occasion', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error:', errorText)
            throw new Error(`API call failed: ${errorText}`)
          }

          const blob = await response.blob()
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64data = reader.result as string
            setResultImage(base64data)
            setIsGenerating(false)
          }
          reader.readAsDataURL(blob)
        } catch (error) {
          console.error('Error in occasion-based styling:', error)
          setIsGenerating(false)
        }
        return
      }

      // Check if we're in outfit-to-jewelry match section
      if (selectedCategory === 'jewelry' && jewelrySubNav === 'outfit-match') {
        if (!uploadedJewelryImages[0]) {
          console.log('Missing jewelry image for outfit match');
          setIsGenerating(false);
          return;
        }

        // Add first image (File object)
        formData.append('garment_images', uploadedGarmentImage);
        
        // Convert second image URL to File object
        try {
          const response = await fetch(uploadedJewelryImages[0]);
          const blob = await response.blob();
          const file = new File([blob], 'second_image.png', { type: blob.type });
          formData.append('garment_images', file);
        } catch (error) {
          console.error('Error converting second image:', error);
          setIsGenerating(false);
          return;
        }
        
        // Add model and camera parameters
        formData.append('camera_lighting_condition', cameraParams.lighting);
        formData.append('garment_type', modelParams.garment_type);
        formData.append('camera_focal_length_mm', cameraParams.focal_length_mm.toString());
        formData.append('model_race_ethnicity', modelParams.race_ethnicity);
        formData.append('model_age_range', modelParams.age_range);
        formData.append('model_pose', modelParams.pose);
        formData.append('camera_background', cameraParams.background);
        formData.append('camera_view_angle', cameraParams.view_angle);
        formData.append('model_gender', modelParams.gender);
        formData.append('camera_aperture_f_number', cameraParams.aperture_f.toString());
        formData.append('camera_distance_meters', cameraParams.distance_m.toString());
        formData.append('model_body_shape', modelParams.body_shape);

        try {
          const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/outfit-match', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API call failed: ${errorText}`);
          }

          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setResultImage(base64data);
            setIsGenerating(false);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error in outfit-to-jewelry match:', error);
          setIsGenerating(false);
        }
        return;
      }

      // Check if we're in cross-category pairing section
      if (selectedCategory === 'wallets' && walletSubNav === 'cross-category') {
        if (!uploadedWalletImages[0]) {
          console.log('Missing wallet image for cross-category pairing');
          setIsGenerating(false);
          return;
        }

        // Add first image (File object)
        formData.append('garment_images', uploadedGarmentImage);
        
        // Convert second image URL to File object
        try {
          const response = await fetch(uploadedWalletImages[0]);
          const blob = await response.blob();
          const file = new File([blob], 'second_image.png', { type: blob.type });
          formData.append('garment_images', file);
        } catch (error) {
          console.error('Error converting second image:', error);
          setIsGenerating(false);
          return;
        }
        
        // Add model and camera parameters
        formData.append('camera_lighting_condition', cameraParams.lighting);
        formData.append('garment_type', modelParams.garment_type);
        formData.append('camera_focal_length_mm', cameraParams.focal_length_mm.toString());
        formData.append('model_race_ethnicity', modelParams.race_ethnicity);
        formData.append('model_age_range', modelParams.age_range);
        formData.append('model_pose', modelParams.pose);
        formData.append('camera_background', cameraParams.background);
        formData.append('camera_view_angle', cameraParams.view_angle);
        formData.append('model_gender', modelParams.gender);
        formData.append('camera_aperture_f_number', cameraParams.aperture_f.toString());
        formData.append('camera_distance_meters', cameraParams.distance_m.toString());
        formData.append('model_body_shape', modelParams.body_shape);

        try {
          const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/outfit-match', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`API call failed: ${errorText}`);
          }

          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setResultImage(base64data);
            setIsGenerating(false);
          };
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error in cross-category pairing:', error);
          setIsGenerating(false);
        }
        return;
      }

      // Check if we're in wallets occasion-based styling section
      if (selectedCategory === 'wallets' && walletSubNav === 'occasion-styling') {
        formData.append('garment_images', uploadedGarmentImage)
        
        // Add model and camera parameters
        formData.append('camera_lighting_condition', cameraParams.lighting)
        formData.append('garment_type', 'wallet')
        formData.append('camera_focal_length_mm', cameraParams.focal_length_mm.toString())
        formData.append('model_race_ethnicity', modelParams.race_ethnicity)
        formData.append('model_age_range', modelParams.age_range)
        formData.append('model_pose', modelParams.pose)
        formData.append('camera_background', cameraParams.background)
        formData.append('camera_view_angle', cameraParams.view_angle)
        formData.append('model_gender', modelParams.gender)
        formData.append('camera_aperture_f_number', cameraParams.aperture_f.toString())
        formData.append('camera_distance_meters', cameraParams.distance_m.toString())
        formData.append('model_body_shape', modelParams.body_shape)

        try {
          const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/occasion', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error:', errorText)
            throw new Error(`API call failed: ${errorText}`)
          }

          const blob = await response.blob()
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64data = reader.result as string
            setResultImage(base64data)
            setIsGenerating(false)
          }
          reader.readAsDataURL(blob)
        } catch (error) {
          console.error('Error in occasion-based styling:', error)
          setIsGenerating(false)
        }
        return
      }

      // Original try-on API logic for other sections
      formData.append('garment_images', uploadedGarmentImage)

      // Add other parameters for try-on API
      const params = {
        camera_lighting_condition: cameraParams.lighting.toLowerCase(),
        garment_type: 'clothing',
        camera_focal_length_mm: cameraParams.focal_length_mm.toString(),
        model_race_ethnicity: modelParams.race_ethnicity.toLowerCase(),
        model_age_range: modelParams.age_range,
        model_pose: modelParams.pose.toLowerCase(),
        camera_background: cameraParams.background.toLowerCase(),
        camera_view_angle: cameraParams.view_angle.toLowerCase(),
        model_gender: modelParams.gender.toLowerCase(),
        camera_aperture_f_number: cameraParams.aperture_f.toString(),
        camera_distance_meters: cameraParams.distance_m.toString(),
        model_body_shape: modelParams.body_shape.toLowerCase()
      }

      // Add parameters to FormData for try-on API
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value)
      })

      let endpoint = 'https://usecase-backend.gennoctua.com/api/v1/tryon'
      let requestFormData = formData
      
      // Use different endpoint based on the current section
      if (selectedCategory === 'bags' && bagSubNav === 'occasion-styling') {
        endpoint = 'https://usecase-backend.gennoctua.com/api/v1/occasion'
      } else if (selectedCategory === 'clothes' && selectedTab === 'flatlay') {
        endpoint = 'https://usecase-backend.gennoctua.com/api/v1/mannequin'
        // For mannequin API, we only need the garment image
        requestFormData = new FormData()
        requestFormData.append('garment_images', uploadedGarmentImage)
      } else if (selectedCategory === 'clothes' && selectedTab === 'details') {
        endpoint = 'https://usecase-backend.gennoctua.com/api/v1/detail'
        // For detail API, we only need the garment image
        requestFormData = new FormData()
        requestFormData.append('garment_images', uploadedGarmentImage)
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: requestFormData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API call failed:', errorText)
        throw new Error(`API call failed: ${errorText}`)
      }

      // Get the image blob from response
      const imageBlob = await response.blob()
      
      // Convert blob to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setResultImage(reader.result as string); // base64 data URL
        setIsGenerating(false);
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.error('Error generating try-on:', error)
      setIsGenerating(false)
    }
  }

  const categories = [
    { id: "clothes", label: "Clothes", icon: "👕", active: true },
    { id: "bags", label: "Bags", icon: "👜", active: false },
    { id: "wallets", label: "Wallets", icon: "👛", active: false },
    { id: "jewelry", label: "Jewelry & Watches", icon: "💍", active: false },
    { id: "shoes", label: "Shoes", icon: "👟", active: false },
  ]

  interface SubNavItem {
    id: string
    label: string
    active: boolean
  }

  const subNavItems: SubNavItem[] = []

  // Modify the default case in renderSubNavContent
  const renderSubNavContent = () => {
    return (
      <ClothingPhotographyTabs
        onImageGenerated={setResultImage}
        onGarmentImageUpload={setUploadedGarmentImage}
        generatedImage={resultImage}
        onTabChange={handleClothesTabChange}
        isGenerating={isGenerating}
      />
    )
  }

  const poses = [
    { id: "front", icon: User, label: "Front" },
    { id: "¾-front", icon: Zap, label: "3/4 Front" },
    { id: "side", icon: Hand, label: "Side" },
    { id: "back", icon: Bed, label: "Back" },
    { id: "overhead", icon: Users, label: "Overhead" },
  ]

  // Render bag-specific content
  const renderBagContent = () => {
    switch (bagSubNav) {
      case "try-on":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Input Parameters</h3>
                  
                  {/* Bag Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Bag Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedBagImage ? (
                        <div className="relative">
                          <img src={uploadedBagImage} alt="Uploaded bag" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedBagImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Drag & drop your bag image here</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setUploadedBagImage(URL.createObjectURL(file));
                                  setUploadedGarmentImage(file); // Ensure API works from sidebar button
                                }
                              }}
                              id="bag-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('bag-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Try-On Result</h3>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Generating try-on simulation...</p>
                  </div>
                ) : resultImage ? (
                  <div className="relative">
                    <img src={resultImage} alt="Try-on result" className="w-full h-[400px] object-contain" />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Button variant="outline" size="sm">Download</Button>
                      <Button variant="outline" size="sm">Share</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <User className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">Your try-on result will appear here</p>
                    <p className="text-sm text-gray-400 mt-2">Upload a bag image to see the result</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      case "fits-inside":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Bag Dimensions</h3>
                  
                  {/* Top View Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Top View Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedBagImage ? (
                        <div className="relative">
                          <img src={uploadedBagImage} alt="Uploaded bag" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedBagImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload top view of the bag</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedBagImage(URL.createObjectURL(file))
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="bag-top-view-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('bag-top-view-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dimensions Input */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Length (cm)</Label>
                        <Input
                          type="number"
                          value={bagDimensions.length}
                          onChange={(e) => setBagDimensions(prev => ({ ...prev, length: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Width (cm)</Label>
                        <Input
                          type="number"
                          value={bagDimensions.width}
                          onChange={(e) => setBagDimensions(prev => ({ ...prev, width: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Height (cm)</Label>
                        <Input
                          type="number"
                          value={bagDimensions.height}
                          onChange={(e) => setBagDimensions(prev => ({ ...prev, height: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      console.log('Generate button clicked');
                      console.log('Current state:', {
                        uploadedGarmentImage,
                        bagDimensions,
                        isGenerating
                      });

                      if (!uploadedGarmentImage || !bagDimensions.length || !bagDimensions.width || !bagDimensions.height) {
                        console.log('Missing required fields');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('product_height', bagDimensions.height);
                        formData.append('product_width', bagDimensions.width);
                        formData.append('product_length', bagDimensions.length);
                        formData.append('garment_images', uploadedGarmentImage);

                        console.log('Sending data to whatfits API:', {
                          product_height: bagDimensions.height,
                          product_width: bagDimensions.width,
                          product_length: bagDimensions.length,
                          hasImage: !!uploadedGarmentImage
                        });

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/whatfits', {
                          method: 'POST',
                          body: formData
                        });

                        console.log('API Response status:', response.status);

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        console.log('Received image blob:', blob);

                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          console.log('Converted to base64 image');
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in what fits inside:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || !bagDimensions.length || !bagDimensions.width || !bagDimensions.height || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate What Fits Inside'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">What Fits Inside</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating visualization...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="What fits inside visualization" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👜</span>
                      </div>
                      <p className="text-gray-600">Visualization will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Enter dimensions and upload top view to see what fits</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "size-comparison":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
                  
                  {/* Bag Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Bag Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedBagImage ? (
                        <div className="relative">
                          <img src={uploadedBagImage} alt="Uploaded bag" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedBagImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload bag image for comparison</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedBagImage(URL.createObjectURL(file))
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="bag-comparison-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('bag-comparison-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dimensions Input */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Length (cm)</Label>
                        <Input 
                          type="number" 
                          value={bagDimensions.length}
                          onChange={(e) => setBagDimensions(prev => ({ ...prev, length: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Width (cm)</Label>
                        <Input 
                          type="number" 
                          value={bagDimensions.width}
                          onChange={(e) => setBagDimensions(prev => ({ ...prev, width: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Height (cm)</Label>
                        <Input 
                          type="number" 
                          value={bagDimensions.height}
                          onChange={(e) => setBagDimensions(prev => ({ ...prev, height: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage || !bagDimensions.length || !bagDimensions.width || !bagDimensions.height) {
                        console.log('Missing required fields');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_type', 'handbags');
                        formData.append('product_height', bagDimensions.height);
                        formData.append('product_width', bagDimensions.width);
                        formData.append('product_length', bagDimensions.length);
                        formData.append('garment_images', uploadedGarmentImage);

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/size', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in size comparison:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || !bagDimensions.length || !bagDimensions.width || !bagDimensions.height || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Size Comparison'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Size Comparison Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating size comparison...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Size comparison result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📏</span>
                      </div>
                      <p className="text-gray-600">Comparison visualization will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload image and enter dimensions to see comparison</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "occasion-styling":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Occasion-Based Styling</h3>
                  
                  {/* Wallet Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Wallet Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedWalletImages[0] ? (
                        <div className="relative">
                          <img src={uploadedWalletImages[0]} alt="Uploaded wallet" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedWalletImages]
                              newImages[0] = ""
                              setUploadedWalletImages(newImages)
                              setUploadedGarmentImage(null)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload wallet image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedWalletImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedWalletImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="wallet-occasion-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('wallet-occasion-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Styling Suggestions</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating styling suggestions...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Styling suggestions" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">💫</span>
                      </div>
                      <p className="text-gray-600">Styling suggestions will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload wallet image and click Generate Try-On to see suggestions</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "outfit-visualization":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Outfit & Product Visualization</h3>
                  
                  {/* First Bag Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Bag Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedBagImage ? (
                        <div className="relative">
                          <img src={uploadedBagImage} alt="Uploaded bag" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedBagImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload bag image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedBagImage(URL.createObjectURL(file))
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="bag-outfit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('bag-outfit-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Second Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Additional Product Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedShoeImages[0] ? (
                        <div className="relative">
                          <img src={uploadedShoeImages[0]} alt="Uploaded product" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedShoeImages]
                              newImages[0] = ""
                              setUploadedShoeImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload additional product image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedShoeImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedShoeImages(newImages)
                                }
                              }}
                              id="additional-product-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('additional-product-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage || !uploadedShoeImages[0]) {
                        console.log('Missing required images');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        
                        // Add both images
                        formData.append('garment_images', uploadedGarmentImage);
                        
                        // Convert second image URL to File object
                        try {
                          const response = await fetch(uploadedShoeImages[0]);
                          const blob = await response.blob();
                          const file = new File([blob], 'second_image.png', { type: blob.type });
                          formData.append('garment_images', file);
                        } catch (error) {
                          console.error('Error converting second image:', error);
                          setIsGenerating(false);
                          return;
                        }

                        // Add model and camera parameters
                        formData.append('camera_lighting_condition', cameraParams.lighting);
                        formData.append('garment_type', 'handbags');
                        formData.append('camera_focal_length_mm', cameraParams.focal_length_mm.toString());
                        formData.append('model_race_ethnicity', modelParams.race_ethnicity);
                        formData.append('model_age_range', modelParams.age_range);
                        formData.append('model_pose', modelParams.pose);
                        formData.append('camera_background', cameraParams.background);
                        formData.append('camera_view_angle', cameraParams.view_angle);
                        formData.append('model_gender', modelParams.gender);
                        formData.append('camera_aperture_f_number', cameraParams.aperture_f.toString());
                        formData.append('camera_distance_meters', cameraParams.distance_m.toString());
                        formData.append('model_body_shape', modelParams.body_shape);

                        console.log('Sending data to outfit-match API:', {
                          hasFirstImage: !!uploadedGarmentImage,
                          hasSecondImage: !!uploadedShoeImages[0],
                          modelParams,
                          cameraParams
                        });

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/outfit-match', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in outfit visualization:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || !uploadedShoeImages[0] || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Try-On'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Outfit Visualization</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating outfit visualization...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Outfit visualization" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👗</span>
                      </div>
                      <p className="text-gray-600">Outfit visualization will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload images to see visualization</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "multiview":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Multiview</h3>
                  
                  {/* Bag Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Bag Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedBagImage ? (
                        <div className="relative">
                          <img src={uploadedBagImage} alt="Uploaded bag" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedBagImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload bag image for multiview</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedBagImage(URL.createObjectURL(file))
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="bag-multiview-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('bag-multiview-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        return;
                      }
                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);
                
                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/multi_view', {
                          method: 'POST',
                          body: formData,
                        });
                
                        if (!response.ok) {
                          const errorText = await response.text();
                          throw new Error(`API call failed: ${errorText}`);
                        }
                
                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.onerror = () => {
                          console.error("Error reading blob");
                          setIsGenerating(false);
                        }
                        reader.readAsDataURL(blob);

                      } catch (error) {
                        console.error('Error generating multiview:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Multiview'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Multiview Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating multiview...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Multiview result" className="w-full h-full object-contain" />
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
                      <p className="text-gray-600">Multiview result will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload image and click Generate Multiview to see result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "background-edit":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Background Edit</h3>
                  
                  {/* Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Bag Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedBagImage ? (
                        <div className="relative">
                          <img src={uploadedBagImage} alt="Uploaded bag" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedBagImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Drag & drop your bag image here</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedBagImage(URL.createObjectURL(file))
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="bag-background-edit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('bag-background-edit-upload')?.click()}
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
                          placeholder="e.g., handbag, backpack"
                        />
                      </div>
                      <div>
                        <Label>Surface Type</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.surface_type}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, surface_type: e.target.value }))}
                          placeholder="e.g., leather, canvas"
                        />
                      </div>
                      <div>
                        <Label>Camera View Angle</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_view_angle}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_view_angle: e.target.value }))}
                          placeholder="e.g., front, side, 45-degree"
                        />
                      </div>
                      <div>
                        <Label>Camera Distance (meters)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_distance_meters}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_distance_meters: e.target.value }))}
                          placeholder="e.g., 2.0"
                        />
                      </div>
                      <div>
                        <Label>Camera Focal Length (mm)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_focal_length_mm}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_focal_length_mm: e.target.value }))}
                          placeholder="e.g., 50"
                        />
                      </div>
                      <div>
                        <Label>Camera Aperture (f-number)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_aperture_f_number}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_aperture_f_number: e.target.value }))}
                          placeholder="e.g., 2.8"
                        />
                      </div>
                      <div>
                        <Label>Camera Lighting Condition</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_lighting_condition}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_lighting_condition: e.target.value }))}
                          placeholder="e.g., natural, studio, warm"
                        />
                      </div>
                      <div>
                        <Label>Camera Background</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_background}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_background: e.target.value }))}
                          placeholder="e.g., white, lifestyle, urban"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        console.log('Missing bag image');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);
                        
                        // Add all background edit parameters with default values if not provided
                        formData.append('camera_lighting_condition', backgroundEditParams.camera_lighting_condition || 'indoor_warm');
                        formData.append('garment_type', backgroundEditParams.garment_type || 'handbags');
                        formData.append('camera_focal_length_mm', backgroundEditParams.camera_focal_length_mm || '10');
                        formData.append('camera_background', backgroundEditParams.camera_background || 'white');
                        formData.append('surface_type', backgroundEditParams.surface_type || 'string');
                        formData.append('camera_view_angle', backgroundEditParams.camera_view_angle || '30');
                        formData.append('camera_aperture_f_number', backgroundEditParams.camera_aperture_f_number || '10');
                        formData.append('camera_distance_meters', backgroundEditParams.camera_distance_meters || '6');

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/background_edit', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in background edit:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Background Edit'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Background Edit Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating background edit...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Background edit result" className="w-full h-full object-contain" />
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
                      <p className="text-sm text-gray-400 mt-2">Upload bag image and adjust parameters to see the result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "detail-shots":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Detail Shots</h3>
                  
                  {/* Bag Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Bag Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedBagImage ? (
                        <div className="relative">
                          <img src={uploadedBagImage} alt="Uploaded bag" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedBagImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Drag & drop your bag image here</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedBagImage(URL.createObjectURL(file))
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="bag-detail-shots-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('bag-detail-shots-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        console.log('Missing bag image');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/detail', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in detail shots:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Detail Shots'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detail Shots Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating detail shots...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Detail shots result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="text-gray-600">Detail shots result will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload bag image and click Generate Detail Shots to see result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Render wallet-specific content
  const renderWalletContent = () => {
    switch (walletSubNav) {
      case "size-guide":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Size Guide Input</h3>
                  
                  {/* Wallet Images Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Wallet Images (2 required)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[0, 1].map((index) => (
                        <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {uploadedWalletImages[index] ? (
                        <div className="relative">
                              <img 
                                src={uploadedWalletImages[index]} 
                                alt={`Wallet view ${index + 1}`} 
                                className="w-full h-48 object-contain" 
                              />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                                  const newImages = [...uploadedWalletImages]
                                  newImages[index] = ""
                                  setUploadedWalletImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                              <p className="text-sm text-gray-600">Upload wallet image {index + 1}</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                      const newImages = [...uploadedWalletImages]
                                      newImages[index] = URL.createObjectURL(file)
                                      setUploadedWalletImages(newImages)
                                    }
                                  }}
                                  id={`wallet-upload-${index}`}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                                  onClick={() => document.getElementById(`wallet-upload-${index}`)?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions Input */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium mb-2">Product Dimensions</h4>
                    
                    {/* First Image Dimensions */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-500">First Image Dimensions</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Length (cm)</Label>
                          <Input
                            type="number"
                            value={walletDimensions.length}
                            onChange={(e) => setWalletDimensions(prev => ({ ...prev, length: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Width (cm)</Label>
                          <Input
                            type="number"
                            value={walletDimensions.width}
                            onChange={(e) => setWalletDimensions(prev => ({ ...prev, width: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Height (cm)</Label>
                          <Input
                            type="number"
                            value={walletDimensions.height}
                            onChange={(e) => setWalletDimensions(prev => ({ ...prev, height: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Second Image Dimensions */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-500">Second Image Dimensions</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Length (cm)</Label>
                          <Input
                            type="number"
                            value={walletDimensions.length2}
                            onChange={(e) => setWalletDimensions(prev => ({ ...prev, length2: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Width (cm)</Label>
                          <Input
                            type="number"
                            value={walletDimensions.width2}
                            onChange={(e) => setWalletDimensions(prev => ({ ...prev, width2: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Height (cm)</Label>
                          <Input
                            type="number"
                            value={walletDimensions.height2}
                            onChange={(e) => setWalletDimensions(prev => ({ ...prev, height2: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedWalletImages[0] || !uploadedWalletImages[1]) {
                        console.log('Missing required images');
                        return;
                      }

                      if (!walletDimensions.length || !walletDimensions.width || !walletDimensions.height ||
                          !walletDimensions.length2 || !walletDimensions.width2 || !walletDimensions.height2) {
                        console.log('Missing required dimensions');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        
                        // Add both images
                        try {
                          // First image
                          const response1 = await fetch(uploadedWalletImages[0]);
                          const blob1 = await response1.blob();
                          const file1 = new File([blob1], 'first_image.png', { type: blob1.type });
                          formData.append('garment_images', file1);

                          // Second image
                          const response2 = await fetch(uploadedWalletImages[1]);
                          const blob2 = await response2.blob();
                          const file2 = new File([blob2], 'second_image.png', { type: blob2.type });
                          formData.append('garment_images', file2);
                        } catch (error) {
                          console.error('Error converting images:', error);
                          setIsGenerating(false);
                          return;
                        }

                        // Add dimensions
                        formData.append('product_height1', walletDimensions.height);
                        formData.append('product_width1', walletDimensions.width);
                        formData.append('product_length1', walletDimensions.length);
                        formData.append('product_height2', walletDimensions.height2);
                        formData.append('product_width2', walletDimensions.width2);
                        formData.append('product_length2', walletDimensions.length2);

                        console.log('Sending data to wallet size guide API:', {
                          hasFirstImage: !!uploadedWalletImages[0],
                          hasSecondImage: !!uploadedWalletImages[1],
                          dimensions: walletDimensions
                        });

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/walletsize', {
                          method: 'POST',
                          body: formData
                        });
                
                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }
                
                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in size guide generation:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedWalletImages[0] || !uploadedWalletImages[1] || 
                             !walletDimensions.length || !walletDimensions.width || !walletDimensions.height ||
                             !walletDimensions.length2 || !walletDimensions.width2 || !walletDimensions.height2 || 
                             isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Interactive Size Guide'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Size Guide Visualization</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating size guide...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Size guide result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📏</span>
                      </div>
                      <p className="text-gray-600">Size guide will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload images and enter dimensions to see the guide</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "cross-category":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Cross-Category Pairing</h3>
                  
                  {/* Wallet Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Wallet Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedWalletImages[0] ? (
                        <div className="relative">
                          <img src={uploadedWalletImages[0]} alt="Uploaded wallet" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedWalletImages]
                              newImages[0] = ""
                              setUploadedWalletImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload wallet image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedWalletImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedWalletImages(newImages)
                                }
                              }}
                              id="wallet-cross-category-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('wallet-cross-category-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Garment Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Garment Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedGarmentImage ? (
                        <div className="relative">
                          <img src={URL.createObjectURL(uploadedGarmentImage)} alt="Uploaded garment" className="w-full h-48 object-contain" />
                  <Button 
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedGarmentImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload garment image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="garment-cross-category-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('garment-cross-category-upload')?.click()}
                            >
                              Browse Files
                  </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cross-Category Pairing Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating pairing visualization...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Pairing result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👔</span>
                      </div>
                      <p className="text-gray-600">Pairing visualization will appear here</p>
                      <p className="text-gray-600">Styling templates will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload wallet image and click Generate Try-On to see styling options</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "occasion-styling":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Occasion-Based Styling</h3>
                  
                  {/* Wallet Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Wallet Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedWalletImages[0] ? (
                        <div className="relative">
                          <img src={uploadedWalletImages[0]} alt="Uploaded wallet" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedWalletImages]
                              newImages[0] = ""
                              setUploadedWalletImages(newImages)
                              setUploadedGarmentImage(null)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload wallet image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedWalletImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedWalletImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="wallet-occasion-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('wallet-occasion-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Styling Suggestions</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating styling suggestions...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Styling suggestions" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">💫</span>
                      </div>
                      <p className="text-gray-600">Styling suggestions will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload wallet image and click Generate Try-On to see suggestions</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "detail-shots":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Detail Shots</h3>
                  
                  {/* Wallet Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Wallet Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedWalletImages[0] ? (
                        <div className="relative">
                          <img src={uploadedWalletImages[0]} alt="Uploaded wallet" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedWalletImages]
                              newImages[0] = ""
                              setUploadedWalletImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Drag & drop your wallet image here</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedWalletImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedWalletImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="wallet-detail-shots-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('wallet-detail-shots-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        console.log('Missing wallet image');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/detail', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in detail shots:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Detail Shots'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detail Shots Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating detail shots...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Detail shots result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="text-gray-600">Detail shots result will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload wallet image and click Generate Detail Shots to see result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "multiview":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Multiview</h3>
                  
                  {/* Wallet Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Wallet Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedWalletImages[0] ? (
                        <div className="relative">
                          <img src={uploadedWalletImages[0]} alt="Uploaded wallet" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedWalletImages]
                              newImages[0] = ""
                              setUploadedWalletImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload wallet image for multiview</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedWalletImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedWalletImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="wallet-multiview-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('wallet-multiview-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        return;
                      }
                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);
                
                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/multi_view', {
                          method: 'POST',
                          body: formData,
                        });
                
                        if (!response.ok) {
                          const errorText = await response.text();
                          throw new Error(`API call failed: ${errorText}`);
                        }
                
                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.onerror = () => {
                          console.error("Error reading blob");
                          setIsGenerating(false);
                        }
                        reader.readAsDataURL(blob);

                      } catch (error) {
                        console.error('Error generating multiview:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Multiview'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Multiview Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating multiview...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Multiview result" className="w-full h-full object-contain" />
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
                      <p className="text-gray-600">Multiview result will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload wallet image and click Generate Multiview to see result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "background-edit":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Background Edit</h3>
                  
                  {/* Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Wallet Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedWalletImages[0] ? (
                        <div className="relative">
                          <img src={uploadedWalletImages[0]} alt="Uploaded wallet" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedWalletImages]
                              newImages[0] = ""
                              setUploadedWalletImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Drag & drop your wallet image here</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedWalletImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedWalletImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="wallet-background-edit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('wallet-background-edit-upload')?.click()}
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
                          placeholder="e.g., wallet, cardholder"
                        />
                      </div>
                      <div>
                        <Label>Surface Type</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.surface_type}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, surface_type: e.target.value }))}
                          placeholder="e.g., leather, canvas"
                        />
                      </div>
                      <div>
                        <Label>Camera View Angle</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_view_angle}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_view_angle: e.target.value }))}
                          placeholder="e.g., front, side, 45-degree"
                        />
                      </div>
                      <div>
                        <Label>Camera Distance (meters)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_distance_meters}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_distance_meters: e.target.value }))}
                          placeholder="e.g., 2.0"
                        />
                      </div>
                      <div>
                        <Label>Camera Focal Length (mm)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_focal_length_mm}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_focal_length_mm: e.target.value }))}
                          placeholder="e.g., 50"
                        />
                      </div>
                      <div>
                        <Label>Camera Aperture (f-number)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_aperture_f_number}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_aperture_f_number: e.target.value }))}
                          placeholder="e.g., 2.8"
                        />
                      </div>
                      <div>
                        <Label>Camera Lighting Condition</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_lighting_condition}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_lighting_condition: e.target.value }))}
                          placeholder="e.g., natural, studio, warm"
                        />
                      </div>
                      <div>
                        <Label>Camera Background</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_background}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_background: e.target.value }))}
                          placeholder="e.g., white, lifestyle, urban"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        console.log('Missing wallet image');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);
                        
                        // Add all background edit parameters with default values if not provided
                        formData.append('camera_lighting_condition', backgroundEditParams.camera_lighting_condition || 'indoor_warm');
                        formData.append('garment_type', backgroundEditParams.garment_type || 'wallet');
                        formData.append('camera_focal_length_mm', backgroundEditParams.camera_focal_length_mm || '10');
                        formData.append('camera_background', backgroundEditParams.camera_background || 'white');
                        formData.append('surface_type', backgroundEditParams.surface_type || 'string');
                        formData.append('camera_view_angle', backgroundEditParams.camera_view_angle || '30');
                        formData.append('camera_aperture_f_number', backgroundEditParams.camera_aperture_f_number || '10');
                        formData.append('camera_distance_meters', backgroundEditParams.camera_distance_meters || '6');

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/background_edit', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in background edit:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Background Edit'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Background Edit Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating background edit...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Background edit result" className="w-full h-full object-contain" />
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
                      <p className="text-sm text-gray-400 mt-2">Upload wallet image and adjust parameters to see the result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Render jewelry-specific content
  const renderJewelryContent = () => {
    switch (jewelrySubNav) {
      case "model-shot":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">AI Model Shot Generator</h3>
                  
                  {/* Jewelry Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Jewelry Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedJewelryImages[0] ? (
                        <div className="relative">
                          <img src={uploadedJewelryImages[0]} alt="Uploaded jewelry" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedJewelryImages]
                              newImages[0] = ""
                              setUploadedJewelryImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload jewelry image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedJewelryImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedJewelryImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="jewelry-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('jewelry-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
                  </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Model Shot Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                  <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating model shot...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Model shot result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">✨</span>
                      </div>
                      <p className="text-gray-600">Model shot will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload jewelry image and click Generate Try-On to see the result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "outfit-match":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Outfit-to-Jewelry Match Visualizer</h3>
                  
                  {/* Jewelry Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Jewelry Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedJewelryImages[0] ? (
                        <div className="relative">
                          <img src={uploadedJewelryImages[0]} alt="Uploaded jewelry" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedJewelryImages]
                              newImages[0] = ""
                              setUploadedJewelryImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload jewelry image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedJewelryImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedJewelryImages(newImages)
                                }
                              }}
                              id="jewelry-outfit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('jewelry-outfit-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                      </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Garment Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Garment Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedGarmentImage ? (
                        <div className="relative">
                          <img src={URL.createObjectURL(uploadedGarmentImage)} alt="Uploaded garment" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedGarmentImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload garment image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="garment-jewelry-outfit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('garment-jewelry-outfit-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                      </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Outfit Match Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating outfit match...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Outfit match result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👗</span>
                      </div>
                      <p className="text-gray-600">Outfit match will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload jewelry image to see matching outfits</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "occasion-styling":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Occasion-Based Styling Suggestions</h3>
                  
                  {/* Jewelry Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Jewelry Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedJewelryImages[0] ? (
                        <div className="relative">
                          <img src={uploadedJewelryImages[0]} alt="Uploaded jewelry" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedJewelryImages]
                              newImages[0] = ""
                              setUploadedJewelryImages(newImages)
                              setUploadedGarmentImage(null)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload jewelry image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedJewelryImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedJewelryImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="jewelry-occasion-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('jewelry-occasion-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                      </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        console.log('Missing jewelry image');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);

                        // Add model and camera parameters
                        formData.append('camera_lighting_condition', cameraParams.lighting);
                        formData.append('garment_type', 'jewellery and watches');
                        formData.append('camera_focal_length_mm', cameraParams.focal_length_mm.toString());
                        formData.append('model_race_ethnicity', modelParams.race_ethnicity);
                        formData.append('model_age_range', modelParams.age_range);
                        formData.append('model_pose', modelParams.pose);
                        formData.append('camera_background', cameraParams.background);
                        formData.append('camera_view_angle', cameraParams.view_angle);
                        formData.append('model_gender', modelParams.gender);
                        formData.append('camera_aperture_f_number', cameraParams.aperture_f.toString());
                        formData.append('camera_distance_meters', cameraParams.distance_m.toString());
                        formData.append('model_body_shape', modelParams.body_shape);

                        console.log('Sending data to occasion API:', {
                          hasImage: !!uploadedGarmentImage,
                          modelParams,
                          cameraParams
                        });

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/occasion', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in occasion-based styling:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Try-On'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Styling Suggestions</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating styling suggestions...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Styling suggestions" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">💫</span>
                      </div>
                      <p className="text-gray-600">Styling suggestions will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload jewelry image and click Generate Try-On to see suggestions</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "size-comparison":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Size Comparison</h3>
                  
                  {/* Jewelry Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Jewelry Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedJewelryImages[0] ? (
                        <div className="relative">
                          <img src={uploadedJewelryImages[0]} alt="Uploaded jewelry" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedJewelryImages]
                              newImages[0] = ""
                              setUploadedJewelryImages(newImages)
                              setUploadedGarmentImage(null)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload jewelry image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedJewelryImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedJewelryImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="jewelry-size-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('jewelry-size-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dimensions Input */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium mb-2">Product Dimensions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Length (cm)</Label>
                        <Input 
                          type="number" 
                          value={jewelryDimensions.length}
                          onChange={(e) => setJewelryDimensions(prev => ({ ...prev, length: e.target.value }))}
                          placeholder="Enter length"
                        />
                      </div>
                      <div>
                        <Label>Width (cm)</Label>
                        <Input 
                          type="number" 
                          value={jewelryDimensions.width}
                          onChange={(e) => setJewelryDimensions(prev => ({ ...prev, width: e.target.value }))}
                          placeholder="Enter width"
                        />
                      </div>
                      <div>
                        <Label>Height (cm)</Label>
                        <Input 
                          type="number" 
                          value={jewelryDimensions.height}
                          onChange={(e) => setJewelryDimensions(prev => ({ ...prev, height: e.target.value }))}
                          placeholder="Enter height"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={() => {
                      console.log('Button clicked');
                      console.log('Current state:', {
                        hasImage: !!uploadedGarmentImage,
                        dimensions: jewelryDimensions,
                        isGenerating
                      });
                      handleGenerate();
                    }}
                    disabled={!uploadedGarmentImage || !jewelryDimensions.length || !jewelryDimensions.width || !jewelryDimensions.height || isGenerating}
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-700"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Try-On'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Size Comparison Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating size comparison...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Size comparison result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📏</span>
                      </div>
                      <p className="text-gray-600">Size comparison will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload jewelry image and enter dimensions to see comparison</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Render shoe-specific content
  const renderShoeContent = () => {
    switch (shoeSubNav) {
      case "model-shot":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Model Shot Generator</h3>
                  
                  {/* Shoe Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Shoe Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedShoeImages[0] ? (
                        <div className="relative">
                          <img src={uploadedShoeImages[0]} alt="Uploaded shoe" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedShoeImages]
                              newImages[0] = ""
                              setUploadedShoeImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload shoe image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedShoeImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedShoeImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="shoe-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('shoe-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Model Shot Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating model shot...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Model shot result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👟</span>
                      </div>
                      <p className="text-gray-600">Model shot will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload shoe image and click Generate Try-On to see the result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "outfit-match":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Outfit Match Preview</h3>
                  
                  {/* Shoe Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Shoe Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedShoeImages[0] ? (
                        <div className="relative">
                          <img src={uploadedShoeImages[0]} alt="Uploaded shoe" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedShoeImages]
                              newImages[0] = ""
                              setUploadedShoeImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload shoe image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedShoeImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedShoeImages(newImages)
                                }
                              }}
                              id="shoe-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('shoe-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Garment Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Garment Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedGarmentImage ? (
                        <div className="relative">
                          <img src={URL.createObjectURL(uploadedGarmentImage)} alt="Uploaded garment" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setUploadedGarmentImage(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload garment image</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="garment-shoe-outfit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('garment-shoe-outfit-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Outfit Match Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating outfit match...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Outfit match result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👗</span>
                      </div>
                      <p className="text-gray-600">Outfit match will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload both shoe and garment images to see matches</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "multiview":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Multiview</h3>
                  {/* Shoe Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Shoe Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedShoeImages[0] ? (
                        <div className="relative">
                          <img src={uploadedShoeImages[0]} alt="Uploaded shoe" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedShoeImages]
                              newImages[0] = ""
                              setUploadedShoeImages(newImages)
                              setUploadedGarmentImage(null)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Upload shoe image for multiview</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedShoeImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedShoeImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="shoe-multiview-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('shoe-multiview-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        return;
                      }
                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);
                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/multi_view', {
                          method: 'POST',
                          body: formData,
                        });
                        if (!response.ok) {
                          const errorText = await response.text();
                          throw new Error(`API call failed: ${errorText}`);
                        }
                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.onerror = () => {
                          console.error("Error reading blob");
                          setIsGenerating(false);
                        }
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error generating multiview:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Multiview'}
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Multiview Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating multiview...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Multiview result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">👟</span>
                      </div>
                      <p className="text-gray-600">Multiview result will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload shoe image and click Generate Multiview to see result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "background-edit":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Background Edit</h3>
                  
                  {/* Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Shoe Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedShoeImages[0] ? (
                        <div className="relative">
                          <img src={uploadedShoeImages[0]} alt="Uploaded shoe" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedShoeImages]
                              newImages[0] = ""
                              setUploadedShoeImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Drag & drop your shoe image here</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedShoeImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedShoeImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="shoe-background-edit-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('shoe-background-edit-upload')?.click()}
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
                          placeholder="e.g., sneakers, boots"
                        />
                      </div>
                      <div>
                        <Label>Surface Type</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.surface_type}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, surface_type: e.target.value }))}
                          placeholder="e.g., leather, canvas"
                        />
                      </div>
                      <div>
                        <Label>Camera View Angle</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_view_angle}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_view_angle: e.target.value }))}
                          placeholder="e.g., front, side, 45-degree"
                        />
                      </div>
                      <div>
                        <Label>Camera Distance (meters)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_distance_meters}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_distance_meters: e.target.value }))}
                          placeholder="e.g., 2.0"
                        />
                      </div>
                      <div>
                        <Label>Camera Focal Length (mm)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_focal_length_mm}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_focal_length_mm: e.target.value }))}
                          placeholder="e.g., 50"
                        />
                      </div>
                      <div>
                        <Label>Camera Aperture (f-number)</Label>
                        <Input
                          type="number"
                          value={backgroundEditParams.camera_aperture_f_number}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_aperture_f_number: e.target.value }))}
                          placeholder="e.g., 2.8"
                        />
                      </div>
                      <div>
                        <Label>Camera Lighting Condition</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_lighting_condition}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_lighting_condition: e.target.value }))}
                          placeholder="e.g., natural, studio, warm"
                        />
                      </div>
                      <div>
                        <Label>Camera Background</Label>
                        <Input
                          type="text"
                          value={backgroundEditParams.camera_background}
                          onChange={(e) => setBackgroundEditParams(prev => ({ ...prev, camera_background: e.target.value }))}
                          placeholder="e.g., white, lifestyle, urban"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        console.log('Missing shoe image');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);
                        
                        // Add all background edit parameters with default values if not provided
                        formData.append('camera_lighting_condition', backgroundEditParams.camera_lighting_condition || 'indoor_warm');
                        formData.append('garment_type', backgroundEditParams.garment_type || 'shoes');
                        formData.append('camera_focal_length_mm', backgroundEditParams.camera_focal_length_mm || '10');
                        formData.append('camera_background', backgroundEditParams.camera_background || 'white');
                        formData.append('surface_type', backgroundEditParams.surface_type || 'string');
                        formData.append('camera_view_angle', backgroundEditParams.camera_view_angle || '30');
                        formData.append('camera_aperture_f_number', backgroundEditParams.camera_aperture_f_number || '10');
                        formData.append('camera_distance_meters', backgroundEditParams.camera_distance_meters || '6');

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/background_edit', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in background edit:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Background Edit'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Background Edit Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating background edit...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Background edit result" className="w-full h-full object-contain" />
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
                      <p className="text-sm text-gray-400 mt-2">Upload shoe image and adjust parameters to see the result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "detail-shots":
        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Detail Shots</h3>
                  
                  {/* Shoe Image Upload */}
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2">Shoe Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {uploadedShoeImages[0] ? (
                        <div className="relative">
                          <img src={uploadedShoeImages[0]} alt="Uploaded shoe" className="w-full h-48 object-contain" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              const newImages = [...uploadedShoeImages]
                              newImages[0] = ""
                              setUploadedShoeImages(newImages)
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-600">Drag & drop your shoe image here</p>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newImages = [...uploadedShoeImages]
                                  newImages[0] = URL.createObjectURL(file)
                                  setUploadedShoeImages(newImages)
                                  setUploadedGarmentImage(file)
                                }
                              }}
                              id="shoe-detail-upload"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => document.getElementById('shoe-detail-upload')?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={async () => {
                      if (!uploadedGarmentImage) {
                        console.log('Missing shoe image');
                        return;
                      }

                      setIsGenerating(true);
                      try {
                        const formData = new FormData();
                        formData.append('garment_images', uploadedGarmentImage);

                        const response = await fetch('https://usecase-backend.gennoctua.com/api/v1/detail', {
                          method: 'POST',
                          body: formData
                        });

                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('API Error:', errorText);
                          throw new Error(`API call failed: ${errorText}`);
                        }

                        const blob = await response.blob();
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64data = reader.result as string;
                          setResultImage(base64data);
                          setIsGenerating(false);
                        };
                        reader.readAsDataURL(blob);
                      } catch (error) {
                        console.error('Error in detail shots:', error);
                        setIsGenerating(false);
                      }
                    }}
                    disabled={!uploadedGarmentImage || isGenerating}
                    className="w-full mt-4"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Detail Shots'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Detail Shots Result</h3>
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
                      <p className="text-gray-600">Generating detail shots...</p>
                    </div>
                  ) : resultImage ? (
                    <div className="relative w-full h-full">
                      <img src={resultImage} alt="Detail shots result" className="w-full h-full object-contain" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button variant="outline" size="sm">Download</Button>
                        <Button variant="outline" size="sm">Share</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="text-gray-600">Detail shots result will appear here</p>
                      <p className="text-sm text-gray-400 mt-2">Upload shoe image and click Generate Detail Shots to see result</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Modify the main content section to include shoes
  const renderMainContent = () => {
    if (selectedCategory === "bags") {
      return (
        <div className="space-y-6">
          {/* Bag-specific navigation */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {bagNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleBagSubNavChange(item.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    bagSubNav === item.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bag-specific content */}
          <div className="p-6">
            {renderBagContent()}
          </div>
        </div>
      )
    }

    if (selectedCategory === "wallets") {
      return (
        <div className="space-y-6">
          {/* Wallet-specific navigation */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {walletNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleWalletSubNavChange(item.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    walletSubNav === item.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet-specific content */}
          <div className="p-6">
            {renderWalletContent()}
          </div>
        </div>
      )
    }

    if (selectedCategory === "jewelry") {
      return (
        <div className="space-y-6">
          {/* Jewelry-specific navigation */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {jewelryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleJewelrySubNavChange(item.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    jewelrySubNav === item.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Jewelry-specific content */}
          <div className="p-6">
            {renderJewelryContent()}
          </div>
        </div>
      )
    }

    if (selectedCategory === "shoes") {
      return (
        <div className="space-y-6">
          {/* Shoe-specific navigation */}
          <div className="bg-white border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {shoeNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleShoeSubNavChange(item.id)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    shoeSubNav === item.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shoe-specific content */}
          <div className="p-6">
            {renderShoeContent()}
          </div>
        </div>
      )
    }

    // Default case for clothes category
    return (
      <div className="space-y-6">
        {/* Clothing-specific content */}
        <div className="p-6">
          {renderSubNavContent()}
        </div>
      </div>
    )
  }

  // Add this function near the top of the component, after the state declarations
  const handleFileUpload = async (file: File) => {
    // Set the uploaded garment image
    setUploadedGarmentImage(file);

    // Create a FormData object to send the file
                        const formData = new FormData();
    formData.append('file', file);

    // You can also add additional metadata
    formData.append('category', selectedCategory);
    formData.append('modelParams', JSON.stringify(modelParams));
    formData.append('cameraParams', JSON.stringify(cameraParams));

    try {
      // Example API call
      const response = await fetch('/api/upload', {
                          method: 'POST',
        body: formData,
                        });

                        if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

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
              onClick={() => handleCategoryChange(category.id)}
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

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Content Area */}
        <div className="flex-1">
          {renderMainContent()}
        </div>

        {/* Settings Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Model Settings</h2>

          {/* Model Profile - Based on Model Parameters Table */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Gender</Label>
            <Select
              value={modelParams.gender}
              onValueChange={(value: "female") => updateModelParam("gender", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Age Range</Label>
            <Select 
              value={modelParams.age_range} 
              onValueChange={(value: "teen" | "18-25" | "26-35" | "36-45" | "46-55" | "56-65" | "66+") => 
                updateModelParam("age_range", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teen">Teen</SelectItem>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46-55">46-55</SelectItem>
                <SelectItem value="56-65">56-65</SelectItem>
                <SelectItem value="66+">66+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Garment Type Select */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Garment Type</Label>
            <Select
              value={modelParams.garment_type}
              onValueChange={(value) => updateModelParam("garment_type", value as ModelParameters["garment_type"]) }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select garment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="jewellery and watches">Jewellery and Watches</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="shoes">Shoes</SelectItem>
                <SelectItem value="handbags">Handbags</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Body Shape</Label>
            <Select
              value={modelParams.body_shape}
              onValueChange={(value: "rectangle" | "pear" | "hourglass" | "inverted_triangle") => 
                updateModelParam("body_shape", value)
              }
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
            <Label className="text-sm font-medium text-gray-700 mb-2">Race & Ethnicity</Label>
            <Select
              value={modelParams.race_ethnicity}
              onValueChange={(value: "white" | "black" | "asian" | "latino" | "mixed") => 
                updateModelParam("race_ethnicity", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select race/ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="latino">Latino</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pose Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3">Pose</Label>
            <Select
              value={modelParams.pose}
              onValueChange={(value: "standing" | "sitting" | "lying down" | "dancing" | "running" | "jumping" | "walking" | "bending" | "twisting" | "stretching" | "flexing" | "posing") => 
                updateModelParam("pose", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standing">Standing</SelectItem>
                <SelectItem value="sitting">Sitting</SelectItem>
                <SelectItem value="lying down">Lying Down</SelectItem>
                <SelectItem value="dancing">Dancing</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="jumping">Jumping</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="bending">Bending</SelectItem>
                <SelectItem value="twisting">Twisting</SelectItem>
                <SelectItem value="stretching">Stretching</SelectItem>
                <SelectItem value="flexing">Flexing</SelectItem>
                <SelectItem value="posing">Posing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Camera Settings */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">View Angle</Label>
            <Select
              value={cameraParams.view_angle}
              onValueChange={(value: "front" | "45deg" | "left" | "right" | "back") => 
                updateCameraParam("view_angle", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select view angle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="front">Front</SelectItem>
                <SelectItem value="45deg">45 Degree</SelectItem>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="back">Back</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Distance (meters)</Label>
            <Input
              type="number"
              value={cameraParams.distance_m || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                updateCameraParam("distance_m", value);
              }}
              min="0.5"
              max="10"
              step="0.1"
            />
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Focal Length (mm)</Label>
            <Input
              type="number"
              value={cameraParams.focal_length_mm || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                updateCameraParam("focal_length_mm", value);
              }}
              min="24"
              max="200"
              step="1"
            />
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Aperture (f-number)</Label>
            <Input
              type="number"
              value={cameraParams.aperture_f || ''}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                updateCameraParam("aperture_f", value);
              }}
              min="1.4"
              max="22"
              step="0.1"
            />
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Lighting Condition</Label>
            <Select
              value={cameraParams.lighting}
              onValueChange={(value: "studio_softbox" | "outdoor_sunny" | "indoor_warm" | "flat") => 
                updateCameraParam("lighting", value)
              }
            >
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

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">Background</Label>
            <Select
              value={cameraParams.background}
              onValueChange={(value: "white" | "lifestyle") => 
                updateCameraParam("background", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
