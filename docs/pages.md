# Pages & Routing Documentation

This document provides detailed documentation for all pages and routing patterns in the Furniture AR App.

## Table of Contents

- [Overview](#overview)
- [Route Structure](#route-structure)
- [Page Components](#page-components)
- [Navigation Patterns](#navigation-patterns)
- [URL Parameters](#url-parameters)

---

## Overview

The Furniture AR App uses Next.js 15 App Router for file-based routing. All pages are located in the `src/app/` directory and follow the App Router conventions.

### Routing Architecture

```
src/app/
├── layout.tsx          # Root layout (applies to all pages)
├── page.tsx           # Home page (/)
├── payment/           # Payment route group
│   └── page.tsx       # Payment page (/payment)
└── globals.css        # Global styles
```

---

## Route Structure

| Route | File | Component | Description |
|-------|------|-----------|-------------|
| `/` | `app/page.tsx` | `Home` | Main furniture viewer with AR capabilities |
| `/payment` | `app/payment/page.tsx` | `PaymentPage` | Checkout form with product selection |

---

## Page Components

### Home Page (`/`)

**File**: `src/app/page.tsx`  
**Component**: `Home`

The main landing page that displays the 3D furniture viewer with AR capabilities.

#### Features

- **Loading State Management**: Shows `LoadingScreen` during initialization
- **Dynamic Component Loading**: Lazy loads `FurnitureViewer` for performance
- **Client-Side Rendering**: Uses `"use client"` directive for interactive features

#### Implementation

```tsx
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "./components/LoadingScreen";

const FurnitureViewer = dynamic(() => import("./components/FurnitureViewer"), {
  ssr: false,
});

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data/model loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <FurnitureViewer productName="Modern Sofa Set" />;
}
```

#### Loading Strategy

1. **Initial State**: `loading = true`
2. **Timeout**: 2-second delay to simulate asset loading
3. **Component Transition**: Smooth switch from `LoadingScreen` to `FurnitureViewer`
4. **SSR Disabled**: `FurnitureViewer` is client-only due to WebGL dependencies

#### Performance Optimizations

- **Dynamic Import**: Reduces initial bundle size
- **No SSR**: Prevents hydration mismatches with WebGL content
- **Loading Simulation**: Provides consistent UX during asset loading

---

### Payment Page (`/payment`)

**File**: `src/app/payment/page.tsx`  
**Component**: `PaymentPage`

A comprehensive checkout page with shipping information and payment processing.

#### Features

- **Product Selection**: Displays selected furniture variant based on URL parameters
- **Responsive Design**: Mobile-first layout with desktop optimizations
- **Form Validation**: Client-side validation for all required fields
- **Secure Styling**: Visual security indicators and SSL-style design
- **Demo Mode**: Clearly marked as demonstration (no real transactions)

#### URL Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `texture` | `string` | Selected furniture texture/color | `?texture=blue` |

#### Implementation

```tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
// ... other imports

const SOFAS: Record<string, { name: string; img: string; price: number }> = {
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

function PaymentContent() {
  const params = useSearchParams();
  const texture = params.get("texture") || "blue";
  const sofa = SOFAS[texture] || SOFAS.blue;
  
  // Component implementation...
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentContent />
    </Suspense>
  );
}
```

#### Layout Structure

The payment page uses a responsive two-column layout:

```tsx
<main className="lg:grid lg:grid-cols-2 lg:gap-12">
  {/* Left Column: Order Summary & Shipping */}
  <div className="flex flex-col gap-8">
    <OrderSummary />
    <ShippingForm />
  </div>
  
  {/* Right Column: Payment Details */}
  <div className="h-fit">
    <PaymentForm />
  </div>
</main>
```

#### Form Sections

##### Order Summary
- **Product Image**: Dynamic based on selected texture
- **Product Name**: Color-coded display name
- **Pricing**: Dynamic pricing from texture configuration
- **Color Info**: Selected texture/color variant

##### Shipping Information
- **Full Name**: Required text input
- **Address**: Complete shipping address form
- **City/State/ZIP**: Location details
- **Country**: International shipping support

##### Payment Details
- **Cardholder Name**: Name on credit card
- **Card Number**: Formatted credit card input (demo only)
- **Expiry Date**: MM/YY format validation
- **CVC**: Security code input
- **Submit Button**: Disabled (demo mode)

#### Security Features

- **Visual Security**: Lock icons and secure styling
- **HTTPS Indicators**: SSL-style visual cues
- **Demo Disclaimers**: Clear indication of demo status
- **Form Validation**: Client-side input validation

#### Error Handling

The payment page includes robust error handling:

```tsx
// Fallback for missing texture parameters
const sofa = SOFAS[texture] || SOFAS.blue;

// Suspense fallback for loading states
<Suspense fallback={<LoadingFallback />}>
  <PaymentContent />
</Suspense>
```

---

## Root Layout

**File**: `src/app/layout.tsx`  
**Component**: `RootLayout`

The root layout component that wraps all pages in the application.

#### Features

- **Font Optimization**: Google Fonts integration with Roboto
- **Global Metadata**: SEO and app metadata configuration
- **CSS Variables**: Font family CSS custom properties
- **Accessibility**: Language and semantic HTML structure

#### Implementation

```tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

#### Font Configuration

- **Font Family**: Roboto (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 700 (Bold)
- **Subsets**: Latin character set
- **CSS Variable**: `--font-sans` for Tailwind integration

---

## Navigation Patterns

### Page Transitions

The app uses several navigation patterns:

#### 1. Home to Payment
```tsx
// From FurnitureViewer component
const handleCart = () => {
  router.push(`/payment?texture=${selectedTexture.name.toLowerCase()}`);
};
```

#### 2. Back Navigation
```tsx
// Universal back button pattern
const router = useRouter();

<button onClick={() => router.back()}>
  <FaArrowLeft /> Back
</button>
```

#### 3. External Links
```tsx
// Social sharing with fallbacks
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: productName,
      url: window.location.href,
    });
  }
  // Fallback logic...
};
```

### URL State Management

The application uses URL parameters to maintain state across page transitions:

```tsx
// Payment page reads texture from URL
const params = useSearchParams();
const texture = params.get("texture") || "blue";

// FurnitureViewer passes texture to payment
router.push(`/payment?texture=${selectedTexture.name.toLowerCase()}`);
```

---

## URL Parameters

### Payment Page Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `texture` | `string` | No | `"blue"` | Furniture color/texture variant |

#### Valid Texture Values

- `"blue"` - Blue sofa variant ($300)
- `"red"` - Red sofa variant ($400)

#### Parameter Validation

```tsx
// Automatic fallback for invalid parameters
const texture = params.get("texture") || "blue";
const sofa = SOFAS[texture] || SOFAS.blue;
```

---

## Error Handling & Fallbacks

### Suspense Boundaries

The payment page uses Suspense for handling search parameter loading:

```tsx
export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentContent />
    </Suspense>
  );
}
```

### Invalid Route Handling

Next.js automatically handles 404 errors for undefined routes. Custom error pages can be added:

```tsx
// app/not-found.tsx (optional)
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
```

### Parameter Fallbacks

All URL parameters have sensible defaults:

```tsx
// Graceful degradation for missing parameters
const texture = params.get("texture") || "blue";
const sofa = SOFAS[texture] || SOFAS.blue;
```

---

## SEO & Metadata

### Root Metadata

```tsx
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
```

### Page-Specific Metadata

Pages can override metadata using the `generateMetadata` function:

```tsx
// Example for dynamic metadata
export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const texture = searchParams.texture || 'blue';
  
  return {
    title: `Checkout - ${texture} Sofa`,
    description: `Complete your purchase of the ${texture} sofa`,
  };
}
```

---

## Performance Considerations

### Code Splitting

- **Dynamic Imports**: `FurnitureViewer` is dynamically imported
- **Route-Based Splitting**: Automatic code splitting per route
- **Component-Level Splitting**: Heavy components loaded on demand

### Loading States

- **Home Page**: Custom loading screen with progress animation
- **Payment Page**: Suspense-based loading for search params
- **Component Loading**: Graceful loading states for heavy components

### Caching Strategy

- **Static Generation**: Layout and static components are pre-built
- **Client-Side Routing**: Fast navigation between pages
- **Asset Caching**: Browser caching for static assets

---

## Development Patterns

### Adding New Pages

1. **Create Page File**: Add `page.tsx` in appropriate directory
2. **Export Default Component**: Follow Next.js naming conventions
3. **Add Client Directive**: Use `"use client"` for interactive features
4. **Configure Metadata**: Add page-specific metadata if needed

### Route Groups

Use route groups for organization without affecting URL structure:

```
app/
├── (marketing)/
│   ├── about/page.tsx      # /about
│   └── contact/page.tsx    # /contact
└── (shop)/
    ├── products/page.tsx   # /products
    └── cart/page.tsx       # /cart
```

### Middleware Integration

Add middleware for route protection or redirects:

```tsx
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Add custom routing logic
  return NextResponse.next();
}
```