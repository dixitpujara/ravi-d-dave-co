import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCATION,
  PHONE,
  EMAIL,
  SERVICES,
} from "./config";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const TITLE = `${SITE_NAME} — Chartered Accountants in ${SITE_LOCATION}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Chartered Accountant Surendranagar",
    "CA firm Surendranagar",
    "CA in Gujarat",
    "Income Tax Return filing",
    "ITR filing Surendranagar",
    "GST registration",
    "GST compliance",
    "tax planning",
    "accounting and bookkeeping",
    "audit and assurance",
    "company registration",
    "LLP registration",
    "ROC compliance",
    "TDS return filing",
    "payroll services",
    "financial consulting",
    "Ravi D Dave & Co",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "finance",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description:
      "ITR filing, GST, audit, ROC, TDS & payroll — accurate, transparent and timely. A trusted CA firm in Surendranagar, Gujarat.",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Chartered Accountants, ${SITE_LOCATION}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Chartered Accountants`,
    description:
      "ITR filing, GST, audit, ROC, TDS & payroll — accurate, transparent and timely.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/emblem.png", sizes: "128x128", type: "image/png" },
    ],
    apple: [{ url: "/emblem.png" }],
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#16294a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["AccountingService", "LocalBusiness"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "Ravi D Dave & Co., Chartered Accountants",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.png`,
  telephone: PHONE,
  email: EMAIL,
  foundingDate: "2020",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Ami Complex, Milan Cinema Road, nr. Dr Zala's Eye Hospital, Ambedkarnagar",
    addressLocality: "Surendranagar",
    addressRegion: "Gujarat",
    postalCode: "363002",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "City", name: "Surendranagar" },
    { "@type": "State", name: "Gujarat" },
    { "@type": "Country", name: "India" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:30",
      closes: "19:00",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: PHONE,
    email: EMAIL,
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["en", "gu", "hi"],
  },
  founder: {
    "@type": "Person",
    name: "CA Ravi D. Dave",
    jobTitle: "Chartered Accountant",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Chartered Accountancy Services",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
