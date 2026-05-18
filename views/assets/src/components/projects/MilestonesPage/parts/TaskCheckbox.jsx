import React, { useState } from "react";
import { Check } from "lucide-react";

export default function TaskCheckbox({ complete, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="shrink-0 focus:outline-none"
    >
      {complete ? (
        <span className="flex items-center justify-center h-[18px] w-[18px] rounded-full bg-pm-accent text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      ) : hovered ? (
        <span className="flex items-center justify-center h-[18px] w-[18px] rounded-full border-2 border-pm-accent text-pm-accent">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      ) : (
        <span className="h-[18px] w-[18px] rounded-full border-[1.5px] border-dashed border-pm-text-muted/40 block" />
      )}
    </button>
  );
}
