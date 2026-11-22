import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/lib/ui/input-group";

const DEBOUNCE_MS = 300;

type SearchProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

// The value lives in the URL, but typing shouldn't navigate on every keystroke,
// so the input holds its own state until the typing stops.
export function DataTableSearch({ onChange, placeholder = "Search", value }: Readonly<SearchProps>) {
  const [typed, setTyped] = useState(value);
  const [committed, setCommitted] = useState(value);

  // The URL owns the value, so adopt it when it changes elsewhere: a back
  // navigation, or a filter that resets the search.
  if (value !== committed) {
    setCommitted(value);
    setTyped(value);
  }

  useEffect(() => {
    if (typed === value) return;

    const timer = setTimeout(() => onChange(typed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [onChange, typed, value]);

  return (
    <InputGroup className="max-w-64">
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        className="[&::-webkit-search-cancel-button]:appearance-none"
        onChange={(event) => setTyped(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={typed}
      />
      {typed && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Clear search"
            onClick={() => setTyped("")}
            size="icon-xs"
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
