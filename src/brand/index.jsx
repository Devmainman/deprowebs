import React from "react";
import logo from "../assets/dpw.png";        // logo stays separate
import brandData from "./brand.json";       // ✅ import JSON

// Clone JSON and enrich it with dynamic fields
export const BRAND = {
  ...brandData,
  year: new Date().getFullYear(),
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
