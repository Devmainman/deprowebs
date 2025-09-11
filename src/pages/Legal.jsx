import React, { useEffect } from "react";

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

function Card({ title, children, id }) {
  return (
    <section id={id} className="rounded-2xl p-6 bg-white/5 border border-white/10">
      <h3 className="text-xl font-semibold mb-2" style={{ color: BLUE[500] }}>{title}</h3>
      <div className="text-white/80">{children}</div>
    </section>
  );
}

export default function Legal() {
  useHashScroll();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-[#000718] to-black text-white">
      {/* hero */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3" style={{ color: BLUE[500] }}>
            Legal & Policies
          </h1>
          <p className="text-white/80 max-w-3xl">
            Clear terms, responsible trading guidance, and privacy protections. These summaries aid understanding and do not replace the full agreements.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-14 md:py-16 grid gap-6">
        {/* privacy */}
        <Card id="privacy" title="Privacy Policy">
          <p>
            We collect only what’s necessary to provide and improve our services—such as account details, activity logs,
            device data, and compliance information. We do not sell personal data.
          </p>
          <ul className="list-disc ml-5 mt-3 text-sm text-white/70 space-y-1">
            <li><span className="text-white/80">Collection:</span> account setup (KYC), platform usage, payments, support.</li>
            <li><span className="text-white/80">Use:</span> provide services, fraud prevention, security, analytics, and legal obligations.</li>
            <li><span className="text-white/80">Sharing:</span> limited to processors (payments, KYC), required regulators, and where you consent.</li>
            <li><span className="text-white/80">Your rights:</span> access, correction, deletion (subject to retention duties), and opt-outs where applicable.</li>
            <li><span className="text-white/80">Security:</span> encryption in transit, strict access controls, and ongoing monitoring.</li>
          </ul>
        </Card>

        {/* terms */}
        <Card id="terms" title="Terms & Conditions">
          <p>
            By using our websites, apps, and platforms, you agree to trade responsibly, keep credentials secure,
            and comply with all applicable laws. Features may vary by region.
          </p>
          <ul className="list-disc ml-5 mt-3 text-sm text-white/70 space-y-1">
            <li><span className="text-white/80">Eligibility:</span> services aren’t offered where prohibited by law.</li>
            <li><span className="text-white/80">Accounts:</span> one account per user; accurate information; secure your login.</li>
            <li><span className="text-white/80">Platform use:</span> no market abuse, data scraping, or unauthorized automation.</li>
            <li><span className="text-white/80">Pricing & execution:</span> subject to market conditions, liquidity, and latency.</li>
            <li><span className="text-white/80">Suspension/closure:</span> misuse, fraud, or legal reasons may lead to action.</li>
            <li><span className="text-white/80">Changes:</span> we may update terms; continued use implies acceptance of updates.</li>
          </ul>
        </Card>

        {/* risk */}
        <Card id="risk" title="Risk Disclosure">
          <p>
            Trading leveraged products involves a high level of risk and may not be suitable for all investors.
            Do not trade with money you cannot afford to lose.
          </p>
          <ul className="list-disc ml-5 mt-3 text-sm text-white/70 space-y-1">
            <li><span className="text-white/80">Leverage:</span> magnifies both gains and losses.</li>
            <li><span className="text-white/80">Market risk:</span> volatility, gaps, and slippage can impact outcomes.</li>
            <li><span className="text-white/80">Operational risk:</span> connectivity, third-party failures, and maintenance windows.</li>
            <li><span className="text-white/80">Product risk:</span> CFDs, options, and multipliers carry distinct characteristics—know them before you trade.</li>
            <li><span className="text-white/80">Responsibility:</span> you are responsible for understanding and managing your risk exposure.</li>
          </ul>
        </Card>

        {/* optional extra sections to mirror a fuller legal hub */}
        <Card id="funds" title="Funds & Transfers">
          <p>
            Deposits/withdrawals are processed via supported channels. We may request verification for security
            and compliance. Processing times vary by method and region.
          </p>
          <ul className="list-disc ml-5 mt-3 text-sm text-white/70 space-y-1">
            <li>Use accounts in your own name only; third-party transfers are restricted.</li>
            <li>Chargebacks and recalls may lead to account review and delays.</li>
            <li>We maintain detailed ledger records for transparency and auditability.</li>
          </ul>
        </Card>

        <Card id="responsible" title="Secure & Responsible Trading">
          <p>
            We promote responsible access to markets: risk warnings, clear disclosures, and tools like stop-loss,
            take-profit, and session timeouts to help you stay in control.
          </p>
          <ul className="list-disc ml-5 mt-3 text-sm text-white/70 space-y-1">
            <li>Educational content and product-specific explainers.</li>
            <li>Account controls: two-factor auth, device management, and alerts.</li>
            <li>Report suspicious activity to support immediately.</li>
          </ul>
        </Card>

        <p className="text-xs text-white/50">
          These summaries are provided for convenience. Where applicable, the full legally binding versions of each policy or agreement prevail.
        </p>
      </div>
    </main>
  );
}
