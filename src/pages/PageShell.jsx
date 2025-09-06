// FILE: src/pages/PageShell.jsx
import React from "react";
import BackgroundFX from "../components/BackgroundFX";
import GridOverlay from "../components/GridOverlay";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };

export default function PageShell({ title, breadcrumb = [], theme = "dark", children }) {
  const light = theme === "light";
  return (
    <main className={`pt-20 ${light ? "bg-white" : "bg-black"}`}>
      <section className="relative overflow-hidden">
        <BackgroundFX variant={light ? "diagonal-sweep" : "radial-aurora"} theme={light ? "light" : "dark"} intensity={0.22} speed={48} />
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* breadcrumb */}
          {breadcrumb?.length > 0 && (
            <div className={`text-xs uppercase tracking-wider mb-2 ${light ? "text-black/60" : "text-white/60"}`}>
              {breadcrumb.join(" • ")}
            </div>
          )}
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${light ? "text-[#051650]" : "text-white"}`}>
            {title}
          </h1>
        </div>
        <GridOverlay variant={light ? "dark" : "light"} layer="above" density={32} speed={22} opacity={light ? 0.12 : 0.18} />
      </section>

      <section className="relative overflow-hidden">
  {/* Body background should not capture clicks */}
  {!light && (
    <div className="absolute inset-0 pointer-events-none">
      <BackgroundFX variant="grid-pulse" intensity={0.2} speed={34} />
    </div>
  )}
  <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    {children}
  </div>
</section>

    </main>
  );
}

