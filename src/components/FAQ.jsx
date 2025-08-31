// src/components/FAQ.jsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const QA = [
  { q: "What can I trade?", a: "Forex, stocks, crypto, indices, commodities, and exclusive derived indices." },
  { q: "Is there 24/7 support?", a: "Yes — live chat & email, with fast response times." },
  { q: "Minimum to start?", a: "You can start with a small deposit and scale at your pace." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-6">
        <h3 className="h-display text-3xl font-bold mb-8" style={{ color: "#00072D" }}>FAQs</h3>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
          {QA.map((item, i) => (
            <button
              key={item.q}
              onClick={()=> setOpen(open === i ? null : i)}
              className="w-full text-left px-5 py-4 bg-white hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{item.q}</div>
                <ChevronDown className={`transition-transform ${open === i ? "rotate-180" : ""}`} size={18} />
              </div>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-600 pt-2 pb-1">{item.a}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
