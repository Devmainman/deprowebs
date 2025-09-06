// FILE: src/pages/contact.jsx
import React, { useMemo, useState } from "react";
import { GlassCard, Badge, BLUE } from "./shared/ui.jsx";
import RealMap from "../components/RealMap.jsx";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState("");

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const emailOk = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email]);
  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Please tell us your name";
    if (!emailOk) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "What’s this about?";
    if (!form.message.trim()) e.message = "Write a short message";
    return e;
  }, [form, emailOk]);

  const disabled = submitting || Object.keys(errors).length > 0;

  const mailtoHref = useMemo(() => {
    const to = "support@deprowebs.com";
    const subj = encodeURIComponent(`[Contact] ${form.subject || ""}`);
    const body = encodeURIComponent(
      `Hi deprowebs,\n\n${form.message || ""}\n\n— ${form.name || ""}\n${form.email || ""}`
    );
    return `mailto:${to}?subject=${subj}&body=${body}`;
  }, [form]);

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1200);
    } catch {
      setCopied("error");
      setTimeout(() => setCopied(""), 1200);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (disabled) return;
    // Demo submission (plug your API here)
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ===== Left: form ===== */}
        <div className="lg:col-span-2">
          <GlassCard title="Message us" kicker={<Badge>Contact</Badge>} right="Avg. reply ≈ 1h">
            {!sent ? (
              <form className="grid sm:grid-cols-2 gap-3" onSubmit={onSubmit} noValidate>
                <Field
                  placeholder="Full name"
                  value={form.name}
                  onChange={(v) => setField("name", v)}
                  error={touched.name && errors.name}
                  onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                />
                <Field
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setField("email", v)}
                  error={touched.email && errors.email}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                />
                <Field
                  placeholder="Subject"
                  className="sm:col-span-2"
                  value={form.subject}
                  onChange={(v) => setField("subject", v)}
                  error={touched.subject && errors.subject}
                  onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
                />
                <TextArea
                  placeholder="Tell us about your project"
                  className="sm:col-span-2"
                  rows={6}
                  value={form.message}
                  onChange={(v) => setField("message", v)}
                  error={touched.message && errors.message}
                  onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                />

                <div className="sm:col-span-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={disabled}
                    className={`btn-shine px-4 py-2 rounded-xl font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed`}
                    style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}
                  >
                    {submitting ? "Sending…" : "Send"}
                  </button>

                  {/* Fallback to email client */}
                  <a
                    href={mailtoHref}
                    className="px-4 py-2 rounded-xl font-semibold text-white/90 border"
                    style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}
                    title="Open in your email client"
                  >
                    Open in Email
                  </a>

                  <span className="text-[11px] text-white/60 ml-auto">
                    Encrypted at rest • We never share your details
                  </span>
                </div>
              </form>
            ) : (
              <div className="rounded-xl border border-white/10 p-5 bg-white/[.02]">
                <div className="text-emerald-400 font-semibold mb-1">Message sent!</div>
                <div className="text-white/80 text-sm">
                  Thanks {form.name || ""}. We’ve received your note and will reply to{" "}
                  <span className="underline decoration-white/20 underline-offset-2">{form.email || "your email"}</span>{" "}
                  shortly. Your reference is <span className="font-semibold">DEPRO-{(Date.now() % 100000).toString().padStart(5, "0")}</span>.
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={mailtoHref}
                    className="px-3 py-1.5 rounded-lg border text-sm"
                    style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}
                  >
                    Add more details
                  </a>
                  <button
                    onClick={() => setSent(false)}
                    className="px-3 py-1.5 rounded-lg text-sm border"
                    style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}
                  >
                    Send another
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* ===== Right: info ===== */}
        <div>
          <GlassCard title="Office & channels" kicker={<Badge>Reach us</Badge>} right="Trusted">
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-center gap-2">
                <span className="opacity-70 w-16">Support</span>
                <a href="mailto:support@deprowebs.com" className="font-semibold">support@deprowebs.com</a>
                <ActionBtn onClick={() => copy("support@deprowebs.com", "support")} label={copied === "support" ? "Copied!" : "Copy"} />
              </li>
              <li className="flex items-center gap-2">
                <span className="opacity-70 w-16">Sales</span>
                <a href="mailto:sales@deprowebs.com" className="font-semibold">sales@deprowebs.com</a>
                <ActionBtn onClick={() => copy("sales@deprowebs.com", "sales")} label={copied === "sales" ? "Copied!" : "Copy"} />
              </li>
              <li className="flex items-center gap-2">
                <span className="opacity-70 w-16">WhatsApp</span>
                <a href="https://wa.me/2340000000" target="_blank" rel="noreferrer" className="font-semibold">+234 000 0000</a>
                <ActionBtn onClick={() => copy("+2340000000", "wa")} label={copied === "wa" ? "Copied!" : "Copy"} />
              </li>
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Stat title="Office hours (WAT)" value="Mon–Fri, 09:00–18:00" />
              <Stat title="Avg. first reply" value="≈ 1h" />
              <Stat title="Priority SLA" value="24h" />
              <Stat title="Security" value="TLS/At-Rest" />
            </div>

            <div className="mt-4 aspect-[4/3] w-full rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 relative overflow-hidden">
              {/* Minimal “map” placeholder */}
              <GridLines />
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                style={{ background: `radial-gradient(circle, rgba(26,67,191,.45), rgba(10,36,114,.15) 60%, transparent 70%)` }}
              />
             <div className="mt-4">
            <RealMap lat={6.5244} lng={3.3792} label="deprowebs — Lagos HQ" />
            </div>
            </div>

            <div className="mt-3 text-[11px] text-white/60">
              We never solicit passwords or seed phrases. If you suspect fraud, contact{" "}
              <a href="mailto:support@deprowebs.com" className="underline decoration-white/20 underline-offset-2">support@deprowebs.com</a>.
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
};

/* ===== Tiny local pieces ===== */

function Field({ placeholder, value, onChange, onBlur, error, type = "text", className = "" }) {
  return (
    <div className={className}>
      <input
        type={type}
        className={`w-full rounded-xl bg-white/5 border px-3 py-2 text-white placeholder:text-white/40 ${
          error ? "border-rose-400/50 focus:outline-none" : "border-white/10"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && <div className="mt-1 text-[11px] text-rose-300">{error}</div>}
    </div>
  );
}

function TextArea({ placeholder, value, onChange, onBlur, error, rows = 6, className = "" }) {
  return (
    <div className={className}>
      <textarea
        rows={rows}
        className={`w-full rounded-xl bg-white/5 border px-3 py-2 text-white placeholder:text-white/40 ${
          error ? "border-rose-400/50 focus:outline-none" : "border-white/10"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && <div className="mt-1 text-[11px] text-rose-300">{error}</div>}
    </div>
  );
}

function ActionBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 rounded-md border text-[11px]"
      style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}
      type="button"
    >
      {label}
    </button>
  );
}

function Stat({ title, value }) {
  return (
    <div className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
      <div className="opacity-70">{title}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function GridLines() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}
