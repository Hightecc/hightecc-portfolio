import type { MessageShape } from "./shape";

const messages: MessageShape = {
  nav: {
    what: "Services",
    work: "How it works",
    about: "About",
    cta: "Get in touch",
    menu: "Menu",
  },
  metadata: {
    home: {
      title: "Hightecc · Custom software and AI in Cologne",
      description:
        "Basile Bong turns your idea into working software, with AI where it actually helps. For founders and small businesses.",
    },
    impressum: {
      title: "Legal notice · Hightecc",
      description: "Legal notice and provider information pursuant to § 5 DDG.",
    },
    datenschutz: {
      title: "Privacy · Hightecc",
      description: "Privacy notice pursuant to Art. 13 GDPR.",
    },
  },
  hero: {
    headline: {
      line1: "Your idea, built.",
      line2: "With AI where it <amp>actually</amp> helps.",
    },
    sub: "I'm Basile, a software engineer in Cologne who builds AI products that customers use every day. I help founders and businesses <strong>turn an idea into working software</strong>, even if they've never worked with tech before.",
    cta: {
      primary: "Tell me your idea",
      secondary: "What I offer",
    },
  },
  capabilities: {
    section: {
      title: "What I can <em>build for you.</em>",
      lede: "From a first idea to finished software. Start with the idea check, or come straight to me with a specific question.",
    },
    a: {
      title: "Idea check",
      desc: "We go through your idea together. I tell you honestly what's worth building, where AI really helps, and what it will cost.",
    },
    b: {
      title: "MVP for your startup",
      desc: "A first working version, small enough to put in front of real users fast. Then you learn what people actually want.",
    },
    c: {
      title: "AI features",
      desc: "AI that does real work: it answers questions, sorts enquiries, drafts texts and searches your documents.",
    },
    d: {
      title: "Custom tools",
      desc: "Software for one specific job, like an order portal for your customers, a booking tool or an internal app for your team.",
    },
    note: "Not sure which fits? <strong>That's what the first call is for.</strong>",
  },
  pillars: {
    section: {
      title: "From idea to software. <em>No jargon.</em>",
      lede: "No plan that tries to do everything at once. Three steps, and after each one you decide whether to keep going.",
    },
    one: {
      title: "Understand first, <em>build second.</em>",
      body: "You explain your idea in your own words. I ask questions until I get it, and I'll tell you if it doesn't need custom software.",
      items: ["In Cologne or by video call", "No sales pitch", "Honest advice, even if it's no"],
    },
    two: {
      title: "Start small, <em>test early.</em>",
      body: "We build the smallest version that proves the idea and get it in front of real people quickly.",
      items: [
        "The smallest version first",
        "Tested early with real people",
        "No never-ending big project",
      ],
    },
    three: {
      title: "Grow <em>what works.</em>",
      body: "Every step has a fixed scope and budget. If it works we build more, if it doesn't we stop early.",
      items: [
        "A clear goal for every step",
        "A budget you can plan around",
        "Results first, then the next step",
      ],
    },
  },
  about: {
    section: {
      title: "Hi, I'm <em>Basile.</em>",
    },
    lede: "I build AI products that real customers use every day, and I spend much of my time working directly with those customers. <em>I listen to what they need, explain tech in plain words and think about what pays off for the business.</em> <muted>Not just what's technically possible. That's how I work with you too.</muted>",
    credo: {
      focusK: "Focus",
      focusV: "Idea check · MVP · AI features · Custom tools",
      audienceK: "Works with",
      audienceV: "Founders and small businesses",
      basedInK: "Based in",
      basedInV: "Cologne · on site or by video call",
      languagesK: "Languages",
      languagesV: "Deutsch · Français · English",
    },
  },
  contact: {
    heading: "Tell me <em>about your idea.</em>",
    lede: "A few sentences is enough: what you want to build and who it's for. I'll get back to you, and we'll work out the next step together.",
    linkedinLabel: "LinkedIn",
    mailNote: "Email is the fastest way to reach me.",
  },
  impressum: {
    section: {
      title: "Who's behind <em>Hightecc</em>.",
    },
    preface:
      "Legal notice required by German law. The original German text follows below and is the legally binding version.",
  },
  datenschutz: {
    section: {
      title: "How I handle <em>your data</em>.",
    },
    preface:
      "Privacy notice required by German law. The original German text follows below and is the legally binding version.",
  },
  footer: {
    pitch: "No cookies. No tracking. No banners. Just the page you asked for.",
    brandSuffix: "· Basile Bong · Cologne, DE",
    impressum: "Legal notice",
    datenschutz: "Privacy",
    version: "v2026.1",
    buildTag: "Built with care",
  },
  localeSwitcher: {
    label: "Language",
    de: "DE",
    en: "EN",
  },
  a11y: {
    skipLink: "Skip to main content",
  },
};

export default messages;
