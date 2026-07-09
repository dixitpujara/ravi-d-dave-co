"use client";

import { useEffect } from "react";

/**
 * Wires up the site's client-side behaviour (the markup itself is server-rendered
 * for SEO). Runs once after mount: header shadow, mobile menu, scroll reveals and
 * the mailto contact form.
 */
export default function Interactions() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // sticky header shadow
    const hdr = document.getElementById("hdr");
    if (hdr) {
      const onScroll = () => hdr.classList.toggle("scrolled", window.scrollY > 6);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }

    // mobile menu
    const burger = document.getElementById("burger");
    const mm = document.getElementById("mobileMenu");
    if (burger && mm) {
      const toggle = () => {
        const open = mm.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(open));
      };
      burger.addEventListener("click", toggle);
      cleanups.push(() => burger.removeEventListener("click", toggle));
      const close = () => {
        mm.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      };
      const links = Array.from(mm.querySelectorAll("a"));
      links.forEach((a) => a.addEventListener("click", close));
      cleanups.push(() =>
        links.forEach((a) => a.removeEventListener("click", close))
      );
    }

    // scroll reveals (with a safety net so content can never stay hidden)
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reveals.length) {
      if (!("IntersectionObserver" in window)) {
        reveals.forEach((el) => el.classList.add("vis"));
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("vis");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        reveals.forEach((el) => io.observe(el));
        cleanups.push(() => io.disconnect());
        const failsafe = window.setTimeout(() => {
          const anyVisible = reveals.some((el) => el.classList.contains("vis"));
          if (!anyVisible) reveals.forEach((el) => el.classList.add("vis"));
        }, 900);
        cleanups.push(() => window.clearTimeout(failsafe));
      }
    }

    // contact form -> mailto
    const form = document.getElementById("enquiryForm") as HTMLFormElement | null;
    if (form) {
      const statusEl = document.getElementById("formStatus");
      const submitBtn = document.getElementById("formSubmit") as HTMLButtonElement | null;
      const btnLabel = submitBtn?.querySelector(".btn-label") as HTMLElement | null;
      const g = (id: string) =>
        ((document.getElementById(id) as HTMLInputElement | null)?.value || "").trim();

      const setStatus = (msg: string, kind: "ok" | "err" | "") => {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className = "form-status" + (kind ? " show " + kind : "");
      };

      const onSubmit = async (e: Event) => {
        e.preventDefault();
        const name = g("f-name");
        const phone = g("f-phone");
        if (!name || !phone) {
          setStatus("Please enter your name and phone number.", "err");
          return;
        }
        const payload = {
          name,
          phone,
          email: g("f-email"),
          service: g("f-service"),
          message: g("f-msg"),
          botcheck: g("f-botcheck"),
        };

        if (submitBtn) submitBtn.disabled = true;
        if (btnLabel) btnLabel.textContent = "Sending…";
        setStatus("", "");

        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const out = (await res.json().catch(() => ({}))) as {
            ok?: boolean;
            error?: string;
          };
          if (res.ok && out.ok) {
            form.reset();
            setStatus(
              "Thank you — your message has been sent. We'll be in touch shortly.",
              "ok"
            );
          } else {
            setStatus(
              out.error || "Sorry, that didn't send. Please call or WhatsApp us.",
              "err"
            );
          }
        } catch {
          setStatus(
            "Network error. Please check your connection, or call or WhatsApp us.",
            "err"
          );
        } finally {
          if (submitBtn) submitBtn.disabled = false;
          if (btnLabel) btnLabel.textContent = "Send Message";
        }
      };

      form.addEventListener("submit", onSubmit);
      cleanups.push(() => form.removeEventListener("submit", onSubmit));
    }

    // current year
    const yr = document.getElementById("yr");
    if (yr) yr.textContent = String(new Date().getFullYear());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
