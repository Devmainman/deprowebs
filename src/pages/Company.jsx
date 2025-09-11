import React, { useEffect } from "react";
import { BrandLogo } from "../brand";

const BLUE = { 900:"#00072D",800:"#051650",700:"#0A2472",600:"#123499",500:"#1A43BF" };

function useHashScroll() {
  useEffect(() => {
    const go = () => {
      if (window.location.hash) {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);
}

export default function Company() {
  useHashScroll();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-[#000718] to-black text-white">
      {/* hero */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="flex items-center gap-3 mb-5">
            <BrandLogo size={36} />
            <h1 className="text-3xl md:text-4xl font-semibold" style={{ color: BLUE[500] }}>
              About our Company
            </h1>
          </div>
          <p className="text-white/80 max-w-3xl">
            We build technology-forward trading for Forex, Crypto, Indices, Commodities, and ETFs—engineered for
            speed, reliability, and clarity. Our mission is simple: make powerful trading accessible to everyone.
          </p>
        </div>
      </header>

      {/* who we are */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-14 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: BLUE[500] }}>Who are we</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">A product team obsessed with execution</h3>
            <p className="text-white/80">
              We ship fast, listen to traders, and iterate continuously. From sub-second chart updates to resilient
              infra, our stack is built to remove friction at every step of the trading journey.
            </p>
          </div>
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Built for all experience levels</h3>
            <p className="text-white/80">
              Whether you’re placing your first demo trade or managing multiple strategies, our tools keep the UI
              clean, the data trustworthy, and the controls predictable.
            </p>
          </div>
        </div>
      </section>

      {/* regulatory */}
      <section id="regulatory" className="max-w-6xl mx-auto px-6 py-14 md:py-16 border-t border-white/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: BLUE[500] }}>Regulatory Information</h2>
        <p className="text-white/80 mb-6">
          We follow industry best-practice for client safeguards and clear disclosures. Here’s a high-level overview.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Client Funds Handling</h3>
            <p className="text-white/80">Client funds are kept in designated accounts separate from company operating funds.</p>
          </div>
          <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Compliance & Controls</h3>
            <p className="text-white/80">Continuous monitoring, periodic reviews, and escalation paths for incidents and complaints.</p>
          </div>
          <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Fair Trading</h3>
            <p className="text-white/80">Order handling and pricing designed to be transparent, consistent, and auditable.</p>
          </div>
        </div>
        <p className="text-xs text-white/50 mt-4">
          Note: Trading involves risk. Availability of features and instruments may vary by jurisdiction.
        </p>
      </section>

      {/* payments */}
      <section id="payments" className="max-w-6xl mx-auto px-6 py-14 md:py-16 border-t border-white/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: BLUE[500] }}>Payment Methods</h2>
        <p className="text-white/80 mb-6">Fast deposits and withdrawals with clear timelines and transparent fees.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { h: "Cards & Bank Transfer", b: "Instant or near-instant deposits, standard banking hours for withdrawals." },
            { h: "E-Wallets", b: "Popular regional options with quick settlement where supported." },
            { h: "Crypto Rails", b: "On-chain deposits/withdrawals where available; network fees may apply." },
          ].map((x) => (
            <div key={x.h} className="rounded-2xl p-5 bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-2">{x.h}</h3>
              <p className="text-white/80">{x.b}</p>
            </div>
          ))}
        </div>
        <ul className="mt-6 text-white/70 text-sm list-disc ml-5">
          <li>Minimums/maximums depend on channel and region.</li>
          <li>We may require KYC verification before processing withdrawals.</li>
          <li>Processing times exclude third-party/network delays.</li>
        </ul>
      </section>

      {/* partners */}
      <section id="partners" className="max-w-6xl mx-auto px-6 py-14 md:py-16 border-t border-white/10">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: BLUE[500] }}>Partners</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Affiliates & IBs</h3>
            <p className="text-white/80">Revenue-share and CPA options, multi-level reporting, real-time tracking, and marketing assets.</p>
          </div>
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
            <h3 className="font-semibold mb-2">Technology Partners</h3>
            <p className="text-white/80">API integrations, white-label components, and data access under commercial agreements.</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl p-5 bg-white/5 border border-white/10">
          Ready to collaborate? <a href="/contact" className="underline">Contact us</a>.
        </div>
      </section>
    </main>
  );
}
