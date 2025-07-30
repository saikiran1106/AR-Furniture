"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaShareAlt,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
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
    poster: "/sofa-blue-poster.png",
  },
  {
    name: "Red",
    model: "/sample-furniture-red.glb",
    iosmodel: "/sample-furniture-red.usdz",
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133220400211-002_800x.jpg?v=1746022983",
    price: 400,
    poster: "/sofa-red-poster.png",
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
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          url: window.location.href,
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } else {
        // Fallback for browsers without clipboard API
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

  const handleCart = () => {
    router.push(`/payment?texture=${selectedTexture.name.toLowerCase()}`);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  )}`;

  return (
    <div className="h-screen bg-[#181818] text-white relative">
      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 relative max-w-sm w-full shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setShowQR(false)}
              aria-label="Close QR modal">
              <FaTimes />
            </button>
            <div className="text-black font-bold text-xl mb-2 text-center mt-8">
              Scan for AR Experience
            </div>
            <Image
              src={qrUrl}
              alt="QR code for AR"
              width={160}
              height={160}
              className="w-40 h-40 rounded-lg border border-gray-200 shadow"
            />
            <div className="text-gray-700 text-sm text-center font-medium leading-relaxed">
              Scan this QR code with your mobile device to view the model in AR
              mode.
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen 3D Model as background */}
      <ModelViewer
        ref={viewerRef}
        src={selectedTexture.model}
        ios-src={selectedTexture.iosmodel}
        poster={selectedTexture.poster}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        exposure="1"
        shadow-intensity="1"
        alt={productName}
        className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-300 ${
          fade ? "opacity-0" : "opacity-100"
        }`}>
        <button slot="ar-button" className="hidden" />
      </ModelViewer>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top Section */}
        <div className="absolute top-4 left-0 right-0 flex flex-col items-center w-full p-4 sm:p-6 pointer-events-auto">
          <div className="relative w-full flex justify-center items-center">
            <button
              onClick={() => router.back()}
              className="absolute left-0 p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Go back">
              <FaArrowLeft size={20} />
            </button>
            <Image
              src="/danubahome.svg"
              alt="Danube Home Logo"
              width={180}
              height={100}
              className="w-54 h-auto"
            />
          </div>
          <div className="text-lg mt-4 font-medium text-center pt-2 italic">
            {productName}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-[15vh] sm:bottom-0 left-0 right-0 flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 pointer-events-auto">
          {/* Texture Picker */}
          <div className="flex mb-8 gap-4 justify-center">
            {TEXTURES.map((texture) => (
              <button
                key={texture.name}
                className={`rounded-full border-2 transition-all duration-200 overflow-hidden w-8 h-8 sm:w-10 sm:h-10 ${
                  selectedTexture.model === texture.model
                    ? "border-[#b32a00] scale-110"
                    : "border-transparent hover:border-white/50"
                }`}
                onClick={() => handleTextureChange(texture)}
                aria-label={`Choose ${texture.name} texture`}>
                <Image
                  src={texture.img}
                  alt={texture.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-6 sm:gap-8">
            {/* Cart Button */}
            <button
              className="bg-white/90 text-black rounded-full p-2 sm:p-4 shadow-lg hover:bg-white transition-transform duration-200 hover:scale-105"
              onClick={handleCart}
              aria-label="Buy">
              <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* AR Button */}
            <button
              className="bg-white text-black rounded-full p-3 sm:p-5 shadow-xl border-2 border-white hover:bg-white/90 transition-transform duration-200 hover:scale-105"
              onClick={handleAR}
              aria-label="View in AR">
              <MdViewInAr className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Share Button */}
            <button
              className="bg-white/90 text-black rounded-full p-2 sm:p-4 shadow-lg hover:bg-white transition-transform duration-200 hover:scale-105"
              onClick={handleShare}
              aria-label="Share">
              <FaShareAlt className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
