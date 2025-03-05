import Select from "react-select";

const SelectComponent = ({options, onChange, value, defaultValue = "", placeholder = "Tanlang", hasError = false}) => {
  // Transform backend data to match react-select format
  const transformedOptions = options.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  // Handle value change
  const handleChange = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : "");
  };

  return (
    <Select
      options={transformedOptions}
      defaultValue={defaultValue}
      placeholder={placeholder}
      classNames={{
        control: (state) =>
          state.isFocused
            ? "border border-primary ring-2 ring-primary/50 shadow-sm"
            : hasError
              ? "border border-destructive"
              : "border border-border",
        option: (state) =>
          state.isSelected
            ? "bg-primary text-primary-foreground"
            : "bg-background text-foreground hover:bg-secondary",
        menu: () => "bg-card border border-border rounded-md shadow-lg",
        singleValue: () => "text-foreground",
        placeholder: () => "text-muted-foreground",
      }}
      // noOptionsMessage={"Ma'lumot topilmadi"}
      value={transformedOptions.find((opt) => opt.value === value)}
      onChange={option => handleChange(option)}
    />
  );
};

export default SelectComponent;
