"use client";

import { useEffect, useRef, useState } from "react";
import { FaShareAlt, FaShoppingCart, FaTimes } from "react-icons/fa";
import { MdViewInAr } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Type-cast model-viewer to avoid TypeScript JSX error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModelViewer = "model-viewer" as any;

const TEXTURES = [
  {
    name: "Blue",
    model: "/sample-furniture-blue.glb",
    iosmodel: "/sample-furniture-blue.usdz",
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133230700104-008_800x.jpg?v=1746022203",
    price: 300,
  },
  {
    name: "Red",
    model: "/sample-furniture-red.glb",
    iosmodel: "/sample-furniture-red.usdz",
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133220400211-002_800x.jpg?v=1746022983",
    price: 400,
  },
];

// Type for model-viewer element
interface ModelViewerElement extends HTMLElement {
  activateAR: () => void;
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

export default function FurnitureViewer({
  productName = "Modern Sofa Set",
}: {
  productName?: string;
}) {
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const [selectedTexture, setSelectedTexture] = useState(TEXTURES[0]);
  const [showQR, setShowQR] = useState(false);
  const [fade, setFade] = useState(false);
  const router = useRouter();

  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  const handleTextureChange = (texture: (typeof TEXTURES)[number]) => {
    if (texture.model === selectedTexture.model) return;
    setFade(true);
    setTimeout(() => {
      setSelectedTexture(texture);
      setFade(false);
    }, 300);
  };

  const handleAR = () => {
    if (isMobile()) {
      viewerRef.current?.activateAR();
    } else {
      setShowQR(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: productName,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleCart = () => {
    router.push(`/payment?texture=${selectedTexture.name.toLowerCase()}`);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  )}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#181818] text-white items-center relative">
      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 relative min-w-[300px] shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setShowQR(false)}
              aria-label="Close QR modal">
              <FaTimes />
            </button>
            <div className="text-black font-bold text-xl mb-2">
              Scan for AR Experience
            </div>
            <Image
              src={qrUrl}
              alt="QR code for AR"
              width={160}
              height={160}
              className="w-40 h-40 rounded-lg border border-gray-200 shadow"
            />
            <div className="text-gray-700 text-base text-center font-medium">
              Scan this QR code with your mobile device to view the model in AR
              mode.
            </div>
          </div>
        </div>
      )}

      <Image
        src="/danubahome.svg"
        alt="Danube Home Logo"
        width={180}
        height={100}
        className="w-[380px] h-auto mt-6 mb-5"
      />

      <div className="text-2xl font-medium mb-4 text-center">{productName}</div>

      <div className="w-full flex-1 flex items-center justify-center relative">
        <div
          className={`transition-opacity duration-300 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
          style={{
            width: "100%",
            maxWidth: 400,
            height: 400,
            background: "#222",
            borderRadius: 16,
          }}>
          <ModelViewer
            ref={viewerRef}
            src={selectedTexture.model}
            ios-src={selectedTexture.iosmodel}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            style={{
              width: "100%",
              maxWidth: 400,
              height: 400,
              background: "#222",
              borderRadius: 16,
            }}
            exposure="1"
            shadow-intensity="1"
            alt={productName}>
            <button slot="ar-button" className="hidden" />
          </ModelViewer>
        </div>
      </div>

      {/* Texture Picker */}
      <div className="flex gap-6 justify-center mt-6 mb-6">
        {TEXTURES.map((texture) => (
          <button
            key={texture.name}
            className={`rounded-lg border-2 transition-all duration-200 overflow-hidden w-16 h-16 ${
              selectedTexture.model === texture.model
                ? "border-[#b32a00] scale-110"
                : "border-transparent"
            }`}
            onClick={() => handleTextureChange(texture)}
            aria-label={`Choose ${texture.name} texture`}>
            <Image
              src={texture.img}
              alt={texture.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 mt-8 mb-8 w-full">
        <button
          className="bg-white text-[#b32a00] rounded-full p-4 shadow-lg hover:bg-gray-100 transition"
          onClick={handleShare}
          aria-label="Share">
          <FaShareAlt size={28} />
        </button>
        <button
          className="bg-white text-[#b32a00] rounded-full p-6 shadow-lg border-4 border-[#b32a00] hover:bg-gray-100 transition"
          onClick={handleAR}
          aria-label="View in AR">
          <MdViewInAr size={36} />
        </button>
        <button
          className="bg-white text-[#b32a00] rounded-full p-4 shadow-lg hover:bg-gray-100 transition"
          onClick={handleCart}
          aria-label="Buy">
          <FaShoppingCart size={28} />
        </button>
      </div>
    </div>
  );
}
