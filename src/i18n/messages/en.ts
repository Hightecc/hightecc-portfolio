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
      title: "Hightecc · AI consulting and custom software for SMEs in Cologne",
      description:
        "Basile Bong works out where AI can save your business time, plans the changes with your IT and builds custom software.",
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
      line1: "Put AI to work",
      line2: "where it <amp>actually</amp> helps.",
    },
    sub: "I'm Basile, an AI consultant for small and mid-sized businesses, based in Cologne. I work out where your business loses time, whether that's enquiries, quotes or paperwork, and <strong>plan with you and your IT team how AI can take that work on</strong>. Where nothing off the shelf fits, I build the software myself.",
    cta: {
      primary: "Arrange an intro call",
      secondary: "What I offer",
    },
  },
  statement: {
    before:
      "Everyone's talking about AI. Hardly anyone tells you what it can actually do for your business.",
    after: "I will. Then we'll plan how to get there, together.",
  },
  capabilities: {
    section: {
      title: "What I can <em>do for you.</em>",
      lede: "From a first look at your business to a clear plan, or software I build for you. Start with the check, or come straight to me with a specific question.",
    },
    a: {
      title: "AI check",
      desc: "I look at how your business runs day to day and tell you honestly where AI saves time and where it doesn't. You come away knowing where to start and what you'll get out of it.",
    },
    b: {
      title: "Workflow planning",
      desc: "I map out how work should move through your business: which programs need to talk to each other, and where AI could take over a step, such as sorting incoming enquiries or drafting a first quote. You end up with a clear plan your IT can build from.",
    },
    c: {
      title: "Bridge to your IT",
      desc: "I sit down with your IT team or provider, translate between you and the technical side, and review their proposals and quotes. That way, what gets built is what you need.",
    },
    d: {
      title: "Custom software",
      desc: "When nothing off the shelf fits, I build something that does: a portal where customers send in orders, a mobile app or a scheduling tool your team uses in the browser.",
    },
    note: "Not sure which of these fits? <strong>That's what the first call is for.</strong>",
  },
  pillars: {
    section: {
      title: "How it works. <em>No jargon.</em>",
      lede: "No plan that tries to do everything at once. Three steps, and after each one you decide whether to keep going.",
    },
    one: {
      title: "Listen first, <em>advise second.</em>",
      body: "We talk about how your business works and where things get stuck. I keep asking until I understand, and explain everything so you don't need a technical background.",
      items: ["In Cologne or by video call", "No sales pitch", "Honest advice, even if it's no"],
    },
    two: {
      title: "Start small, <em>try it early.</em>",
      body: "We pick the one task where AI makes the biggest difference and tackle that first. Depending on the task, your IT puts the plan into practice or I build the software myself. Either way, your team gets to try it early and see whether it helps day to day.",
      items: ["One task at a time", "Early feedback from your team", "No never-ending big project"],
    },
    three: {
      title: "Only build on <em>what pays off.</em>",
      body: "I think like a business owner, not just an engineer. Every step has to be worth it for you: less effort, quicker turnaround or happier customers. If it isn't, we'll know early and stop.",
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
    lede: "I've been building software for as long as I can remember: websites, web apps and mobile apps. <em>What I care about most is whether it really helps.</em> <muted>Because I build software myself, I know what's technically possible. That lets me talk to your IT as an equal and still explain everything so you can make a good decision.</muted>",
    credo: {
      contactK: "Your contact",
      contactV: "Always me, from the first call onwards",
      focusK: "Focus",
      focusV: "AI check · Workflow planning · Bridge to your IT · Custom software",
      basedInK: "Based in",
      basedInV: "Cologne · on site or by video call",
      languagesK: "Languages",
      languagesV: "Deutsch · Français · English",
    },
  },
  contact: {
    heading: "Tell me <em>what's slowing you down.</em>",
    lede: "Send me a few lines about what your business does and which tasks eat up the most time. I'll get back to you, and together we'll work out whether AI can help, and how.",
    linkedinLabel: "LinkedIn",
    mailNote: "Email is the fastest way to reach me.",
    alt: "A woman with a tote bag walks through the open door of a small office in a brick building, where two colleagues are talking over coffee.",
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
