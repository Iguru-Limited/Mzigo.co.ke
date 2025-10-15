"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, useId } from "react";
import { MapPin, X } from "lucide-react";

export interface LocationSelectorProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  options: string[]; // full list of selectable values
  disabled?: boolean;
  required?: boolean;
  allowFreeInput?: boolean; // if false, enforce selection from list
  className?: string;
  /** When true, use a card/panel style (input + list combined visually) */
  panel?: boolean;
  /** Custom accent utility classes (ring/border/text). Example: 'focus-within:ring-pink-500 border-pink-400' */
  accentClasses?: string;
}

/**
 * Accessible, keyboard friendly autocomplete / typeahead input for selecting a location.
 * - Arrow Up/Down navigates filtered list
 * - Enter selects highlighted option
 * - Esc closes list
 */
export const LocationSelector: React.FC<LocationSelectorProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled,
  required,
  allowFreeInput = false,
  className = "",
  panel = false,
  accentClasses = "focus-within:ring-pink-500 border-pink-400",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Stable id using React 18 useId (avoids SSR hydration mismatches vs Math.random)
  const reactId = useId();
  const listId = useRef(`locsel-${reactId}`);

  // Keep local query in sync when parent value externally changes (e.g. swap)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = useMemo(() => {
    if (!query) return options.slice(0, 50); // cap
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q)).slice(0, 50);
  }, [query, options]);

  // Adjust highlight when filtered list shrinks
  useEffect(() => {
    if (highlight >= filtered.length) setHighlight(0);
  }, [filtered, highlight]);

  const commit = useCallback(
    (val: string) => {
      onChange(val);
      setQuery(val);
      setOpen(false);
    },
    [onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!open) setOpen(true);
    if (allowFreeInput) onChange(val); // reflect instantly
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && ["ArrowDown", "ArrowUp"].includes(e.key)) {
      setOpen(true);
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlight((h) => Math.min(filtered.length - 1, h + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
        break;
      case "Enter":
        if (open && filtered[highlight]) {
          e.preventDefault();
          commit(filtered[highlight]);
        } else if (!allowFreeInput) {
          // enforce match
          const exact = options.find((o) => o.toLowerCase() === query.toLowerCase());
          if (exact) commit(exact);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  // Click outside to close
  useEffect(() => {
    const onDoc = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(ev.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const showError = !allowFreeInput && value && !options.includes(value);

  return (
    <div
      className={`relative ${panel ? "" : ""} ${className}`}
      ref={containerRef}
    >
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700">
          {label}
        </label>
      )}
      <div
        className={`flex items-center gap-2 rounded-md border px-3 py-2 bg-white transition focus-within:ring-2 ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${showError ? "border-red-400 focus-within:ring-red-400" : accentClasses}`}
      >
        <MapPin className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-black placeholder:text-gray-400"
          value={query}
          disabled={disabled}
          required={required}
          aria-autocomplete="list"
          aria-controls={listId.current}
          aria-expanded={open}
          aria-activedescendant={
            open && filtered[highlight]
              ? `${listId.current}-opt-${highlight}`
              : undefined
          }
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // Enforce a valid selection if required
            if (!allowFreeInput) {
              const exact = options.find(
                (o) => o.toLowerCase() === query.toLowerCase()
              );
              if (!exact) {
                // revert to previous accepted value
                setQuery(value);
              } else if (exact !== value) {
                onChange(exact);
              }
            }
          }}
        />
        {query && (
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={() => {
              setQuery("");
              if (allowFreeInput) onChange("");
              setOpen(true);
            }}
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <ul
          id={listId.current}
          role="listbox"
          className={`absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg text-sm ${
            panel ? "border-pink-200" : "border-gray-200"
          }`}
        >
          {filtered.map((opt, i) => {
            const active = i === highlight;
            return (
              <li
                id={`${listId.current}-opt-${i}`}
                key={opt + i}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  // prevent input blur before click
                  e.preventDefault();
                }}
                onClick={() => commit(opt)}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-pink-50 ${
                  active ? "bg-pink-100" : ""
                }`}
              >
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="truncate" title={opt}>
                  {opt}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {showError && (
        <p className="mt-1 text-xs text-red-500">Please pick a value from the list.</p>
      )}
    </div>
  );
};

export default LocationSelector;
