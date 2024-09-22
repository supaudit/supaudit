/** @jsxImportSource react */
import * as React from "react";

import { cn } from "~/lib/utils";

import { qwikify$ } from "@builder.io/qwik-react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  class?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ class: className, type }) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      />
    );
  },
);
Input.displayName = "Input";

const QInput = qwikify$(Input);

export { QInput };
