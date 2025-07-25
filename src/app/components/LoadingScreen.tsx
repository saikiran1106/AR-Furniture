import { FaInfinity } from "react-icons/fa";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-8">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-12 mt-32">
          <span
            className="text-3xl font-extrabold text-[#b32a00] tracking-wide"
            style={{ fontStyle: "italic" }}>
            DANUBE HOME
          </span>
        </div>
        <div className="w-[80vw] max-w-xl h-1 bg-gray-200 rounded-full overflow-hidden mb-16">
          <div
            className="h-full bg-[#b32a00] w-1/2 animate-pulse transition-all duration-700"
            style={{ width: "60%" }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 mb-8">
        <span className="text-gray-600 text-base">Powered by</span>
        <FaInfinity className="text-blue-500 text-3xl" />
        <span className="text-blue-700 font-bold text-lg">nusite</span>
        <span className="text-xs text-gray-500">IT Consulting Limited</span>
      </div>
      <div className="text-xs text-gray-500 mt-4">
        We will use cookies to enable the operations of the app,
        <br />
        and measure usage and engagement.
      </div>
    </div>
  );
}
