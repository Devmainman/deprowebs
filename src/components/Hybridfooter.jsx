// src/components/Hybridfooter.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Facebook, Instagram, Youtube, Linkedin, ArrowUp, Mail, Shield, Globe
} from "lucide-react";
import logo from "../assets/dpw.png";

const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };
const fadeUp = { hidden:{opacity:0,y:18}, show:{opacity:1,y:0,transition:{duration:.5,ease:"easeOut"}} };

export default function Hybridfooter() {
  const cols = [
    {
      title: "Markets",
      links: [
        { label: "Forex", href: "#markets-forex" },
        { label: "Stocks", href: "#markets-stocks" },
        { label: "Indices", href: "#markets-indices" },
        { label: "Commodities", href: "#markets-commodities" },
        { label: "Cryptocurrencies", href: "#markets-crypto" },
        { label: "ETFs", href: "#markets-etfs" },
      ],
    },
    {
      title: "Trading",
      links: [
        { label: "CFDs", href: "#trading-cfds" },
        { label: "Options", href: "#trading-options" },
        { label: "Multipliers", href: "#trading-multipliers" },
      ],
    },
    {
      title: "Tools",
      links: [
        { label: "Trading Signals", href: "#tools-signals" },
        { label: "Trading Calculator", href: "#tools-calculator" },
      ],
    },
    {
      title: "Platforms",
      links: [
        { label: "MT5", href: "#platforms-mt5" },
        { label: "Bot Trader", href: "#platforms-bot" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Who are we", href: "#about" },
        { label: "Regulatory Information", href: "#regulatory" },
        { label: "Payment Methods", href: "#payments" },
        { label: "Partners", href: "#partners" },
        { label: "Contact Us", href: "#contact" },
      ],
    },
    {
      title: "Other Pages",
      links: [
        { label: "Privacy and Policy", href: "#privacy" },
        { label: "Terms and Condition", href: "#terms" },
        { label: "Risk and Disclosure", href: "#risk" },
      ],
    },
  ];

  return (
    <footer className="relative text-white overflow-hidden" role="contentinfo">
      {/* Top wave divider (unchanged) */}
      <svg className="absolute -top-[1px] left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path d="M0,64 L48,58.7 C96,53,192,43,288,42.7 C384,43,480,53,576,58.7 C672,64,768,64,864,53.3 C960,43,1056,21,1152,21.3 C1248,21,1344,43,1392,53.3 L1440,64 L1440,0 L0,0 Z"
              fill="#000" opacity="0.9" />
      </svg>

      {/* Background (unchanged) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#000718] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(26,67,191,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(18,52,153,0.18),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        {/* Brand + newsletter + 6 link columns
            - Mobile: 2 columns per row
            - Large: 8 columns total (brand spans 2, each link group spans 1) */}
        <div className="grid grid-cols-2 lg:grid-cols-8 gap-8 md:gap-12">
          {/* Brand / newsletter (span 2) */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            className="col-span-2"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <a className="flex items-center gap-2" aria-label="deproweb">
                <img src={logo} alt="deproweb" className="block h-10 w-auto select-none" />
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="text-white/80 leading-relaxed mb-6">
              Technology-forward trading for everyone — anywhere, anytime. Built for speed, reliability, and clarity.
            </motion.p>

            <motion.form
              variants={fadeUp}
              onSubmit={(e)=>e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch gap-3"
              aria-label="Subscribe for market insights"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="flex-1 relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Email for market insights"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </div>
              <button
                className="px-5 py-3 rounded-xl font-semibold btn-shine focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}
                type="submit"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </motion.form>

            <motion.div variants={fadeUp} className="flex items-center gap-3 mt-5 text-white/60 text-sm">
              <Shield size={16} aria-hidden /> We respect your privacy.
            </motion.div>
          </motion.div>

          {/* Six link groups */}
          {cols.map((col) => (
            <motion.div
              key={col.title}
              initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
              className="col-span-1"
            >
              <motion.h4 variants={fadeUp} className="h-display text-xl mb-4" style={{ color: BLUE[500] }}>
                {col.title}
              </motion.h4>
              <ul className="grid grid-cols-1 gap-2">
                {col.links.map((l) => (
                  <motion.li key={l.label} variants={fadeUp}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center gap-2 text-white/75 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded"
                    >
                      <span className="h-[6px] w-[6px] rounded-full bg-white/30 group-hover:bg-white transition-transform" />
                      <span>{l.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social + locale */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3 text-white/70">
            <Globe size={16} aria-hidden />
            Global • 24/7 Support
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[{I:Facebook,n:"Facebook"},{I:Instagram,n:"Instagram"},{I:Youtube,n:"YouTube"},{I:Linkedin,n:"LinkedIn"}].map(({I,n}, i) => (
              <a
                key={i}
                href="#"
                aria-label={n}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition
                           hover:border-blue-400/50 hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              >
                <I size={18} className="text-white/70" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <p>© {new Date().getFullYear()} deprowebsGroup. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#privacy" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded">Privacy</a>
            <a href="#terms" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded">Terms</a>
            <a href="#risk" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded">Risk</a>
            <a href="#sitemap" className="hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded">Sitemap</a>
          </div>
          <a href="#top" className="inline-flex items-center gap-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30 rounded">
            <ArrowUp size={16} aria-hidden /> Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
