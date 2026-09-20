import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const DEBOUNCE_MS = 300;

type DataTableSearchProps = {
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

// The value lives in the URL, but typing shouldn't navigate on every keystroke, so the input holds
// its own state until the typing stops.
export function DataTableSearch({ onChange, placeholder = "Search", value }: Readonly<DataTableSearchProps>) {
  const [typed, setTyped] = useState(value);
  const [committed, setCommitted] = useState(value);

  // The URL owns the value, so adopt it when it changes elsewhere: a back navigation, or a filter
  // that resets the search.
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
    <label className="input w-full max-w-64 rounded-xs input-sm">
      <Search className="size-4 shrink-0 text-base-content/60" />
      <input
        type="search"
        value={typed}
        placeholder={placeholder}
        className="[&::-webkit-search-cancel-button]:appearance-none"
        onChange={(event) => setTyped(event.target.value)}
      />
      {typed && (
        <button
          type="button"
          aria-label="Clear search"
          className="cursor-pointer text-base-content/60 hover:text-base-content"
          onClick={() => setTyped("")}
        >
          <X className="size-4" />
        </button>
      )}
    </label>
  );
}
