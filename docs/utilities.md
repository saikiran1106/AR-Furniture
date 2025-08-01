# Utility Functions & Helper Methods Documentation

This document provides comprehensive documentation for all utility functions and helper methods used in the Furniture AR App.

## Table of Contents

- [Device Detection](#device-detection)
- [Share Utilities](#share-utilities)
- [QR Code Generation](#qr-code-generation)
- [Navigation Helpers](#navigation-helpers)
- [Data Validation](#data-validation)
- [Error Handling](#error-handling)
- [Performance Utilities](#performance-utilities)

---

## Device Detection

### isMobile()

Detects whether the current device is a mobile device based on user agent string.

**Signature:**
```tsx
function isMobile(): boolean
```

**Implementation:**
```tsx
function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}
```

**Parameters:**
- None

**Returns:**
- `boolean` - `true` if device is mobile, `false` otherwise

**Usage:**
```tsx
// Basic usage
if (isMobile()) {
  // Mobile-specific logic
  viewerRef.current?.activateAR();
} else {
  // Desktop-specific logic
  setShowQR(true);
}

// In conditional rendering
const ARButton = () => (
  <button onClick={isMobile() ? handleDirectAR : handleQRCode}>
    {isMobile() ? "View in AR" : "Get QR Code"}
  </button>
);
```

**Detected Patterns:**
- `Mobi` - General mobile indicator
- `Android` - Android devices
- `iPhone` - iPhone devices  
- `iPad` - iPad devices
- `iPod` - iPod Touch devices
- `Opera Mini` - Opera Mini browser
- `IEMobile` - Internet Explorer Mobile
- `WPDesktop` - Windows Phone

**Edge Cases:**
- **SSR Safety**: Returns `false` when `window` is undefined (server-side)
- **Tablet Detection**: iPads are considered mobile devices
- **User Agent Spoofing**: May be bypassed by modified user agents

---

## Share Utilities

### handleShare()

Comprehensive sharing function with multiple fallback strategies for cross-platform compatibility.

**Signature:**
```tsx
const handleShare: () => Promise<void>
```

**Implementation:**
```tsx
const handleShare = async () => {
  try {
    // Primary: Native Web Share API
    if (navigator.share) {
      await navigator.share({
        title: productName,
        url: window.location.href,
      });
    } 
    // Secondary: Clipboard API
    else if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } 
    // Tertiary: Legacy execCommand
    else {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        alert("Link copied to clipboard!");
      } catch (err) {
        alert(
          "Unable to copy link. Please copy manually: " + window.location.href
        );
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (error) {
    console.error("Error sharing:", error);
    alert(
      "Unable to share. Please copy the link manually: " +
        window.location.href
    );
  }
};
```

**Parameters:**
- None (uses closure variables `productName` and `window.location.href`)

**Returns:**
- `Promise<void>` - Resolves when sharing is complete

**Fallback Strategy:**
1. **Web Share API** - Native mobile sharing (iOS Safari, Android Chrome)
2. **Clipboard API** - Modern clipboard access (HTTPS required)
3. **execCommand** - Legacy copy support (deprecated but widely supported)
4. **Manual Fallback** - User notification with URL to copy manually

**Browser Support:**
| Method | Chrome | Safari | Firefox | Edge | Mobile |
|--------|--------|--------|---------|------|--------|
| Web Share API | ✅ | ✅ | ❌ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ✅ | ✅* |
| execCommand | ✅ | ✅ | ✅ | ✅ | ✅ |

*Requires HTTPS context

**Usage:**
```tsx
// In component
const FurnitureViewer = ({ productName }) => {
  const handleShare = async () => {
    // Implementation above
  };

  return (
    <button onClick={handleShare} aria-label="Share">
      <FaShareAlt />
    </button>
  );
};

// With error handling
const shareWithErrorHandling = async () => {
  try {
    await handleShare();
  } catch (error) {
    console.error('Share failed:', error);
    // Custom error handling
  }
};
```

**Security Considerations:**
- **HTTPS Required**: Modern APIs require secure context
- **User Gesture**: Must be triggered by user interaction
- **Permissions**: Some browsers may prompt for clipboard access

---

## QR Code Generation

### generateQRUrl()

Generates QR code URL using an external service for cross-device AR sharing.

**Signature:**
```tsx
function generateQRUrl(url: string, size?: string): string
```

**Implementation:**
```tsx
const generateQRUrl = (url: string, size: string = "200x200"): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(url)}`;
};

// Usage in component
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
  typeof window !== "undefined" ? window.location.href : ""
)}`;
```

**Parameters:**
- `url: string` - The URL to encode in the QR code
- `size?: string` - Optional size parameter (default: "200x200")

**Returns:**
- `string` - URL pointing to generated QR code image

**Features:**
- **URL Encoding**: Properly encodes special characters
- **Size Customization**: Configurable QR code dimensions
- **External Service**: Uses qrserver.com for reliable generation
- **SSR Safety**: Handles undefined window object

**Usage Examples:**
```tsx
// Basic usage
const qrCodeUrl = generateQRUrl("https://example.com");

// Custom size
const largeQR = generateQRUrl("https://example.com", "400x400");

// In React component
const QRDisplay = ({ shareUrl }: { shareUrl: string }) => (
  <img 
    src={generateQRUrl(shareUrl)} 
    alt="QR code for AR sharing"
    width={200}
    height={200}
  />
);

// With error handling
const SafeQRDisplay = ({ shareUrl }: { shareUrl: string }) => {
  const [qrError, setQRError] = useState(false);
  
  return (
    <img 
      src={generateQRUrl(shareUrl)}
      alt="QR code"
      onError={() => setQRError(true)}
      style={{ display: qrError ? 'none' : 'block' }}
    />
  );
};
```

**Alternative Implementation:**
```tsx
// More robust version with caching
const QRCache = new Map<string, string>();

const generateQRUrlCached = (url: string, size: string = "200x200"): string => {
  const cacheKey = `${url}-${size}`;
  
  if (QRCache.has(cacheKey)) {
    return QRCache.get(cacheKey)!;
  }
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(url)}`;
  QRCache.set(cacheKey, qrUrl);
  
  return qrUrl;
};
```

---

## Navigation Helpers

### handleCart()

Navigation utility for checkout flow with state preservation.

**Signature:**
```tsx
const handleCart: () => void
```

**Implementation:**
```tsx
const handleCart = () => {
  router.push(`/payment?texture=${selectedTexture.name.toLowerCase()}`);
};
```

**Parameters:**
- None (uses closure variables `router` and `selectedTexture`)

**Returns:**
- `void`

**Features:**
- **State Preservation**: Passes selected texture via URL parameters
- **Type Safety**: Ensures texture name is properly formatted
- **Router Integration**: Uses Next.js router for navigation

**Usage:**
```tsx
// In component context
const FurnitureViewer = () => {
  const router = useRouter();
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0]);
  
  const handleCart = () => {
    router.push(`/payment?texture=${selectedTexture.name.toLowerCase()}`);
  };
  
  return (
    <button onClick={handleCart}>
      <FaShoppingCart />
    </button>
  );
};
```

### handleBack()

Universal back navigation utility.

**Signature:**
```tsx
const handleBack: () => void
```

**Implementation:**
```tsx
const handleBack = () => {
  router.back();
};

// Alternative with fallback
const handleBackWithFallback = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
```

**Parameters:**
- None

**Returns:**
- `void`

**Usage:**
```tsx
// Basic back navigation
<button onClick={() => router.back()}>
  <FaArrowLeft /> Back
</button>

// With accessibility
<button 
  onClick={handleBack}
  aria-label="Go back"
>
  <FaArrowLeft />
</button>
```

---

## Data Validation

### validateTexture()

Validates texture parameter from URL and provides fallback.

**Signature:**
```tsx
function validateTexture(texture: string | null): SofaVariant
```

**Implementation:**
```tsx
const validateTexture = (texture: string | null): SofaVariant => {
  const textureKey = texture || "blue";
  return SOFAS[textureKey] || SOFAS.blue;
};

// Usage in payment page
const params = useSearchParams();
const texture = params.get("texture") || "blue";
const sofa = SOFAS[texture] || SOFAS.blue;
```

**Parameters:**
- `texture: string | null` - Texture name from URL parameters

**Returns:**
- `SofaVariant` - Valid sofa configuration object

**Features:**
- **Null Safety**: Handles null/undefined input
- **Fallback Strategy**: Always returns valid configuration
- **Type Safety**: Ensures return type is valid SofaVariant

**Usage:**
```tsx
// In payment component
const PaymentPage = () => {
  const params = useSearchParams();
  const sofa = validateTexture(params.get("texture"));
  
  return (
    <div>
      <h1>{sofa.name}</h1>
      <p>Price: ${sofa.price}</p>
    </div>
  );
};
```

### isValidTextureKey()

Type guard for texture key validation.

**Signature:**
```tsx
function isValidTextureKey(key: string): key is keyof typeof SOFAS
```

**Implementation:**
```tsx
const isValidTextureKey = (key: string): key is keyof typeof SOFAS => {
  return key in SOFAS;
};

// Usage
const processTexture = (textureKey: string) => {
  if (isValidTextureKey(textureKey)) {
    // TypeScript knows textureKey is valid
    const sofa = SOFAS[textureKey];
    return sofa;
  }
  return SOFAS.blue; // fallback
};
```

---

## Error Handling

### createErrorHandler()

Higher-order function for consistent error handling across components.

**Signature:**
```tsx
function createErrorHandler(context: string): (error: Error) => void
```

**Implementation:**
```tsx
const createErrorHandler = (context: string) => (error: Error) => {
  console.error(`Error in ${context}:`, error);
  
  // Log to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: `${context}: ${error.message}`,
      fatal: false
    });
  }
  
  // Show user-friendly message
  alert(`Something went wrong. Please try again.`);
};

