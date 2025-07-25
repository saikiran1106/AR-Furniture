"use client";

import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

export default function PaymentPage() {
  const params = useSearchParams();
  const texture = params.get("texture") || "blue";
  const sofa = SOFAS[texture] || SOFAS.blue;
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col gap-8">
        <div className="flex items-center gap-4 mb-2">
          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={() => router.back()}
            aria-label="Back">
            <FaArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Checkout
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product summary */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-4">
            <img
              src={sofa.img}
              alt={sofa.name}
              className="w-40 h-32 object-cover rounded-lg border"
            />
            <div className="text-lg font-semibold text-gray-800">
              {sofa.name}
            </div>
            <div className="text-xl font-bold text-[#b32a00]">
              ${sofa.price}
            </div>
          </div>
          {/* Billing form */}
          <form className="flex-1 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b32a00]"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b32a00]"
                placeholder="1234 5678 9012 3456"
                required
                maxLength={19}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b32a00]"
                  placeholder="MM/YY"
                  required
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b32a00]"
                  placeholder="123"
                  required
                  maxLength={4}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-[#b32a00] text-white font-bold py-3 rounded-lg shadow hover:bg-[#a02500] transition text-lg"
              disabled>
              <FaLock /> Pay ${sofa.price}
            </button>
            <div className="text-xs text-gray-400 text-center mt-2">
              This is a demo payment page. No real transaction will occur.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
