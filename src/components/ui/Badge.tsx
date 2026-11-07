"use client";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-sky-100 text-sky-800",
        secondary: "bg-orange-100 text-orange-800",
        success: "bg-green-100 text-green-800",
        destructive: "bg-red-100 text-red-800",
        warning: "bg-yellow-100 text-yellow-800",
        outline: "border border-gray-200 text-gray-700",
        new: "bg-sky-500 text-white",
        sale: "bg-orange-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
