import { useEffect, useId, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { searchLocations } from "../../services/geocode";
import { Field } from "../ui/Field";

export function LocationSearch({ label, value, onSelect, error, placeholder }) {
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const debounced = useDebouncedValue(query, 320);
  const abortRef = useRef(null);

  useEffect(() => {
    setQuery(value?.label || "");
  }, [value]);

  useEffect(() => {
    if (!debounced || debounced.length < 2 || value?.label === debounced) {
      setResults([]);
      setMessage("");
      return undefined;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setMessage("");

    searchLocations(debounced, controller.signal)
      .then((items) => {
        setResults(items);
        setOpen(true);
        if (items.length === 0) setMessage("No matching locations found.");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setMessage(error.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debounced, value?.label]);

  function handleSelect(item) {
    onSelect(item);
    setQuery(item.label);
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Field label={label} htmlFor={inputId} error={error}>
        <div className="relative">
          <Search
            aria-hidden="true"
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/45"
          />
          <input
            id={inputId}
            className="input pl-10"
            value={query}
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={open}
            onFocus={() => setOpen(results.length > 0)}
            onChange={(event) => {
              setQuery(event.target.value);
              onSelect(null);
            }}
          />
        </div>
      </Field>

      {open && (results.length > 0 || loading || message) ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-[1200] mt-2 max-h-64 overflow-y-auto rounded-md border border-ink/10 bg-white p-1 shadow-panel"
        >
          {loading ? <div className="px-3 py-2 text-sm text-ink/65">Searching...</div> : null}
          {!loading && message ? (
            <div className="px-3 py-2 text-sm text-ink/65">{message}</div>
          ) : null}
          {results.map((item) => (
            <button
              type="button"
              role="option"
              key={`${item.id}-${item.lat}-${item.lng}`}
              className="flex w-full items-start gap-2 rounded px-3 py-2 text-left text-sm text-ink transition hover:bg-skywash focus:bg-skywash focus:outline-none"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(item)}
            >
              <MapPin size={18} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />
              <span className="leading-snug">{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
