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
      const onSubmit = (e: Event) => {
        e.preventDefault();
        const g = (id: string) =>
          ((document.getElementById(id) as HTMLInputElement | null)?.value || "").trim();
        const name = g("f-name");
        const phone = g("f-phone");
        const email = g("f-email");
        const service = g("f-service");
        const msg = g("f-msg");
        if (!name || !phone) {
          alert("Please enter your name and phone number.");
          return;
        }
        const subject = encodeURIComponent(
          "Enquiry from " + name + (service ? " — " + service : "")
        );
        const body = encodeURIComponent(
          "Name: " + name + "\n" +
            "Phone: " + phone + "\n" +
            "Email: " + (email || "-") + "\n" +
            "Service: " + (service || "-") + "\n\n" +
            "Message:\n" + (msg || "-")
        );
        window.location.href =
          "mailto:caravidave33@gmail.com?subject=" + subject + "&body=" + body;
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
