# Component API Reference

This document provides detailed documentation for all React components in the Furniture AR App.

## Table of Contents

- [FurnitureViewer](#furnitureviewer)
- [ColorPicker](#colorpicker)
- [LoadingScreen](#loadingscreen)

---

## FurnitureViewer

The main component for displaying 3D furniture models with augmented reality capabilities.

### Import

```tsx
import FurnitureViewer from './components/FurnitureViewer';
```

### Interface

```tsx
interface FurnitureViewerProps {
  productName?: string;
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `productName` | `string` | `"Modern Sofa Set"` | Display name for the furniture product |

### Features

- **3D Model Rendering**: Uses Google Model Viewer for WebGL-based 3D rendering
- **AR Support**: Multi-platform AR via WebXR, Scene Viewer, and AR Quick Look
- **Texture Switching**: Real-time texture/color changes with smooth transitions
- **Social Sharing**: Native share API with clipboard fallback
- **E-commerce Integration**: Direct checkout navigation with selected options
- **QR Code Generation**: Cross-device AR sharing via QR codes
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Accessibility**: Full keyboard navigation and screen reader support

### Usage Examples

#### Basic Usage

```tsx
export default function ProductPage() {
  return (
    <FurnitureViewer productName="Luxury Sectional Sofa" />
  );
}
```

#### With Custom Props

```tsx
export default function CustomViewer() {
  return (
    <FurnitureViewer 
      productName="Designer Armchair Collection"
    />
  );
}
```

### Internal Data Structures

#### TEXTURES Configuration

```tsx
const TEXTURES = [
  {
    name: "Blue",
    model: "/sample-furniture-blue.glb",
    iosmodel: "/sample-furniture-blue.usdz", 
    img: "https://example.com/blue-texture.jpg",
    price: 300,
    poster: "/sofa-blue-poster.webp"
  },
  // Additional textures...
];
```

#### ModelViewerElement Interface

```tsx
interface ModelViewerElement extends HTMLElement {
  activateAR: () => void;
}
```

### Key Methods

#### `handleTextureChange(texture)`
Changes the active texture/color variant of the furniture model.

**Parameters:**
- `texture: TextureConfig` - The texture configuration object

**Behavior:**
- Updates the 3D model source
- Maintains smooth visual transitions
- Prevents duplicate selections

#### `handleAR()`
Activates augmented reality mode based on device capabilities.

**Behavior:**
- **Mobile**: Directly activates native AR viewer
- **Desktop**: Shows QR code modal for mobile scanning

#### `handleShare()`
Shares the current product view via native or fallback methods.

**Fallback Hierarchy:**
1. Native Web Share API
2. Clipboard API  
3. Legacy execCommand
4. Manual copy prompt

#### `handleCart()`
Navigates to checkout with selected texture information.

**Navigation:**
- Route: `/payment?texture=${selectedTexture.name.toLowerCase()}`
- Preserves user selections across pages

### State Management

```tsx
const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0]);
const [showQR, setShowQR] = useState(false);
const [fade, setFade] = useState(false);
```

### Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge | Mobile |
|---------|--------|--------|---------|------|--------|
| 3D Viewing | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebXR AR | ✅ | ❌ | ❌ | ❌ | ✅ (Android) |
| AR Quick Look | ❌ | ✅ | ❌ | ❌ | ✅ (iOS) |
| Web Share API | ✅ | ✅ | ❌ | ✅ | ✅ |

### Performance Considerations

- **Dynamic Import**: Model Viewer is loaded only when needed
- **Poster Images**: Low-resolution previews for faster initial load
- **Asset Optimization**: GLB models compressed for web delivery
- **Responsive Loading**: Different asset sizes for mobile vs desktop

---

## ColorPicker

A reusable component for selecting colors or textures in a visual interface.

### Import

```tsx
import ColorPicker from './components/ColorPicker';
```

### Interface

```tsx
interface ColorPickerProps {
  colors: { name: string; value: string }[];
  selected: string;
  onSelect: (color: string) => void;
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `colors` | `ColorOption[]` | ✅ | Array of available color options |
| `selected` | `string` | ✅ | Currently selected color value |
| `onSelect` | `(color: string) => void` | ✅ | Callback fired when color is selected |

### ColorOption Interface

```tsx
interface ColorOption {
  name: string;    // Display name (e.g., "Ocean Blue")
  value: string;   // CSS color value (e.g., "#0066cc", "rgb(0,102,204)")
}
```

### Features

- **Visual Selection**: Color swatches with hover and selection states
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Adapts to different screen sizes
- **Animation**: Smooth scaling transitions on selection
- **Flexible Styling**: Accepts any CSS color format

### Usage Examples

#### Basic Color Selection

```tsx
import { useState } from 'react';
import ColorPicker from './components/ColorPicker';

export default function ProductCustomizer() {
  const colors = [
    { name: "Ocean Blue", value: "#0066cc" },
    { name: "Fire Red", value: "#cc0000" },
    { name: "Forest Green", value: "#006600" },
    { name: "Sunset Orange", value: "#ff6600" }
  ];
  
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  
  return (
    <div>
      <h3>Choose Your Color</h3>
      <ColorPicker 
        colors={colors}
        selected={selectedColor}
        onSelect={setSelectedColor}
      />
      <p>Selected: {colors.find(c => c.value === selectedColor)?.name}</p>
    </div>
  );
}
```

#### With Complex Color Values

```tsx
const gradientColors = [
  { 
    name: "Gradient Blue", 
    value: "linear-gradient(45deg, #0066cc, #004499)" 
  },
  { 
    name: "RGB Red", 
    value: "rgb(204, 0, 0)" 
  },
  { 
    name: "HSL Green", 
    value: "hsl(120, 100%, 20%)" 
  }
];

<ColorPicker 
  colors={gradientColors}
  selected={currentGradient}
  onSelect={handleGradientChange}
/>
```

### Styling

The component uses Tailwind CSS classes with these key styles:

```css
/* Base button styles */
.color-button {
  @apply w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none;
}

/* Selected state */
.color-button--selected {
  @apply border-white scale-110;
}

/* Unselected state */
.color-button--unselected {
  @apply border-transparent;
}
```

### Accessibility Features

- **ARIA Labels**: Each color button includes descriptive `aria-label`
- **Keyboard Navigation**: Full tab and Enter/Space key support
- **Focus Indicators**: Visual focus states for keyboard users
- **Screen Reader Support**: Color names announced to assistive technology

---

## LoadingScreen

A branded loading screen component displayed during application initialization.

### Import

```tsx
import LoadingScreen from './components/LoadingScreen';
```

### Interface

```tsx
// No props - component is self-contained
export default function LoadingScreen(): JSX.Element
```

### Props

This component accepts no props and is completely self-contained.

### Features

- **Branded Design**: Displays company logos and branding
- **Animated Progress**: CSS-based loading bar animation
- **Responsive Layout**: Adapts to all screen sizes
- **Cookie Notice**: Transparent privacy policy disclosure
- **Loading Simulation**: Integrates with app initialization timing

### Usage Examples

#### Basic Usage

```tsx
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return <MainAppContent />;
}
```

#### With Custom Loading Logic

```tsx
import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';

export default function DataDrivenApp() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function initializeApp() {
      try {
        await Promise.all([
          loadUserPreferences(),
          preloadAssets(),
          initializeThirdPartyServices()
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    initializeApp();
  }, []);
  
  return loading ? <LoadingScreen /> : <App />;
}
```

### Layout Structure

```tsx
<div className="fixed inset-0 flex flex-col justify-between">
  {/* Top section - Logo and progress */}
  <div className="flex-1 flex flex-col justify-center">
    <DanubeHomeLogo />
    <AnimatedProgressBar />
  </div>
  
  {/* Bottom section - Attribution */}
  <div className="flex flex-col items-center">
    <span>Powered by</span>
    <NusiteLogo />
    <CookieNotice />
  </div>
</div>
```

### Animation Details

The loading animation uses pure CSS for optimal performance:

```css
.loading-bar-animation {
  animation: loading-progress 2s ease-in-out forwards;
  transform-origin: left;
}

@keyframes loading-progress {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.7); }
  100% { transform: scaleX(1); }
}
```

### Responsive Behavior

| Screen Size | Logo Size | Progress Bar Width | Text Size |
|-------------|-----------|-------------------|-----------|
| Mobile (< 640px) | w-50 | 70vw | text-sm |
| Tablet (640px+) | w-40 | 60vw | text-base |
| Desktop (768px+) | w-48 | 50vw | text-base |

### Branding Assets

The component references these static assets:

- **Main Logo**: `/danubahome.svg` - Company brand logo
- **Attribution Logo**: `/nusitelogo.svg` - Technology provider logo

### Performance Considerations

- **No JavaScript Animation**: Uses CSS transforms for better performance
- **Optimized Images**: SVG logos for crisp rendering at all sizes
- **Minimal Dependencies**: Self-contained component with no external deps
- **Fixed Positioning**: Prevents layout shift during loading

---

## Common Patterns

### Error Boundaries

Wrap components in error boundaries for robust error handling:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <FurnitureViewer productName="Sofa" />
</ErrorBoundary>
```

### Lazy Loading

Use dynamic imports for better performance:

```tsx
import dynamic from 'next/dynamic';

const FurnitureViewer = dynamic(
  () => import('./components/FurnitureViewer'),
  { ssr: false }
);
```

### Testing

Example test patterns for these components:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from './ColorPicker';

test('calls onSelect when color is clicked', () => {
  const colors = [{ name: 'Red', value: '#ff0000' }];
  const onSelect = jest.fn();
  
  render(
    <ColorPicker 
      colors={colors} 
      selected="#ff0000" 
      onSelect={onSelect} 
    />
  );
  
  fireEvent.click(screen.getByLabelText('Red'));
  expect(onSelect).toHaveBeenCalledWith('#ff0000');
});
```