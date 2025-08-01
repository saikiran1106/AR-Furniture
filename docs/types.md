# TypeScript Types & Interfaces Documentation

This document provides comprehensive documentation for all TypeScript types, interfaces, and type definitions used in the Furniture AR App.

## Table of Contents

- [Component Props Types](#component-props-types)
- [Data Model Types](#data-model-types)
- [External Library Types](#external-library-types)
- [Utility Types](#utility-types)
- [Next.js Types](#nextjs-types)

---

## Component Props Types

### FurnitureViewerProps

Interface for the main `FurnitureViewer` component props.

```tsx
interface FurnitureViewerProps {
  productName?: string;
}
```

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `productName` | `string` | No | `"Modern Sofa Set"` | Display name for the furniture product |

**Usage:**
```tsx
<FurnitureViewer productName="Luxury Sectional Sofa" />
```

---

### ColorPickerProps

Interface for the `ColorPicker` component props.

```tsx
interface ColorPickerProps {
  colors: ColorOption[];
  selected: string;
  onSelect: (color: string) => void;
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `colors` | `ColorOption[]` | Yes | Array of available color options |
| `selected` | `string` | Yes | Currently selected color value |
| `onSelect` | `(color: string) => void` | Yes | Callback fired when color is selected |

**Usage:**
```tsx
<ColorPicker 
  colors={colorOptions}
  selected={currentColor}
  onSelect={handleColorChange}
/>
```

---

### LoadingScreenProps

The `LoadingScreen` component accepts no props.

```tsx
interface LoadingScreenProps {}
// or simply: () => JSX.Element
```

---

## Data Model Types

### ColorOption

Represents a color option for the color picker component.

```tsx
interface ColorOption {
  name: string;    // Display name (e.g., "Ocean Blue")
  value: string;   // CSS color value (e.g., "#0066cc", "rgb(0,102,204)")
}
```

**Examples:**
```tsx
const colorOptions: ColorOption[] = [
  { name: "Ocean Blue", value: "#0066cc" },
  { name: "Fire Red", value: "#cc0000" },
  { name: "Gradient Blue", value: "linear-gradient(45deg, #0066cc, #004499)" }
];
```

---

### TextureConfig

Configuration object for furniture texture/color variants.

```tsx
interface TextureConfig {
  name: string;     // Display name (e.g., "Blue")
  model: string;    // Path to GLB model file
  iosmodel: string; // Path to USDZ model file for iOS AR
  img: string;      // Product image URL
  price: number;    // Price in dollars
  poster: string;   // Poster image for model loading
}
```

**Example:**
```tsx
const blueTexture: TextureConfig = {
  name: "Blue",
  model: "/sample-furniture-blue.glb",
  iosmodel: "/sample-furniture-blue.usdz",
  img: "https://example.com/blue-sofa.jpg",
  price: 300,
  poster: "/sofa-blue-poster.webp"
};
```

**Usage in Code:**
```tsx
const TEXTURES: TextureConfig[] = [
  {
    name: "Blue",
    model: "/sample-furniture-blue.glb",
    iosmodel: "/sample-furniture-blue.usdz", 
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133230700104-008_800x.jpg",
    price: 300,
    poster: "/sofa-blue-poster.webp",
  },
  {
    name: "Red",
    model: "/sample-furniture-red.glb",
    iosmodel: "/sample-furniture-red.usdz",
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133220400211-002_800x.jpg",
    price: 400,
    poster: "/sofa-red-poster.webp",
  },
];
```

---

### SofaVariant

Product variant data structure used in the payment page.

```tsx
interface SofaVariant {
  name: string;   // Product display name
  img: string;    // Product image URL
  price: number;  // Price in dollars
}
```

**Example:**
```tsx
const SOFAS: Record<string, SofaVariant> = {
  blue: {
    name: "Blue Sofa",
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133230700104-008_800x.jpg",
    price: 300,
  },
  red: {
    name: "Red Sofa", 
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133220400211-002_800x.jpg",
    price: 400,
  },
};
```

---

## External Library Types

### ModelViewerElement

Extended HTMLElement interface for Google Model Viewer component.

```tsx
interface ModelViewerElement extends HTMLElement {
  activateAR: () => void;
}
```

**Purpose:**
- Provides type safety for model-viewer DOM element
- Enables TypeScript support for AR activation method
- Extends standard HTMLElement with model-viewer specific methods

**Usage:**
```tsx
const viewerRef = useRef<ModelViewerElement | null>(null);

const handleAR = () => {
  viewerRef.current?.activateAR();
};
```

---

### ModelViewerJSX

Type casting for JSX usage of model-viewer custom element.

```tsx
// Type-cast model-viewer to avoid TypeScript JSX error
const ModelViewer = "model-viewer" as any;
```

**Alternative Approach:**
```tsx
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        poster?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        exposure?: string;
        'shadow-intensity'?: string;
        alt?: string;
      };
    }
  }
}
```

---

## Utility Types

### DeviceDetection

Function type for mobile device detection utility.

```tsx
type DeviceDetectionFunction = () => boolean;

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}
```

---

### ShareFunction

Type for the social sharing handler function.

```tsx
type ShareFunction = () => Promise<void>;

