import {forwardRef} from 'react';
import CurrencyInput from "react-currency-input-field";
import {cn} from "@/lib/utils";

const InputWithFormat = forwardRef(({className, ...props}, ref) => {
  return (
    <CurrencyInput
      ref={ref}
      disableAbbreviations
      groupSeparator={" "}
      allowNegativeValue={false}
      allowDecimals={false}
      decimalSeparator={"."}
      className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)}
      {...props}
    />
  )
});
InputWithFormat.displayName = 'InputWithFormat'
export default InputWithFormat;
