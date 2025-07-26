import Image from "next/image";
export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-8">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-12 mt-32">
          <Image
            src="/danubahome.svg"
            alt="Danube Home Logo"
            className="w-90 h-auto mt-6 mb-5"
            width={90}
            height={50}
          />
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
        <Image
          src="/nusitelogo.svg"
          alt="nusite logo"
          className="w-60 h-auto  mb-5"
          width={60}
          height={20}
        />
      </div>
      <div className="text-xs text-gray-500 mt-4">
        We will use cookies to enable the operations of the app,
        <br />
        and measure usage and engagement.
      </div>
    </div>
  );
}