const handleShare: ShareFunction = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: productName,
        url: window.location.href,
      });
    }
    // Fallback logic...
  } catch (error) {
    console.error("Error sharing:", error);
  }
};
```

---

### EventHandlers

Common event handler types used throughout the application.

```tsx
// Color selection handler
type ColorSelectHandler = (color: string) => void;

// Texture change handler  
type TextureChangeHandler = (texture: TextureConfig) => void;

// Generic button click handler
type ButtonClickHandler = () => void;

// Form submission handler
type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;
```

**Usage Examples:**
```tsx
const handleColorSelect: ColorSelectHandler = (color) => {
  setSelectedColor(color);
};

const handleTextureChange: TextureChangeHandler = (texture) => {
  setSelectedTexture(texture);
};

const handleFormSubmit: FormSubmitHandler = (event) => {
  event.preventDefault();
  // Process form data
};
```

---

## Next.js Types

### Metadata

Next.js metadata type for SEO and page information.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Furniture AR App",
  description: "View furniture in augmented reality",
  keywords: ["furniture", "AR", "3D", "shopping"],
  openGraph: {
    title: "Furniture AR App",
    description: "View furniture in augmented reality",
    type: "website",
  },
};
```

---

### LayoutProps

Props interface for Next.js layout components.

```tsx
interface LayoutProps {
  children: React.ReactNode;
}

// For root layout specifically
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

### PageProps

Props interface for Next.js page components with search parameters.

```tsx
interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// For payment page specifically
interface PaymentPageProps {
  searchParams: {
    texture?: string;
  };
}
```

---

### FontConfiguration

Type for Next.js Google Fonts configuration.

```tsx
import { Roboto } from "next/font/google";

interface FontConfig {
  subsets: string[];
  weight: string[];
  variable: string;
}

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
} satisfies FontConfig);
```

---

## Browser API Types

### NavigatorShare

Extended Navigator interface for Web Share API.

```tsx
interface NavigatorWithShare extends Navigator {
  share?: (data: ShareData) => Promise<void>;
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

// Usage
const nav = navigator as NavigatorWithShare;
if (nav.share) {
  await nav.share({
    title: "Check out this furniture!",
    url: window.location.href,
  });
}
```

---

### ClipboardAPI

Extended Navigator interface for Clipboard API.

```tsx
interface NavigatorWithClipboard extends Navigator {
  clipboard?: {
    writeText: (text: string) => Promise<void>;
    readText: () => Promise<string>;
  };
}

// Usage
const nav = navigator as NavigatorWithClipboard;
if (nav.clipboard?.writeText) {
  await nav.clipboard.writeText(window.location.href);
}
```

---

## React Hook Types

### StateHooks

Common state hook types used in components.

```tsx
// Loading state
type LoadingState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
const [loading, setLoading]: LoadingState = useState(true);

// Texture selection state
type TextureState = [TextureConfig, React.Dispatch<React.SetStateAction<TextureConfig>>];
const [selectedTexture, setSelectedTexture]: TextureState = useState(TEXTURES[0]);

// Modal state
type ModalState = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
const [showQR, setShowQR]: ModalState = useState(false);
```

---

### RefHooks

Ref hook types for DOM element references.

```tsx
// Model viewer ref
type ModelViewerRef = React.RefObject<ModelViewerElement | null>;
const viewerRef: ModelViewerRef = useRef<ModelViewerElement | null>(null);

// Generic HTML element ref
type ElementRef<T extends HTMLElement> = React.RefObject<T | null>;
const buttonRef: ElementRef<HTMLButtonElement> = useRef<HTMLButtonElement | null>(null);
```

---

### EffectHooks

Effect hook types for side effects and lifecycle management.

```tsx
// Cleanup function type
type EffectCleanup = () => void;

// Effect with cleanup
useEffect((): EffectCleanup => {
  const timer = setTimeout(() => setLoading(false), 2000);
  return () => clearTimeout(timer);
}, []);

// Effect without cleanup
useEffect((): void => {
  import("@google/model-viewer");
}, []);
```

---

## Type Guards

### Device Type Guards

Type guard functions for runtime type checking.

```tsx
function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

function isTextureConfig(obj: any): obj is TextureConfig {
  return (
    typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.model === 'string' &&
    typeof obj.price === 'number'
  );
}

function isValidTexture(texture: string): texture is keyof typeof SOFAS {
  return texture in SOFAS;
}
```

---

## Discriminated Unions

### Loading States

```tsx
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: any }
  | { status: 'error'; error: string };

