import React, {useEffect, useRef} from 'react';
import {IconSearch} from "@tabler/icons-react";
import {Input} from "@/components/ui/input.jsx";
import {cn} from "@/lib/utils.js";

const SearchBar = React.forwardRef(({ className, placeholder, onSearch, ...props }, ref) => {
  const timeoutID = useRef();

  const handleSearch = (value) => {
    clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(() => {
      onSearch(value);
    }, 200);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      ref.current && ref.current.focus();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className={cn("relative h-10 p-0 m-0 flex items-center bg-secondary rounded-2xl", className)}
      onClick={() => ref.current.focus()}
    >
      <button className={"absolute left-3"}>
        <IconSearch className={"icon"} />
      </button>
      <Input
        ref={ref}
        type={"search"}
        className={cn("border-0 pl-10 h-10 shadow-none bg-secondary w-full")}
        placeholder={placeholder}
        onChange={() => handleSearch(ref.current.value)}
        {...props}
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
