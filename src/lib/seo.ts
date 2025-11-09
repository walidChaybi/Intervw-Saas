import type { Metadata } from "next";

// SEO Keywords - Short and Long-tail
export const SEO_KEYWORDS = {
  short: [
    "AI interview practice",
    "Mock interview AI",
    "Interview preparation",
    "AI interview coach",
    "Video interview practice",
    "Interview simulator",
    "AI job interview",
    "Interview prep tool",
  ],
  longTail: [
    "AI-powered interview practice platform",
    "Practice job interviews with AI video calls",
    "AI interview coach for job preparation",
    "Mock interview simulator with AI",
    "Video interview practice with artificial intelligence",
    "AI interview preparation software",
    "Practice interviews online with AI",
    "AI interview training platform",
    "Virtual interview practice with AI coach",
    "AI interview simulator for job seekers",
    "Interview practice app with AI feedback",
    "AI-powered mock interview tool",
  ],
};

// Base SEO Metadata
export const BASE_SEO: Metadata = {
  title: {
    default: "intervw - AI-Powered Interview Practice Platform | Mock Interviews with AI",
    template: "%s | intervw - AI Interview Practice",
  },
  description:
    "Practice job interviews with AI-powered video calls. Get instant feedback and improve your interview skills with our AI interview coach. Perfect your answers with realistic mock interviews.",
  keywords: [...SEO_KEYWORDS.short, ...SEO_KEYWORDS.longTail].join(", "),
  authors: [{ name: "intervw" }],
  creator: "intervw",
  publisher: "intervw",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://intervw.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "intervw",
    title: "intervw - AI-Powered Interview Practice Platform",
    description:
      "Practice job interviews with AI-powered video calls. Get instant feedback and improve your interview skills with our AI interview coach.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "intervw - AI Interview Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "intervw - AI-Powered Interview Practice Platform",
    description:
      "Practice job interviews with AI-powered video calls. Get instant feedback and improve your interview skills.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Page-specific SEO metadata
export const PAGE_SEO = {
  home: {
    title: "AI Interview Practice Platform - Practice Job Interviews with AI",
    description:
      "Master your job interviews with intervw's AI-powered interview practice platform. Practice with realistic AI interviewers, get instant feedback, and boost your confidence. Start your free trial today.",
  },
  signIn: {
    title: "Sign In - AI Interview Practice Platform",
    description:
      "Sign in to your intervw account and start practicing job interviews with AI. Access your interview history, AI feedback, and personalized coaching.",
  },
  signUp: {
    title: "Sign Up - Start Practicing Interviews with AI",
    description:
      "Create your free intervw account and start practicing job interviews with AI-powered video calls. Get instant feedback and improve your interview skills today.",
  },
  dashboard: {
    title: "Dashboard - Your Interview Practice Hub",
    description:
      "Access your interview practice dashboard. View your interview history, track your progress, and schedule new AI-powered mock interviews.",
  },
  interviews: {
    title: "Interviews - Practice Job Interviews with AI",
    description:
      "Practice job interviews with AI-powered video calls. Get realistic interview experience and instant feedback to improve your interview performance.",
  },
  agents: {
    title: "AI Interview Agents - Customize Your Interview Practice",
    description:
      "Create and customize AI interview agents tailored to your industry and role. Practice with specialized AI interviewers for better preparation.",
  },
  upgrade: {
    title: "Upgrade - Unlock Premium Interview Practice Features",
    description:
      "Upgrade to intervw Premium for unlimited AI interview practice sessions, advanced feedback analytics, and industry-specific interview preparation.",
  },
};

// JSON-LD Schema Markup
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "intervw",
  description:
    "AI-powered interview practice platform helping job seekers prepare for interviews with realistic AI interviewers",
  url: process.env.NEXT_PUBLIC_APP_URL || 
       (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://intervw.com"),
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://intervw.com"}/logo.png`,
  sameAs: [
    // Add your social media URLs here
    // "https://twitter.com/intervw",
    // "https://linkedin.com/company/intervw",
  ],
});

export const generateSoftwareApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "intervw",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered interview practice platform for job seekers. Practice interviews with AI video calls and get instant feedback.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1000",
  },
});

export const generateFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does AI interview practice work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "intervw uses advanced AI technology to simulate realistic job interviews. You'll have video calls with AI interviewers who ask industry-specific questions and provide instant feedback on your performance.",
      },
    },
    {
      "@type": "Question",
      name: "Can I practice interviews for specific industries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! intervw allows you to customize AI interview agents for different industries and roles, ensuring you practice with relevant questions for your target position.",
      },
    },
    {
      "@type": "Question",
      name: "Is intervw free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "intervw offers a free trial with limited sessions. You can upgrade to premium for unlimited AI interview practice sessions and advanced features.",
      },
    },
  ],
});

