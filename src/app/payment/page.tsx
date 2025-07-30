"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaLock, FaShippingFast } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SOFAS: Record<string, { name: string; img: string; price: number }> = {
  blue: {
    name: "Blue Sofa",
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133230700104-008_800x.jpg?v=1746022203",
    price: 300,
  },
  red: {
    name: "Red Sofa",
    img: "https://www.jagdishstore.com/cdn/shop/products/1010133220400211-002_800x.jpg?v=1746022983",
    price: 400,
  },
};

function PaymentContent() {
  const params = useSearchParams();
  const texture = params.get("texture") || "blue";
  const sofa = SOFAS[texture] || SOFAS.blue;
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              onClick={() => router.back()}
              aria-label="Back">
              <FaArrowLeft size={18} />
            </button>
            <Image
              src="/danubahome.svg"
              alt="Danube Home Logo"
              width={100}
              height={32}
              className="h-6 sm:h-8 w-auto"
            />
          </div>
          {/* <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
            <FaLock size={12} />
            <span className="hidden sm:inline">Secure Checkout</span>
            <span className="sm:hidden">Secure</span>
          </div> */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Order Summary & Shipping */}
          <div className="flex flex-col gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex items-center gap-6">
                <Image
                  src={sofa.img}
                  alt={sofa.name}
                  width={120}
                  height={120}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{sofa.name}</h3>
                  <p className="text-gray-600">
                    Color: {texture.charAt(0).toUpperCase() + texture.slice(1)}
                  </p>
                </div>
                <div className="text-xl font-bold text-[#b32a00]">
                  ${sofa.price}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaShippingFast /> Shipping Information
              </h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Enter your street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    placeholder="Enter state"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="zip"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    id="zip"
                    type="text"
                    placeholder="Enter ZIP code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    placeholder="Enter country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    required
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-8 lg:mt-0 h-fit">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <form className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name on Card
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                  placeholder="Enter cardholder name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#b32a00] focus:border-[#b32a00] transition-colors placeholder-gray-400 text-gray-900"
                    placeholder="123"
                    required
                    maxLength={4}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#b32a00] text-white font-bold py-3 rounded-lg shadow-md hover:bg-[#a02500] transition text-lg disabled:opacity-50"
                disabled>
                <FaLock /> Pay ${sofa.price}
              </button>
              <div className="text-xs text-gray-400 text-center mt-2">
                This is a demo payment page. No real transaction will occur.
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-lg font-medium">
          Loading Checkout...
        </div>
      }>
      <PaymentContent />
    </Suspense>
  );
}
