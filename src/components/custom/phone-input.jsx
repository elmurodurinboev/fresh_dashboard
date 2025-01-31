import React from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

const PhoneInput = React.forwardRef(({ className, ...props }, ref) => (
  <IMaskInput
    {...props}
    inputRef={ref}
    autoComplete={false}
    className={cn(
      "w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    )}
  />
));

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
