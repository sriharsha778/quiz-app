"use client";

import { useEffect, useState } from "react";

/**
 * @param {{ isActive: boolean, onToggle: (state: boolean) => void }} props
 */
export default function ToggleSwitch({ isActive, onToggle }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  useEffect(() => {
    onToggle(active);
  }, [active, onToggle]);

  return (
    <div
      onClick={() => setActive(!active)}
      className={`
        flex
        w-13 h-8
        p-1
        border-2 border-white rounded-lg
        cursor-pointer transition-all
        duration-300
        ${active ? "bg-blue-600 justify-end " : "bg-black justify-start"}
      `}
    >
      <div
        className="
          h-full
          bg-gray-50
          rounded aspect-square
        "
      ></div>
    </div>
  );
}
