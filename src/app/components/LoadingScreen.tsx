import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between bg-white text-center p-4 sm:p-6 overflow-hidden font-sans">
      {/* Top section with logo */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-0">
        <div className="mb-8 sm:mb-12">
          <Image
            src="/danubahome.svg"
            alt="Danube Home Logo"
            className="w-50 sm:w-40 md:w-48 h-auto"
            width={200}
            height={80}
          />
        </div>

        {/* Animated progress bar */}
        <div className="w-[70vw] sm:w-[60vw] md:w-[50vw] max-w-md h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#b32a00] rounded-full loading-bar-animation origin-left"></div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-3 pb-4 sm:pb-6">
        <span className="text-gray-600 text-sm sm:text-base">Powered by</span>
        <Image
          src="/nusitelogo.svg"
          alt="nusite logo"
          className="w-40 sm:w-24 md:w-28 h-auto"
          width={120}
          height={40}
        />
        <div className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed mt-2 px-4 max-w-sm">
          We will use cookies to enable the operations of the app and measure
          usage and engagement.
        </div>
      </div>
    </div>
  );
}
