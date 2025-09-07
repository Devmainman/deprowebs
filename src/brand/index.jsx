// FILE: src/brand/index.jsx
import React from "react";
import logo from "../assets/dpw.png"; // swap here later (one place) if you change the logo

export const BRAND = {
  display: "DeproWebs",          // public name
  id: "deprowebs",               // short id/slug
  legal: "DeproWebs Group",      // legal display
  domain: "deprowebs.com",
  year: new Date().getFullYear(),
  emails: {
    support: "support@deprowebs.com",
    sales:   "sales@deprowebs.com",
  },
  phones: {
    whatsapp: "+234 000 0000",
  },
};

export function BrandName({ case_: c = "display", className = "" }) {
  let text = BRAND.display;
  if (c === "lower") text = text.toLowerCase();
  if (c === "upper") text = text.toUpperCase();
  return <span className={className}>{text}</span>;
}

export function BrandLegal({ className = "" }) {
  return <span className={className}>{BRAND.legal}</span>;
}

export function BrandEmail({ type = "support", className = "" }) {
  const email = BRAND.emails[type] ?? BRAND.emails.support;
  return (
    <a className={className} href={`mailto:${email}`}>
      {email}
    </a>
  );
}

export function BrandLogo({ size = 40, className = "", alt = BRAND.display }) {
  return (
    <img
      src={logo}
      alt={alt}
      className={`block select-none ${className}`}
      style={{ height: size, width: "auto" }}
    />
  );
}
