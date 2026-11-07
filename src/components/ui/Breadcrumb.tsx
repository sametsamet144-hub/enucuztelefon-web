import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Breadcrumb } from "@/types";

interface BreadcrumbProps {
  items: Breadcrumb[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center", className)}
    >
      <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-sky-500 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Ana Sayfa</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-sky-500 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  index === items.length - 1
                    ? "text-gray-900 font-medium"
                    : "hover:text-sky-500 transition-colors"
                )}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
