import Link from "next/link";

interface SiteLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function SiteLogo({
  className = "",
  size = "md",
  href = "/",
}: SiteLogoProps) {
  const iconSize =
    size === "sm"
      ? "w-7 h-7 rounded-lg"
      : size === "lg"
      ? "w-10 h-10 rounded-2xl"
      : "w-9 h-9 rounded-xl";

  const svgSize =
    size === "sm"
      ? "w-4 h-4"
      : size === "lg"
      ? "w-5 h-5"
      : "w-4.5 h-4.5";

  const textSize =
    size === "sm"
      ? "text-sm"
      : size === "lg"
      ? "text-xl"
      : "text-[17px]";

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Cupertino Gradient Icon Box */}
      <div
        className={`${iconSize} bg-gradient-to-tr from-[#2997ff] via-[#00a6ff] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-[#2997ff]/25 group-hover:scale-105 group-hover:shadow-[#2997ff]/40 transition-all duration-300 shrink-0`}
      >
        <svg
          className={`${svgSize} text-white`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5.5" y="2.5" width="13" height="19" rx="2.5" />
          <circle cx="12" cy="6" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </div>

      {/* Brand Typography */}
      <span
        className={`font-extrabold text-white ${textSize} tracking-tight select-none leading-none`}
      >
        EnUcuz<span className="text-[#2997ff]">Telefon</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
