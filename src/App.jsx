import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hybridhome from "./components/HybridHome";

import Sidebar, { SidebarProvider } from "./components/Sidebar";
import TopNav from "./components/TopNav";
import PageShell from "./pages/PageShell";
import {
  MarketsForex,
  MarketsStocks,
  MarketsIndices,
  MarketsCommodities,
  MarketsCrypto,
  MarketsETFs,
  TradingCFDs,
  TradingOptions,
  TradingMultipliers,
  ToolsSignals,
  ToolsCalculator,
  PlatformsMT5,
  PlatformsBot,
  Contact,
} from "./pages";
import Company from "./pages/Company";
import Legal from "./pages/Legal";

import { BRAND } from "./brand/index.jsx";
import Hybridfooter from "./components/Hybridfooter";

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="min-h-screen bg-black">
          <TopNav brand={BRAND.display} />
          <Routes>
            <Route path="/" element={<Hybridhome />} />
            

            {/* Markets */}
            <Route
              path="/markets/forex"
              element={
                <PageShell title="Forex" breadcrumb={["Markets", "Forex"]} theme="dark">
                  <MarketsForex />
                </PageShell>
              }
            />
            <Route
              path="/markets/stocks"
              element={
                <PageShell title="Stocks" breadcrumb={["Markets", "Stocks"]} theme="dark">
                  <MarketsStocks />
                </PageShell>
              }
            />
            <Route
              path="/markets/indices"
              element={
                <PageShell title="Indices" breadcrumb={["Markets", "Indices"]} theme="dark">
                  <MarketsIndices />
                </PageShell>
              }
            />
            <Route
              path="/markets/commodities"
              element={
                <PageShell title="Commodities" breadcrumb={["Markets", "Commodities"]} theme="dark">
                  <MarketsCommodities />
                </PageShell>
              }
            />
            <Route
              path="/markets/crypto"
              element={
                <PageShell title="Cryptocurrencies" breadcrumb={["Markets", "Crypto"]} theme="dark">
                  <MarketsCrypto />
                </PageShell>
              }
            />
            <Route
              path="/markets/etfs"
              element={
                <PageShell title="ETFs" breadcrumb={["Markets", "ETFs"]} theme="dark">
                  <MarketsETFs />
                </PageShell>
              }
            />

            {/* Trading */}
            <Route
              path="/trading/cfds"
              element={
                <PageShell title="CFDs" breadcrumb={["Trading", "CFDs"]} theme="dark">
                  <TradingCFDs />
                </PageShell>
              }
            />
            <Route
              path="/trading/options"
              element={
                <PageShell title="Options" breadcrumb={["Trading", "Options"]} theme="dark">
                  <TradingOptions />
                </PageShell>
              }
            />
            <Route
              path="/trading/multipliers"
              element={
                <PageShell title="Multipliers" breadcrumb={["Trading", "Multipliers"]} theme="dark">
                  <TradingMultipliers />
                </PageShell>
              }
            />

            {/* Tools */}
            <Route
              path="/tools/signals"
              element={
                <PageShell title="Trading Signals" breadcrumb={["Tools", "Signals"]} theme="dark">
                  <ToolsSignals />
                </PageShell>
              }
            />
            <Route
              path="/tools/calculator"
              element={
                <PageShell title="Trading Calculator" breadcrumb={["Tools", "Calculator"]} theme="dark">
                  <ToolsCalculator />
                </PageShell>
              }
            />

            {/* Platforms */}
            <Route
              path="/platforms/mt5"
              element={
                <PageShell title="MT5" breadcrumb={["Platforms", "MT5"]} theme="dark">
                  <PlatformsMT5 />
                </PageShell>
              }
            />
            <Route
              path="/platforms/bot"
              element={
                <PageShell title="Bot Trader" breadcrumb={["Platforms", "Bot Trader"]} theme="dark">
                  <PlatformsBot />
                </PageShell>
              }
            />

            {/* Contact */}
            <Route
              path="/contact"
              element={
                <PageShell title="Contact Us" breadcrumb={["Contact"]} theme="dark">
                  <Contact />
                </PageShell>
              }
            />
            <Route
  path="/company"
  element={
    <PageShell title="Company" breadcrumb={["Company"]} theme="dark">
      <Company />
    </PageShell>
  }
/>

<Route
  path="/legal"
  element={
    <PageShell title="Legal" breadcrumb={["Legal"]} theme="dark">
      <Legal />
    </PageShell>
  }
/>
          </Routes>
           <Hybridfooter /> 
           <Sidebar /> 
        </div>
       
      </SidebarProvider>
    </BrowserRouter>
  );
}