function handleLoadingState(state: LoadingState) {
  switch (state.status) {
    case 'idle':
      return <div>Ready to load</div>;
    case 'loading':
      return <LoadingScreen />;
    case 'success':
      return <div>Data: {state.data}</div>;
    case 'error':
      return <div>Error: {state.error}</div>;
  }
}
```

---

### Button Variants

```tsx
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  children: React.ReactNode;
  onClick?: () => void;
}
```

---

## Generic Types

### API Response Types

```tsx
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ProductApiResponse extends ApiResponse<TextureConfig[]> {}
interface PaymentApiResponse extends ApiResponse<{ orderId: string }> {}

// Usage
const productResponse: ProductApiResponse = await fetchProducts();
if (productResponse.success && productResponse.data) {
  setTextures(productResponse.data);
}
```

---

### Event Handler Generics

```tsx
type EventHandler<T extends HTMLElement, E extends Event = Event> = (
  event: E & { currentTarget: T }
) => void;

// Specific handlers
type ButtonClickHandler = EventHandler<HTMLButtonElement, MouseEvent>;
type InputChangeHandler = EventHandler<HTMLInputElement, ChangeEvent>;
type FormSubmitHandler = EventHandler<HTMLFormElement, FormEvent>;
```

---

## Environment & Configuration Types

### Environment Variables

```tsx
interface ProcessEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_API_URL?: string;
  NEXT_PUBLIC_MODEL_BASE_URL?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ProcessEnv {}
  }
}
```

---

### Configuration Objects

```tsx
interface AppConfig {
  modelTimeout: number;
  supportedFormats: string[];
  fallbackTexture: string;
  enableAnalytics: boolean;
}

const config: AppConfig = {
  modelTimeout: 5000,
  supportedFormats: ['.glb', '.usdz'],
  fallbackTexture: 'blue',
  enableAnalytics: process.env.NODE_ENV === 'production',
};
```

---

## Error Types

### Custom Error Classes

```tsx
class ModelLoadError extends Error {
  constructor(
    message: string,
    public modelPath: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'ModelLoadError';
  }
}

class ARUnsupportedError extends Error {
  constructor(public userAgent: string) {
    super('AR is not supported on this device');
    this.name = 'ARUnsupportedError';
  }
}

// Usage
try {
  await loadModel(modelPath);
} catch (error) {
  if (error instanceof ModelLoadError) {
    console.error(`Failed to load model: ${error.modelPath}`);
  }
}
```

---

## Best Practices

### Type Organization

1. **Component-Specific Types**: Keep component props types close to components
2. **Shared Types**: Place shared types in a dedicated `types/` directory
3. **API Types**: Group API-related types together
4. **Utility Types**: Create reusable utility types for common patterns

### Naming Conventions

```tsx
// Props interfaces
interface ComponentNameProps {}

// Data models
interface ModelName {}

// Event handlers
type HandleEventName = () => void;

// API responses
interface ApiNameResponse<T> {}

// Constants with types
const CONSTANT_NAME: ConstantType = {};
```

### Type Safety Tips

```tsx
// Use const assertions for better inference
const TEXTURES = [
  { name: "Blue", price: 300 },
  { name: "Red", price: 400 }
] as const;

// Use satisfies operator for type checking
const config = {
  timeout: 5000,
  retries: 3
} satisfies AppConfig;

// Use branded types for IDs
type ProductId = string & { readonly brand: unique symbol };
type UserId = string & { readonly brand: unique symbol };
```