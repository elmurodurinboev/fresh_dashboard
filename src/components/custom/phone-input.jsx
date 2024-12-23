import React from "react";
import { IMaskInput } from "react-imask";

const PhoneInput = React.forwardRef((props, ref) => (
  <IMaskInput {...props} inputRef={ref} />
));

PhoneInput.displayName = "PhoneInput";

export default PhoneInput
