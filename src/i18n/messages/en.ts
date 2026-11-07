import type { MessageShape } from "./shape";

const messages: MessageShape = {
  nav: {
    work: "Approach",
    what: "Services",
    about: "About",
    cta: "Let's talk",
    menu: "Menu",
  },
  metadata: {
    home: {
      title: "Hightecc · Basile Bong · AI Consulting & Implementation",
      description:
        "AI consulting for companies that don't know where to start. Clear explanations, honest assessments, solid implementation.",
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
      line1: "First-class work deserves",
      line2: "first-class <amp>software</amp>.",
    },
    sub: "I'm Basile. I help business owners <strong>use AI where it actually helps</strong>: from getting your bearings to a solution that runs day to day. No hype. Clear communication and the right pace.",
    cta: {
      primary: "Request an intro call",
      secondary: "How I work",
    },
  },
  statement: {
    before:
      "AI is changing how work gets done in every industry. Many companies are facing it and wondering where to start.",
    after: "I help with the first step. And every one after that.",
  },
  about: {
    section: {
      title: "Tech is never boring. <em>That's exactly why</em> I'm here.",
    },
    lede: "I've been building digital products for as long as I can remember. <em>Anything you can build, I'm curious about.</em> <muted>Web, mobile, automations, AI features. I love turning ideas into something tangible. And almost as much, I love the other side: business, sales, the question of whether the product actually lands with people. Because building a product is one thing. Hitting goals with it is another.</muted>",
    credo: {
      credoK: "Credo",
      credoV: "Assumptions are expensive. Feedback isn't.",
      lovesK: "Loves",
      lovesV: "Digital products of every kind. Business & sales. AI & automation.",
      basedInK: "Based in",
      basedInV: "Cologne, DE or remote",
      languagesK: "Languages",
      languagesV: "Deutsch · Français · English",
    },
  },
  pillars: {
    section: {
      title: "What you book me for <em>(and not just for code).</em>",
      lede: 'The real value rarely lives in the code alone. Here\'s what makes the difference between "project running" and "project failing".',
    },
    one: {
      title: "Communication <em>that leaves no guesswork.</em>",
      body: "Clear and open, no jargon to impress. I'd rather ask again until I've understood what really matters to you. Communication as a tool, not an afterthought.",
      items: [
        "Listen before proposing",
        "Plain talk over buzzwords",
        "Ask when something's unclear",
      ],
    },
    two: {
      title: "Cut down to <em>the essentials.</em>",
      body: "I break large initiatives into release-ready slices. Something real is running after a few weeks, not months. Budgets don't tip over in the dark, and every decision is confirmed by real feedback, not assumptions.",
      items: ["MVP with a clear core", "Early in users' hands", "Iteration, not Big Bang"],
    },
    three: {
      title: "Planning with a <em>business head.</em>",
      body: "I don't just think in code and tech stack. I think in milestones, budgets, and hypotheses. Every week of work should answer a question for your business, not just close a ticket.",
      items: ["ROI-driven backlog", "Release plans that hold", "Critical paths first"],
    },
  },
  capabilities: {
    section: {
      title: "Where I usually <em>operate.</em>",
      lede: "Short, because it shouldn't be the focus: these are the areas I go deep in. Choose by problem, not by tool.",
    },
    a: {
      title: "AI assessment",
      desc: "Where does AI pay off in your company, and where doesn't it? I look at your processes and your team and tell you honestly where to start.",
    },
    b: {
      title: "AI integration",
      desc: "LLM features that work in your product. Including monitoring, guardrails, and honest evaluation.",
    },
    c: {
      title: "Automation",
      desc: "Taking a close look at internal tooling, finding bottlenecks, building automations. So your team clicks less and gets more done.",
    },
    d: {
      title: "Web & mobile",
      desc: "Production-ready web apps, clean backends, and cross-platform apps. For when the idea needs to become a product.",
    },
    note: "Other stacks? <strong>Worth asking.</strong> The right tool is decided by the problem, not by the resume.",
  },
  products: {
    section: {
      title: "On the side, I'm building <em>something of my own.</em>",
    },
    heading: "No name yet. <em>Clear direction.</em>",
    body: "Between client projects, I'm building something of my own. More on it when it's ready. Building something too? Let's spar.",
    meta: {
      statusK: "Status",
      statusV: "Prototype · Research",
      launchK: "Launch",
      launchV: "TBD · 2026",
      modeK: "Mode",
      modeV: "Bootstrap · Solo",
      updatesK: "Updates",
      updatesV: "By email on request",
    },
  },
  contact: {
    heading: "Tell me about <em>your project.</em>",
    lede: "Where do you stand right now? Together we'll figure out whether and where AI makes sense for you.",
    linkedinLabel: "LinkedIn",
    mailNote: "Email is the fastest way to reach me",
    alt: "A man steps out of a lit entrance hall into the blue winter morning.",
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
