// src/App.jsx
import { useEffect } from "react";
import Hybridhome from "./components/HybridHome";
import Sidebar, { SidebarProvider } from "./components/Sidebar";

function App() {
  useEffect(() => {
    // ---- GetButton.io (left side) ----
    const gbScript = document.createElement("script");
    gbScript.type = "text/javascript";
    gbScript.async = true;
    gbScript.src = "https://static.getbutton.io/widget-send-button/js/init.js";
    gbScript.onload = function () {
      // Guard: if global isn't ready, skip
      if (typeof window.WhWidgetSendButton === "undefined") return;
      window.WhWidgetSendButton.init("getbutton.io", document.location.protocol, {
        whatsapp: "+12894818063",
        call_to_action: "Message us",
        position: "left", // stays left to avoid the right-side FAB/Jivo
      });
    };
    document.body.appendChild(gbScript);

    // ---- JivoSite (usually bottom-right) ----
    const jivoScript = document.createElement("script");
    jivoScript.src = "https://code.jivosite.com/widget/pMHPJnoF3l";
    jivoScript.async = true;
    document.body.appendChild(jivoScript);

    // ---- Smart FAB bump to avoid overlap (runs periodically after widgets inject DOM) ----
    const bump = () => {
      const fab = document.querySelector(".whatsapp-fab");
      if (!fab) return;
      const hasGetButton = !!document.querySelector(".wh-widget-send-button");
      const hasJivo =
        !!document.querySelector("#jivo-iframe-container, #jcont, iframe[src*='jivosite']");
      // Base position
      let bottom = 16;
      if (hasGetButton || hasJivo) {
        // Lift FAB when any chat widget is present
        bottom = window.innerWidth >= 1024 ? 112 : 84;
      }
      fab.style.bottom = `${bottom}px`;
      fab.style.right = "16px";
    };

    const id = setInterval(bump, 900); // widgets mount asynchronously
    window.addEventListener("resize", bump);
    bump();

    return () => {
      clearInterval(id);
      window.removeEventListener("resize", bump);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <Hybridhome />
        <Sidebar />

        {/* Custom WhatsApp FAB (right side) */}
        <a
          href="https://wa.me/2349068024368?text=Hi%20Deprowebs%20Team%2C%20I'm%20contacting%20you%20from%20your%20website.%20I'm%20interested%20in%20your%20services.%20My%20name%20is%20___________."
          className="whatsapp-fab"
          aria-label="Chat with Deprowebs Team on WhatsApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path
              d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
              fill="#fff"
            />
          </svg>
        </a>
      </SidebarProvider>

      {/* FAB base styles + gentle pulse. Position is auto-bumped by JS above. */}
      <style>{`
        .whatsapp-fab {
          position: fixed;
          right: 16px;
          bottom: 16px; /* will be overridden dynamically when widgets present */
          width: 64px;
          height: 64px;
          background: #25D366;
          border-radius: 50%;
          display: grid;
          place-items: center;
          box-shadow: 0 10px 22px rgba(0,0,0,.25);
          z-index: 9999;
          text-decoration: none;
          transition: transform .15s ease, box-shadow .15s ease, bottom .2s ease;
        }
        .whatsapp-fab:hover,
        .whatsapp-fab:focus-visible {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(0,0,0,.28);
          outline: none;
        }
        .whatsapp-fab svg { width: 32px; height: 32px; display: block; }

        @media (prefers-reduced-motion: no-preference) {
          .whatsapp-fab { animation: wa-pulse 2.4s ease-in-out infinite; }
          @keyframes wa-pulse {
            0%, 100% { box-shadow: 0 10px 22px rgba(0,0,0,.25); }
            50%      { box-shadow: 0 12px 26px rgba(0,0,0,.30); }
          }
        }
      `}</style>
    </div>
  );
}

export default App;
