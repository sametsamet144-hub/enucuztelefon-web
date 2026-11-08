"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";

interface PhoneImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackIconClassName?: string;
}

export default function PhoneImage({
  src,
  alt,
  className = "w-full h-full object-contain drop-shadow-md",
  fallbackIconClassName = "w-10 h-10 text-zinc-500",
}: PhoneImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#1c1b1d]/80 rounded-xl border border-white/5">
        <Smartphone className={fallbackIconClassName} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${className} transition-transform duration-300`}
    />
  );
}
