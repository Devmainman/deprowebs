// src/GridOverlay.jsx
import React from "react";

export default function GridOverlay({
  variant = "light",   // "light" | "dark" | "hero"
  layer   = "above",   // "above" | "under"
  density = 32,        // grid cell size (px)
  speed   = 22,        // animation seconds
  opacity = 0.2,       // overall opacity
}) {
  const z = layer === "under" ? "z-10" : "z-20";

  // two-line grid
  const makeGrid = (c1, c2 = "transparent") => ({
    backgroundImage: `
      linear-gradient(${c1} 1px, ${c2} 1px),
      linear-gradient(90deg, ${c1} 1px, ${c2} 1px)
    `,
    backgroundSize: `${density}px ${density}px, ${density}px ${density}px`,
  });

  let style = {};
  if (variant === "light") {
    style = makeGrid("rgba(255,255,255,.22)");
  } else if (variant === "dark") {
    style = makeGrid("rgba(0,0,0,.22)");
  } else {
    // hero: white lines with a faint blue secondary grid
    style = {
      ...makeGrid("rgba(255,255,255,.20)"),
      backgroundImage: `
        linear-gradient(rgba(255,255,255,.20) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.20) 1px, transparent 1px),
        linear-gradient(rgba(26,67,191,.10) 1px, transparent 1px),
        linear-gradient(90deg, rgba(26,67,191,.10) 1px, transparent 1px)
      `,
      backgroundSize: `
        ${density}px ${density}px, ${density}px ${density}px,
        ${density * 4}px ${density * 4}px, ${density * 4}px ${density * 4}px
      `,
    };
  }

  // animation via CSS variables
  const animStyle = {
    ...style,
    opacity,
    pointerEvents: "none",
    animation: `grid-pan ${speed}s linear infinite`,
    willChange: "background-position",
  };

  return <div className={`absolute inset-0 ${z}`} style={animStyle} />;
}
