# API Usage Examples & Integration Guide

This document provides practical examples and integration patterns for using the Furniture AR App's APIs, components, and utilities.

## Table of Contents

- [Quick Start Examples](#quick-start-examples)
- [Component Integration Patterns](#component-integration-patterns)
- [Advanced Usage Scenarios](#advanced-usage-scenarios)
- [Custom Implementations](#custom-implementations)
- [Integration with External Services](#integration-with-external-services)
- [Performance Optimization Examples](#performance-optimization-examples)
- [Testing Examples](#testing-examples)

---

## Quick Start Examples

### Basic Furniture Viewer Setup

The simplest way to integrate the furniture viewer into your application:

```tsx
// pages/product/[id].tsx
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '../components/LoadingScreen';

const FurnitureViewer = dynamic(
  () => import('../components/FurnitureViewer'),
  { ssr: false }
);

export default function ProductPage({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('');

  useEffect(() => {
    // Fetch product data
    fetchProduct(productId).then(product => {
      setProductName(product.name);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <FurnitureViewer productName={productName} />;
}
```

### Color Picker Integration

Adding color selection to any product interface:

```tsx
// components/ProductCustomizer.tsx
import { useState } from 'react';
import ColorPicker from './ColorPicker';

const AVAILABLE_COLORS = [
  { name: "Ocean Blue", value: "#0066cc" },
  { name: "Forest Green", value: "#228B22" },
  { name: "Sunset Orange", value: "#FF6347" },
  { name: "Royal Purple", value: "#663399" }
];

export default function ProductCustomizer() {
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);
  const [productPrice, setProductPrice] = useState(299);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    
    // Update price based on color selection
    const colorOption = AVAILABLE_COLORS.find(c => c.value === color);
    if (colorOption?.name === "Royal Purple") {
      setProductPrice(349); // Premium color
    } else {
      setProductPrice(299);
    }
  };

  return (
    <div className="product-customizer">
      <h3>Customize Your Furniture</h3>
      
      <ColorPicker
        colors={AVAILABLE_COLORS}
        selected={selectedColor}
        onSelect={handleColorChange}
      />
      
      <div className="price-display">
        <span>Price: ${productPrice}</span>
      </div>
      
      <div className="selected-color">
        <span>
          Selected: {AVAILABLE_COLORS.find(c => c.value === selectedColor)?.name}
        </span>
      </div>
    </div>
  );
}
```

---

## Component Integration Patterns

### Modal-Based AR Viewer

Integrating the furniture viewer within a modal for catalog browsing:

```tsx
// components/ProductModal.tsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FurnitureViewer from './FurnitureViewer';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export default function ProductModal({ isOpen, onClose, productName }: ProductModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-75"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div
            className="relative w-full h-full max-w-6xl max-h-screen m-4 bg-white rounded-lg overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              className="absolute top-4 right-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full"
              onClick={onClose}
            >
              ✕
            </button>
            
            <FurnitureViewer productName={productName} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Usage in catalog page
const CatalogPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  return (
    <div className="catalog-grid">
      {products.map(product => (
        <div key={product.id} onClick={() => setSelectedProduct(product.name)}>
          <img src={product.thumbnail} alt={product.name} />
          <h3>{product.name}</h3>
        </div>
      ))}
      
      <ProductModal
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        productName={selectedProduct || ''}
      />
    </div>
  );
};
```

### Multi-Step Product Configuration

Creating a wizard-like interface for product customization:

```tsx
// components/ProductWizard.tsx
import { useState } from 'react';
import ColorPicker from './ColorPicker';
import FurnitureViewer from './FurnitureViewer';

type WizardStep = 'color' | 'material' | 'size' | 'preview';

interface ProductConfig {
  color: string;
  material: string;
  size: string;
  price: number;
}

export default function ProductWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('color');
  const [config, setConfig] = useState<ProductConfig>({
    color: '#0066cc',
    material: 'fabric',
    size: 'standard',
    price: 299
  });

  const steps: WizardStep[] = ['color', 'material', 'size', 'preview'];
  const currentStepIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
    setCurrentStep(steps[nextIndex]);
  };

  const prevStep = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex]);
  };

  const updateConfig = (updates: Partial<ProductConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="wizard-container">
      {/* Progress Indicator */}
      <div className="wizard-progress">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step ${index <= currentStepIndex ? 'completed' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="wizard-content">
        {currentStep === 'color' && (
          <div className="step-content">
            <h2>Choose Color</h2>
            <ColorPicker
              colors={COLOR_OPTIONS}
              selected={config.color}
              onSelect={(color) => updateConfig({ color })}
            />
          </div>
        )}

        {currentStep === 'material' && (
          <div className="step-content">
            <h2>Select Material</h2>
            <div className="material-options">
              {MATERIAL_OPTIONS.map(material => (
                <button
                  key={material.id}
                  className={`material-option ${config.material === material.id ? 'selected' : ''}`}
                  onClick={() => updateConfig({ 
                    material: material.id, 
                    price: material.price 
                  })}
                >
                  <img src={material.image} alt={material.name} />
                  <span>{material.name}</span>
                  <span>${material.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="step-content">
            <h2>Preview Your Selection</h2>
            <div className="preview-layout">
              <div className="preview-viewer">
                <FurnitureViewer productName="Custom Sofa" />
              </div>
              <div className="preview-summary">
                <h3>Configuration Summary</h3>
                <ul>
                  <li>Color: {getColorName(config.color)}</li>
                  <li>Material: {config.material}</li>
                  <li>Size: {config.size}</li>
                  <li>Total: ${config.price}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="wizard-navigation">
        <button onClick={prevStep} disabled={currentStepIndex === 0}>
          Previous
        </button>
        <button onClick={nextStep} disabled={currentStepIndex === steps.length - 1}>
          Next
        </button>
        {currentStep === 'preview' && (
          <button className="btn-primary" onClick={handleCheckout}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
```

---

## Advanced Usage Scenarios

### Custom AR Integration with Device Detection

Advanced AR functionality with device-specific optimizations:

```tsx
// hooks/useARCapabilities.ts
import { useState, useEffect } from 'react';
import { isMobile } from '../utils/deviceDetection';

interface ARCapabilities {
  supportsWebXR: boolean;
  supportsQuickLook: boolean;
  supportsSceneViewer: boolean;
  recommendedMode: 'webxr' | 'quicklook' | 'sceneviewer' | 'qr';
}

export function useARCapabilities(): ARCapabilities {
  const [capabilities, setCapabilities] = useState<ARCapabilities>({
    supportsWebXR: false,
    supportsQuickLook: false,
    supportsSceneViewer: false,
    recommendedMode: 'qr'
  });

  useEffect(() => {
    const checkCapabilities = async () => {
      const mobile = isMobile();
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      // Check WebXR support
      const supportsWebXR = 'xr' in navigator && mobile;
      
      // iOS supports AR Quick Look
      const supportsQuickLook = isIOS;
      
      // Android Chrome supports Scene Viewer
      const supportsSceneViewer = isAndroid && /Chrome/.test(navigator.userAgent);
      
      let recommendedMode: ARCapabilities['recommendedMode'] = 'qr';
      if (supportsWebXR) recommendedMode = 'webxr';
      else if (supportsQuickLook) recommendedMode = 'quicklook';
      else if (supportsSceneViewer) recommendedMode = 'sceneviewer';
      
      setCapabilities({
        supportsWebXR,
        supportsQuickLook,
        supportsSceneViewer,
        recommendedMode
      });
    };

    checkCapabilities();
  }, []);

  return capabilities;
}

// components/AdvancedARViewer.tsx
export default function AdvancedARViewer({ productName }: { productName: string }) {
  const capabilities = useARCapabilities();
  const [arMode, setARMode] = useState<string>('');

  const activateAR = () => {
    switch (capabilities.recommendedMode) {
      case 'webxr':
        // Use WebXR
        viewerRef.current?.activateAR();
        break;
      case 'quicklook':
        // Use AR Quick Look
        window.location.href = TEXTURES[selectedTexture].iosmodel;
        break;
      case 'sceneviewer':
        // Use Scene Viewer
        const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
          window.location.origin + TEXTURES[selectedTexture].model
        )}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
          window.location.href
        )};end;`;
        window.location.href = sceneViewerUrl;
        break;
      default:
        // Show QR code
        setShowQR(true);
    }
  };

  return (
    <div className="advanced-ar-viewer">
      <div className="ar-capabilities">
        <p>Detected AR capabilities:</p>
        <ul>
          {capabilities.supportsWebXR && <li>✅ WebXR</li>}
          {capabilities.supportsQuickLook && <li>✅ AR Quick Look</li>}
          {capabilities.supportsSceneViewer && <li>✅ Scene Viewer</li>}
        </ul>
        <p>Recommended mode: {capabilities.recommendedMode}</p>
      </div>
      
      <button onClick={activateAR} className="ar-button">
        View in AR ({capabilities.recommendedMode})
      </button>
    </div>
  );
}
```

### Multi-Product Comparison Viewer

Comparing multiple furniture pieces side by side:

```tsx
// components/ComparisonViewer.tsx
import { useState } from 'react';
import FurnitureViewer from './FurnitureViewer';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ComparisonViewerProps {
  products: Product[];
  maxCompare?: number;
}

export default function ComparisonViewer({ 
  products, 
  maxCompare = 3 
}: ComparisonViewerProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [activeView, setActiveView] = useState<string | null>(null);

  const addToComparison = (product: Product) => {
    if (selectedProducts.length < maxCompare && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeFromComparison = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    if (activeView === productId) {
      setActiveView(null);
    }
  };

  return (
    <div className="comparison-viewer">
      <div className="product-selector">
        <h3>Select products to compare (max {maxCompare})</h3>
        <div className="product-grid">
          {products.map(product => (
            <div 
              key={product.id} 
              className={`product-card ${selectedProducts.find(p => p.id === product.id) ? 'selected' : ''}`}
            >
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <button onClick={() => addToComparison(product)}>
                {selectedProducts.find(p => p.id === product.id) ? 'Selected' : 'Add to Compare'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProducts.length > 0 && (
        <div className="comparison-interface">
          <div className="comparison-tabs">
            {selectedProducts.map(product => (
              <button
                key={product.id}
                className={`tab ${activeView === product.id ? 'active' : ''}`}
                onClick={() => setActiveView(product.id)}
              >
                {product.name}
                <button 
                  className="remove-tab"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromComparison(product.id);
                  }}
                >
                  ×
                </button>
              </button>
            ))}
          </div>

          <div className="comparison-content">
            {activeView ? (
              <div className="viewer-container">
                <FurnitureViewer 
                  productName={selectedProducts.find(p => p.id === activeView)?.name || ''} 
                />
              </div>
            ) : (
              <div className="no-selection">
                <p>Select a product tab to view in 3D</p>
              </div>
            )}
          </div>

          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  {selectedProducts.map(product => (
                    <th key={product.id}>{product.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  {selectedProducts.map(product => (
                    <td key={product.id}>${product.price}</td>
                  ))}
                </tr>
                <tr>
                  <td>View in AR</td>
                  {selectedProducts.map(product => (
                    <td key={product.id}>
                      <button onClick={() => setActiveView(product.id)}>
                        View AR
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Custom Implementations

### Custom Loading Screen with Progress Tracking

Enhanced loading screen with real progress tracking:

```tsx
// components/AdvancedLoadingScreen.tsx
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoadingTask {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'loading' | 'complete' | 'error';
}

export default function AdvancedLoadingScreen() {
  const [tasks, setTasks] = useState<LoadingTask[]>([
    { id: 'models', name: 'Loading 3D Models', progress: 0, status: 'pending' },
    { id: 'textures', name: 'Loading Textures', progress: 0, status: 'pending' },
    { id: 'assets', name: 'Loading Assets', progress: 0, status: 'pending' },
    { id: 'initialization', name: 'Initializing AR', progress: 0, status: 'pending' }
  ]);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const overallProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;

  useEffect(() => {
    const executeTask = async (taskIndex: number) => {
      if (taskIndex >= tasks.length) return;

      const currentTask = tasks[taskIndex];
      
      // Update task status to loading
      setTasks(prev => prev.map((task, index) => 
        index === taskIndex 
          ? { ...task, status: 'loading' as const }
          : task
      ));

      // Simulate task execution with progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setTasks(prev => prev.map((task, index) => 
          index === taskIndex 
            ? { ...task, progress }
            : task
        ));
      }

      // Mark task as complete
      setTasks(prev => prev.map((task, index) => 
        index === taskIndex 
          ? { ...task, status: 'complete' as const }
          : task
      ));

      // Move to next task
      setCurrentTaskIndex(taskIndex + 1);
    };

    if (currentTaskIndex < tasks.length) {
      executeTask(currentTaskIndex);
    }
  }, [currentTaskIndex, tasks.length]);

  const isComplete = tasks.every(task => task.status === 'complete');

  return (
    <div className="advanced-loading-screen">
      <div className="loading-content">
        <Image
          src="/danubahome.svg"
          alt="Danube Home Logo"
          width={200}
          height={80}
          className="logo"
        />

        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="progress-text">
            {Math.round(overallProgress)}% Complete
          </div>
        </div>

        <div className="task-list">
          {tasks.map((task, index) => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <div className="task-icon">
                {task.status === 'complete' && '✓'}
                {task.status === 'loading' && '⟳'}
                {task.status === 'error' && '✗'}
                {task.status === 'pending' && '○'}
              </div>
              <div className="task-info">
                <span className="task-name">{task.name}</span>
                {task.status === 'loading' && (
                  <div className="task-progress">
                    <div 
                      className="task-progress-bar"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="loading-complete">
          <div className="success-animation">Ready!</div>
        </div>
      )}
    </div>
  );
}
```

### Custom Color Picker with Material Previews

Enhanced color picker with material texture previews:

```tsx
// components/MaterialColorPicker.tsx
import { useState } from 'react';

interface MaterialOption {
  id: string;
  name: string;
  color: string;
  texture: string;
  finish: 'matte' | 'glossy' | 'satin';
  price_modifier: number;
}

interface MaterialColorPickerProps {
  materials: MaterialOption[];
  selected: string;
  onSelect: (materialId: string) => void;
  basePrice: number;
}

export default function MaterialColorPicker({
  materials,
  selected,
  onSelect,
  basePrice
}: MaterialColorPickerProps) {
  const [hoveredMaterial, setHoveredMaterial] = useState<string | null>(null);
  
  const selectedMaterial = materials.find(m => m.id === selected);
  const finalPrice = basePrice + (selectedMaterial?.price_modifier || 0);

  return (
    <div className="material-color-picker">
      <div className="picker-header">
        <h3>Choose Material & Color</h3>
        <div className="price-display">
          Base: ${basePrice} 
          {selectedMaterial?.price_modifier !== 0 && (
            <span className="price-modifier">
              {selectedMaterial?.price_modifier > 0 ? '+' : ''}
              ${selectedMaterial?.price_modifier}
            </span>
          )}
          <span className="final-price">Total: ${finalPrice}</span>
        </div>
      </div>

      <div className="material-grid">
        {materials.map(material => {
          const isSelected = selected === material.id;
          const isHovered = hoveredMaterial === material.id;
          
          return (
            <div
              key={material.id}
              className={`material-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(material.id)}
              onMouseEnter={() => setHoveredMaterial(material.id)}
              onMouseLeave={() => setHoveredMaterial(null)}
            >
              <div className="material-preview">
                <div 
                  className="color-swatch"
                  style={{ 
                    backgroundColor: material.color,
                    backgroundImage: `url(${material.texture})`,
                    backgroundBlendMode: material.finish === 'glossy' ? 'overlay' : 'normal'
                  }}
                />
                <div className={`finish-indicator ${material.finish}`} />
              </div>
              
              <div className="material-info">
                <span className="material-name">{material.name}</span>
                <span className="finish-type">{material.finish}</span>
                {material.price_modifier !== 0 && (
                  <span className="price-mod">
                    {material.price_modifier > 0 ? '+' : ''}${material.price_modifier}
                  </span>
                )}
              </div>

              {(isHovered || isSelected) && (
                <div className="material-details">
                  <div className="detail-item">
                    <span>Finish:</span>
                    <span>{material.finish}</span>
                  </div>
                  <div className="detail-item">
                    <span>Care:</span>
                    <span>
                      {material.finish === 'matte' ? 'Easy clean' : 
                       material.finish === 'glossy' ? 'Polish regularly' : 
                       'Dust weekly'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedMaterial && (
        <div className="selection-summary">
          <h4>Selected Material</h4>
          <div className="summary-content">
            <div className="summary-preview">
              <div 
                className="large-swatch"
                style={{ 
                  backgroundColor: selectedMaterial.color,
                  backgroundImage: `url(${selectedMaterial.texture})`
                }}
              />
            </div>
            <div className="summary-details">
              <p><strong>{selectedMaterial.name}</strong></p>
              <p>Finish: {selectedMaterial.finish}</p>
              <p>Price: ${finalPrice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Integration with External Services

### Analytics Integration

Tracking user interactions and AR usage:

```tsx
// utils/analytics.ts
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export class AnalyticsService {
  static trackEvent(event: AnalyticsEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(console.error);
    }
  }

  static trackARUsage(mode: string, product: string, success: boolean) {
    this.trackEvent({
      action: 'ar_activation',
      category: 'engagement',
      label: `${mode}_${success ? 'success' : 'failure'}`,
      custom_parameters: {
        ar_mode: mode,
        product_name: product,
        device_type: isMobile() ? 'mobile' : 'desktop'
      }
    });
  }

  static trackProductView(productName: string, viewDuration: number) {
    this.trackEvent({
      action: 'product_view',
      category: 'engagement',
      label: productName,
      value: Math.round(viewDuration / 1000), // Convert to seconds
      custom_parameters: {
        view_duration_ms: viewDuration
      }
    });
  }

  static trackColorChange(fromColor: string, toColor: string, productName: string) {
    this.trackEvent({
      action: 'color_change',
      category: 'customization',
      label: `${fromColor}_to_${toColor}`,
      custom_parameters: {
        product_name: productName,
        from_color: fromColor,
        to_color: toColor
      }
    });
  }
}

// Enhanced FurnitureViewer with analytics
export default function AnalyticsFurnitureViewer({ productName }: { productName: string }) {
  const [viewStartTime] = useState(Date.now());
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0]);

  useEffect(() => {
    // Track product view start
    AnalyticsService.trackProductView(productName, 0);

    return () => {
      // Track view duration on unmount
      const viewDuration = Date.now() - viewStartTime;
      AnalyticsService.trackProductView(productName, viewDuration);
    };
  }, [productName, viewStartTime]);

  const handleTextureChange = (texture: TextureConfig) => {
    AnalyticsService.trackColorChange(
      selectedTexture.name,
      texture.name,
      productName
    );
    setSelectedTexture(texture);
  };

  const handleAR = () => {
    const mode = isMobile() ? 'native' : 'qr';
    
    try {
      if (isMobile()) {
        viewerRef.current?.activateAR();
        AnalyticsService.trackARUsage(mode, productName, true);
      } else {
        setShowQR(true);
        AnalyticsService.trackARUsage(mode, productName, true);
      }
    } catch (error) {
      AnalyticsService.trackARUsage(mode, productName, false);
      console.error('AR activation failed:', error);
    }
  };

  // Rest of component implementation...
}
```

### Content Management System Integration

Fetching product data from a headless CMS:

```tsx
// services/contentService.ts
interface CMSProduct {
  id: string;
  name: string;
  description: string;
  base_price: number;
  models: {
    glb_url: string;
    usdz_url: string;
    poster_url: string;
  };
  materials: {
    id: string;
    name: string;
    color: string;
    texture_url: string;
    price_modifier: number;
  }[];
  images: {
    thumbnail: string;
    gallery: string[];
  };
  metadata: {
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    weight: number;
    care_instructions: string[];
  };
}

export class ContentService {
  private static apiBase = process.env.NEXT_PUBLIC_CMS_API_URL;
  private static apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;

  static async getProduct(id: string): Promise<CMSProduct> {
    const response = await fetch(`${this.apiBase}/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  }

  static async getProductCollection(collectionId: string): Promise<CMSProduct[]> {
    const response = await fetch(`${this.apiBase}/collections/${collectionId}/products`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.statusText}`);
    }

    return response.json();
  }

  static async searchProducts(query: string, filters?: Record<string, any>): Promise<CMSProduct[]> {
    const searchParams = new URLSearchParams({
      q: query,
      ...filters
    });

    const response = await fetch(`${this.apiBase}/products/search?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Dynamic product page with CMS integration
export default function DynamicProductPage({ productId }: { productId: string }) {
  const [product, setProduct] = useState<CMSProduct | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await ContentService.getProduct(productId);
        setProduct(productData);
        setSelectedMaterial(productData.materials[0]?.id || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const selectedMaterialData = product.materials.find(m => m.id === selectedMaterial);
  const finalPrice = product.base_price + (selectedMaterialData?.price_modifier || 0);

  return (
    <div className="dynamic-product-page">
      <div className="product-viewer">
        <FurnitureViewer productName={product.name} />
      </div>

      <div className="product-details">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        
        <div className="price">
          <span className="current-price">${finalPrice}</span>
          {selectedMaterialData?.price_modifier !== 0 && (
            <span className="base-price">(Base: ${product.base_price})</span>
          )}
        </div>

        <MaterialColorPicker
          materials={product.materials}
          selected={selectedMaterial}
          onSelect={setSelectedMaterial}
          basePrice={product.base_price}
        />

        <div className="product-metadata">
          <h3>Specifications</h3>
          <ul>
            <li>Dimensions: {product.metadata.dimensions.width}"W × {product.metadata.dimensions.height}"H × {product.metadata.dimensions.depth}"D</li>
            <li>Weight: {product.metadata.weight} lbs</li>
          </ul>

          <h3>Care Instructions</h3>
          <ul>
            {product.metadata.care_instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

## Performance Optimization Examples

### Lazy Loading and Code Splitting

Optimizing bundle size and loading performance:

```tsx
// components/OptimizedFurnitureApp.tsx
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load heavy components
const FurnitureViewer = lazy(() => import('./FurnitureViewer'));
const PaymentPage = lazy(() => import('./PaymentPage'));
const ProductComparison = lazy(() => import('./ProductComparison'));

// Lightweight fallback components
const ViewerSkeleton = () => (
  <div className="viewer-skeleton">
    <div className="skeleton-content" />
  </div>
);

const PageSkeleton = () => (
  <div className="page-skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-content" />
  </div>
);

export default function OptimizedFurnitureApp() {
  const [currentView, setCurrentView] = useState('home');

  return (
    <div className="furniture-app">
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={logErrorToService}
      >
        <Suspense fallback={<ViewerSkeleton />}>
          {currentView === 'home' && (
            <FurnitureViewer productName="Modern Sofa" />
          )}
        </Suspense>

        <Suspense fallback={<PageSkeleton />}>
          {currentView === 'payment' && <PaymentPage />}
        </Suspense>

        <Suspense fallback={<PageSkeleton />}>
          {currentView === 'compare' && <ProductComparison />}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Preload critical components
export const preloadComponents = () => {
  import('./FurnitureViewer');
  import('./PaymentPage');
};

// Use in app initialization
useEffect(() => {
  // Preload after initial render
  setTimeout(preloadComponents, 1000);
}, []);
```

### Image and Model Optimization

Optimizing asset loading for better performance:

```tsx
// utils/assetOptimization.ts
interface OptimizedAsset {
  url: string;
  format: string;
  size: 'small' | 'medium' | 'large';
}

export class AssetOptimizer {
  private static modelCache = new Map<string, ArrayBuffer>();
  private static imageCache = new Map<string, string>();

  // Progressive model loading
  static async loadModelProgressive(baseUrl: string): Promise<string> {
    const sizes = ['small', 'medium', 'large'] as const;
    
    for (const size of sizes) {
      try {
        const url = `${baseUrl}_${size}.glb`;
        const cached = this.modelCache.get(url);
        
        if (cached) {
          return URL.createObjectURL(new Blob([cached]));
        }

        const response = await fetch(url);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          this.modelCache.set(url, buffer);
          return URL.createObjectURL(new Blob([buffer]));
        }
      } catch (error) {
        console.warn(`Failed to load ${size} model:`, error);
      }
    }
    
    throw new Error('No model variants could be loaded');
  }

  // Responsive image loading
  static getOptimizedImageUrl(baseUrl: string, width: number): string {
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    const targetWidth = Math.ceil(width * devicePixelRatio);

    // Choose appropriate size breakpoint
    let size: string;
    if (targetWidth <= 400) size = 'small';
    else if (targetWidth <= 800) size = 'medium';
    else size = 'large';

    // Use WebP if supported, fallback to original format
    const supportsWebP = this.supportsWebP();
    const extension = supportsWebP ? 'webp' : 'jpg';

    return `${baseUrl}_${size}.${extension}`;
  }

  private static supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Preload critical assets
  static async preloadCriticalAssets(textures: TextureConfig[]): Promise<void> {
    const preloadPromises = textures.map(async texture => {
      // Preload small versions for immediate display
      const imagePromise = new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't fail on individual image errors
        img.src = this.getOptimizedImageUrl(texture.img, 400);
      });

      // Preload model metadata (not full model)
      const modelMetadataPromise = fetch(`${texture.model}.metadata.json`)
        .then(response => response.json())
        .catch(() => null);

      return Promise.all([imagePromise, modelMetadataPromise]);
    });

    await Promise.allSettled(preloadPromises);
  }
}

// Optimized FurnitureViewer with progressive loading
export default function OptimizedFurnitureViewer({ productName }: { productName: string }) {
  const [modelQuality, setModelQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [imageQuality, setImageQuality] = useState<'low' | 'high'>('low');

  useEffect(() => {
    // Progressive enhancement based on device capabilities
    const enhanceQuality = async () => {
      // Check device performance
      const isHighPerformance = navigator.hardwareConcurrency >= 4 && 
                                !isMobile();
      
      // Check connection speed
      const connection = (navigator as any).connection;
      const isFastConnection = !connection || 
                              connection.effectiveType === '4g' ||
                              connection.downlink > 10;

      if (isHighPerformance && isFastConnection) {
        // Upgrade to high quality after initial load
        setTimeout(() => {
          setModelQuality('high');
          setImageQuality('high');
        }, 2000);
      } else if (isFastConnection) {
        // Medium quality for decent connections
        setTimeout(() => {
          setModelQuality('medium');
          setImageQuality('high');
        }, 1500);
      }
    };

    enhanceQuality();
  }, []);

  const optimizedTextures = TEXTURES.map(texture => ({
    ...texture,
    model: `${texture.model.replace('.glb', '')}_${modelQuality}.glb`,
    img: AssetOptimizer.getOptimizedImageUrl(texture.img, 800)
  }));

  return (
    <div className="optimized-viewer">
      <div className="quality-indicator">
        Model: {modelQuality} | Images: {imageQuality}
      </div>
      
      {/* Use optimized textures */}
      <FurnitureViewer 
        productName={productName}
        textures={optimizedTextures}
      />
    </div>
  );
}
```

---

## Testing Examples

### Component Testing with React Testing Library

Comprehensive testing examples for all components:

```tsx
// __tests__/FurnitureViewer.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import FurnitureViewer from '../components/FurnitureViewer';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock Google Model Viewer
jest.mock('@google/model-viewer', () => ({}));

// Mock device detection
jest.mock('../utils/deviceDetection', () => ({
  isMobile: jest.fn(),
}));

describe('FurnitureViewer', () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    // Mock Web Share API
    Object.assign(navigator, {
      share: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default product name', () => {
    render(<FurnitureViewer />);
    expect(screen.getByText('Modern Sofa Set')).toBeInTheDocument();
  });

  it('renders with custom product name', () => {
    render(<FurnitureViewer productName="Custom Sofa" />);
    expect(screen.getByText('Custom Sofa')).toBeInTheDocument();
  });

  it('displays texture selection buttons', () => {
    render(<FurnitureViewer />);
    
    const blueButton = screen.getByLabelText('Choose Blue texture');
    const redButton = screen.getByLabelText('Choose Red texture');
    
    expect(blueButton).toBeInTheDocument();
    expect(redButton).toBeInTheDocument();
  });

  it('changes texture when texture button is clicked', async () => {
    render(<FurnitureViewer />);
    
    const redButton = screen.getByLabelText('Choose Red texture');
    
    fireEvent.click(redButton);
    
    await waitFor(() => {
      expect(redButton).toHaveClass('border-[#b32a00]');
    });
  });

  it('handles cart button click', () => {
    render(<FurnitureViewer />);
    
    const cartButton = screen.getByLabelText('Buy');
    
    fireEvent.click(cartButton);
    
    expect(mockPush).toHaveBeenCalledWith('/payment?texture=blue');
  });

  it('handles share functionality with Web Share API', async () => {
    render(<FurnitureViewer productName="Test Sofa" />);
    
    const shareButton = screen.getByLabelText('Share');
    
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Test Sofa',
        url: expect.any(String),
      });
    });
  });

  it('falls back to clipboard when Web Share API is not available', async () => {
    // Remove Web Share API
    delete (navigator as any).share;
    
    render(<FurnitureViewer />);
    
    const shareButton = screen.getByLabelText('Share');
    
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.any(String)
      );
    });
  });

  it('handles AR button click on mobile', () => {
    const { isMobile } = require('../utils/deviceDetection');
    isMobile.mockReturnValue(true);
    
    const mockActivateAR = jest.fn();
    
    // Mock model-viewer element
    const mockViewerRef = {
      current: { activateAR: mockActivateAR }
    };
    
    render(<FurnitureViewer />);
    
    const arButton = screen.getByLabelText('View in AR');
    
    fireEvent.click(arButton);
    
    // In a real test, you'd mock the ref properly
    // This is a simplified example
  });

  it('shows QR modal on desktop AR button click', () => {
    const { isMobile } = require('../utils/deviceDetection');
    isMobile.mockReturnValue(false);
    
    render(<FurnitureViewer />);
    
    const arButton = screen.getByLabelText('View in AR');
    
    fireEvent.click(arButton);
    
    expect(screen.getByText('Scan for AR Experience')).toBeInTheDocument();
  });

  it('closes QR modal when close button is clicked', () => {
    const { isMobile } = require('../utils/deviceDetection');
    isMobile.mockReturnValue(false);
    
    render(<FurnitureViewer />);
    
    const arButton = screen.getByLabelText('View in AR');
    fireEvent.click(arButton);
    
    const closeButton = screen.getByLabelText('Close QR modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Scan for AR Experience')).not.toBeInTheDocument();
  });
});

// ColorPicker tests
describe('ColorPicker', () => {
  const mockColors = [
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Green', value: '#00ff00' },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders all color options', () => {
    render(
      <ColorPicker
        colors={mockColors}
        selected="#ff0000"
        onSelect={mockOnSelect}
      />
    );

    mockColors.forEach(color => {
      expect(screen.getByLabelText(color.name)).toBeInTheDocument();
    });
  });

  it('highlights selected color', () => {
    render(
      <ColorPicker
        colors={mockColors}
        selected="#ff0000"
        onSelect={mockOnSelect}
      />
    );

    const redButton = screen.getByLabelText('Red');
    expect(redButton).toHaveClass('border-white', 'scale-110');
  });

  it('calls onSelect when color is clicked', () => {
    render(
      <ColorPicker
        colors={mockColors}
        selected="#ff0000"
        onSelect={mockOnSelect}
      />
    );

    const blueButton = screen.getByLabelText('Blue');
    fireEvent.click(blueButton);

    expect(mockOnSelect).toHaveBeenCalledWith('#0000ff');
  });

  it('is accessible via keyboard', async () => {
    const user = userEvent.setup();
    
    render(
      <ColorPicker
        colors={mockColors}
        selected="#ff0000"
        onSelect={mockOnSelect}
      />
    );

    const redButton = screen.getByLabelText('Red');
    
    // Tab to the button
    await user.tab();
    expect(redButton).toHaveFocus();
    
    // Press Enter
    await user.keyboard('{Enter}');
    expect(mockOnSelect).toHaveBeenCalledWith('#ff0000');
  });
});

// Integration tests
describe('App Integration', () => {
  it('navigates from viewer to payment', async () => {
    const { rerender } = render(<FurnitureViewer />);
    
    // Select red texture
    const redButton = screen.getByLabelText('Choose Red texture');
    fireEvent.click(redButton);
    
    // Click cart button
    const cartButton = screen.getByLabelText('Buy');
    fireEvent.click(cartButton);
    
    expect(mockPush).toHaveBeenCalledWith('/payment?texture=red');
  });
});

// Mock data generators for testing
export const createMockTexture = (overrides = {}) => ({
  name: 'Test Texture',
  model: '/test.glb',
  iosmodel: '/test.usdz',
  img: 'https://example.com/test.jpg',
  price: 100,
  poster: '/test-poster.webp',
  ...overrides,
});

export const createMockProduct = (overrides = {}) => ({
  id: 'test-product',
  name: 'Test Product',
  description: 'A test product',
  base_price: 299,
  materials: [
    { id: 'test-material', name: 'Test Material', color: '#ff0000', price_modifier: 0 }
  ],
  ...overrides,
});
```

This comprehensive examples document provides practical, real-world usage patterns for all the documented APIs and components, helping developers understand how to integrate and extend the Furniture AR App's functionality effectively.