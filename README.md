# Furniture AR App

A Next.js-based furniture visualization application that allows users to view 3D furniture models in augmented reality (AR) and purchase them online.

## 🚀 Features

- **3D Model Visualization**: Interactive 3D furniture models using Google Model Viewer
- **Augmented Reality (AR)**: View furniture in your space using WebXR and AR Quick Look
- **Texture Selection**: Multiple color/texture variants for furniture
- **Mobile & Desktop Support**: Responsive design with platform-specific features
- **E-commerce Integration**: Shopping cart and checkout functionality
- **QR Code Generation**: Share AR experiences across devices

## 🏗️ Architecture

This application is built using:
- **Framework**: Next.js 15.4.4 with App Router
- **Styling**: Tailwind CSS 4.0
- **3D Rendering**: Google Model Viewer, React Three Fiber, React Three Drei
- **Animation**: Framer Motion
- **Icons**: React Icons, Lucide React
- **TypeScript**: Full type safety

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── components/         # React Components
│   │   ├── FurnitureViewer.tsx    # Main 3D viewer component
│   │   ├── ColorPicker.tsx        # Color selection component
│   │   └── LoadingScreen.tsx      # Loading state component
│   ├── payment/           # Payment page
│   │   └── page.tsx       # Checkout form
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
public/                   # Static assets
├── *.glb                # 3D models (GLB format)
├── *.usdz               # iOS AR models
├── *.webp, *.png        # Product images
└── *.svg                # Icons and logos
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd furniture-ar-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Main furniture viewer with AR capabilities |
| `/payment` | `PaymentPage` | Checkout form with shipping and payment details |

### Components

| Component | Props | Description |
|-----------|-------|-------------|
| [`FurnitureViewer`](#furnitureviewer) | `productName?: string` | Main 3D model viewer with AR support |
| [`ColorPicker`](#colorpicker) | `colors, selected, onSelect` | Color/texture selection interface |
| [`LoadingScreen`](#loadingscreen) | None | Application loading state |

## 🎯 Usage Examples

### Basic Implementation

```tsx
import FurnitureViewer from './components/FurnitureViewer';

export default function App() {
  return (
    <FurnitureViewer productName="Modern Sofa Set" />
  );
}
```

### Color Selection

```tsx
import ColorPicker from './components/ColorPicker';

const colors = [
  { name: "Blue", value: "#0066cc" },
  { name: "Red", value: "#cc0000" }
];

function ProductCustomizer() {
  const [selected, setSelected] = useState("#0066cc");
  
  return (
    <ColorPicker 
      colors={colors}
      selected={selected}
      onSelect={setSelected}
    />
  );
}
```

## 🔍 Component Details

### FurnitureViewer

The main component for displaying 3D furniture models with AR capabilities.

**Props:**
- `productName?: string` - Name of the product to display (default: "Modern Sofa Set")

**Features:**
- Interactive 3D model viewing
- AR mode activation (WebXR, Scene Viewer, Quick Look)
- Texture/color switching
- Social sharing
- Shopping cart integration
- QR code generation for cross-device AR

### ColorPicker

A reusable color selection component for customizing furniture appearance.

**Props:**
- `colors: { name: string; value: string }[]` - Array of available colors
- `selected: string` - Currently selected color value
- `onSelect: (color: string) => void` - Callback when color is selected

### LoadingScreen

A branded loading screen component displayed during app initialization.

**Features:**
- Animated progress bar
- Company branding
- Cookie policy notice
- Responsive design

## 🌐 Browser Support

- **AR Support**: WebXR (Android Chrome), AR Quick Look (iOS Safari)
- **3D Models**: Modern browsers with WebGL support
- **Mobile**: iOS Safari, Android Chrome
- **Desktop**: Chrome, Firefox, Safari, Edge

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

For deployment on Vercel (recommended):
1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on git push

## 🔒 Security & Privacy

- **HTTPS Required**: AR features require secure context
- **Cookie Policy**: Transparent usage tracking disclosure
- **Payment Security**: Demo payment form (no real transactions)

## 🛠️ Development

### Adding New Furniture Models

1. Add `.glb` and `.usdz` model files to `/public/`
2. Add product images and posters
3. Update the `TEXTURES` array in `FurnitureViewer.tsx`
4. Configure pricing in payment page

### Customizing Styles

- Edit `src/app/globals.css` for global styles
- Use Tailwind classes for component styling
- Customize brand colors in Tailwind config

## 📝 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📄 License

This project is private and proprietary.

---

For detailed component documentation, see the [Component API Reference](./docs/components.md).
For type definitions, see the [Type Documentation](./docs/types.md).
