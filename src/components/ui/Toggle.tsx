"use client";

import { useState } from "react";

interface ToggleProps {
  initialChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ initialChecked = false, checked, onChange, disabled = false }: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(initialChecked);
  
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newState = !isChecked;
    if (!isControlled) {
      setInternalChecked(newState);
    }
    onChange?.(newState);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#e31837] focus:ring-offset-2 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      style={{ backgroundColor: isChecked ? "#e31837" : "#cbd5e1" }}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isChecked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
