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

  return (
    <FurnitureViewer
      modelUrl="/sample-furniture.glb"
      productName="Modern Sofa Set"
    />
  );
}