// Usage
const handleARError = createErrorHandler('AR Activation');
const handleShareError = createErrorHandler('Social Sharing');

try {
  await activateAR();
} catch (error) {
  handleARError(error);
}
```

### withErrorBoundary()

Higher-order component for error boundary integration.

**Signature:**
```tsx
function withErrorBoundary<T>(Component: React.ComponentType<T>): React.ComponentType<T>
```

**Implementation:**
```tsx
const withErrorBoundary = <T extends {}>(
  Component: React.ComponentType<T>
): React.ComponentType<T> => {
  return (props: T) => (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Component error:', error, errorInfo);
      }}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Usage
export default withErrorBoundary(FurnitureViewer);
```

---

## Performance Utilities

### debounce()

Debounces function calls to improve performance during rapid user interactions.

**Signature:**
```tsx
function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void
```

**Implementation:**
```tsx
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Usage for texture changes
const debouncedTextureChange = debounce((texture: TextureConfig) => {
  setSelectedTexture(texture);
}, 300);
```

### memoizeOne()

Simple memoization utility for expensive calculations.

**Signature:**
```tsx
function memoizeOne<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn
```

**Implementation:**
```tsx
const memoizeOne = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => TReturn
): ((...args: TArgs) => TReturn) => {
  let lastArgs: TArgs | undefined;
  let lastResult: TReturn;
  
  return (...args: TArgs): TReturn => {
    if (!lastArgs || !argsAreEqual(lastArgs, args)) {
      lastArgs = args;
      lastResult = fn(...args);
    }
    return lastResult;
  };
};

// Helper for argument comparison
const argsAreEqual = <T extends any[]>(a: T, b: T): boolean => {
  return a.length === b.length && a.every((val, i) => val === b[i]);
};

// Usage
const memoizedQRGeneration = memoizeOne((url: string, size: string) => 
  generateQRUrl(url, size)
);
```

### preloadImage()

Preloads images for better user experience.

**Signature:**
```tsx
function preloadImage(src: string): Promise<void>
```

**Implementation:**
```tsx
const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Usage for texture preloading
const preloadTextures = async (textures: TextureConfig[]) => {
  const imagePromises = textures.map(texture => preloadImage(texture.img));
  try {
    await Promise.all(imagePromises);
    console.log('All texture images preloaded');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

// In component
useEffect(() => {
  preloadTextures(TEXTURES);
}, []);
```

---

## Custom Hooks Utilities

### useLocalStorage()

Custom hook for localStorage integration with SSR safety.

**Signature:**
```tsx
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

**Implementation:**
```tsx
const useLocalStorage = <T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Usage
const [selectedTexture, setSelectedTexture] = useLocalStorage('selectedTexture', 'blue');
```

### useDebounce()

Custom hook for debouncing values.

**Signature:**
```tsx
function useDebounce<T>(value: T, delay: number): T
```

**Implementation:**
```tsx
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
    }
  }, [debouncedSearchTerm]);
};
```

---

## Constants & Configuration

### Application Constants

**File paths and configuration values used throughout the application:**

```tsx
// Model file paths
export const MODEL_PATHS = {
  BLUE_GLB: '/sample-furniture-blue.glb',
  BLUE_USDZ: '/sample-furniture-blue.usdz',
  RED_GLB: '/sample-furniture-red.glb',
  RED_USDZ: '/sample-furniture-red.usdz',
} as const;

// Image paths
export const IMAGE_PATHS = {
  DANUBE_LOGO: '/danubahome.svg',
  NUSITE_LOGO: '/nusitelogo.svg',
  BLUE_POSTER: '/sofa-blue-poster.webp',
  RED_POSTER: '/sofa-red-poster.webp',
} as const;

// Application configuration
export const APP_CONFIG = {
  LOADING_TIMEOUT: 2000,
  QR_CODE_SIZE: '200x200',
  MODEL_VIEWER_EXPOSURE: '1',
  MODEL_VIEWER_SHADOW_INTENSITY: '1',
  DEBOUNCE_DELAY: 300,
} as const;

// Supported file formats
export const SUPPORTED_FORMATS = {
  MODELS: ['.glb', '.usdz'],
  IMAGES: ['.webp', '.png', '.jpg', '.jpeg'],
  VIDEOS: ['.mp4', '.webm'],
} as const;
```

### Environment Utilities

**Helper functions for environment detection:**

```tsx
export const ENV_UTILS = {
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isServer: () => typeof window === 'undefined',
  isBrowser: () => typeof window !== 'undefined',
  isHTTPS: () => typeof window !== 'undefined' && window.location.protocol === 'https:',
} as const;

// Usage
if (ENV_UTILS.isDevelopment()) {
  console.log('Development mode active');
}

if (ENV_UTILS.isHTTPS()) {
  // Enable features that require HTTPS
  enableClipboardAPI();
}
```

---

## Testing Utilities

### Mock Functions

**Utility functions for testing components:**

```tsx
// Mock user agent for device detection testing
export const mockUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    value: userAgent,
    configurable: true,
  });
};

// Mock navigator APIs
export const mockNavigatorAPIs = () => {
  Object.defineProperty(navigator, 'share', {
    value: jest.fn().mockResolvedValue(undefined),
    configurable: true,
  });
  
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
    configurable: true,
  });
};

// Test data factories
export const createMockTexture = (overrides: Partial<TextureConfig> = {}): TextureConfig => ({
  name: 'Test',
  model: '/test.glb',
  iosmodel: '/test.usdz',
  img: 'https://example.com/test.jpg',
  price: 100,
  poster: '/test-poster.webp',
  ...overrides,
});
```

This comprehensive documentation covers all the utility functions and helper methods identified in the Furniture AR App codebase, providing developers with detailed information about implementation, usage patterns, and best practices for each utility.