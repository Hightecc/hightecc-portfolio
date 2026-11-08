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
      title: "Hightecc · AI consulting and implementation for SMEs in Cologne",
      description:
        "Basile Bong works out where AI can save your business time and builds the tools to do it. For small and mid-sized businesses without their own IT department.",
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
    sub: "I'm Basile, a consultant and developer in Cologne. I work out where your business loses time, whether that's enquiries, quotes or paperwork, and <strong>build the tool that takes that work off your hands</strong>. For businesses without their own IT department.",
    cta: {
      primary: "Arrange an intro call",
      secondary: "What I offer",
    },
  },
  statement: {
    before:
      "Everyone's talking about AI. Hardly anyone tells you what it can actually do for your business.",
    after: "I will. And then I'll build what's worth building.",
  },
  capabilities: {
    section: {
      title: "What I can <em>do for you.</em>",
      lede: "From a first look at your business to a finished tool. Start with the check, or come straight to me with a specific task.",
    },
    a: {
      title: "AI check",
      desc: "I look at how your business runs day to day and tell you honestly where AI saves time and where it doesn't. You come away knowing where to start and what you'll get out of it.",
    },
    b: {
      title: "AI assistant",
      desc: "An assistant that knows your documents: it prepares replies to customer enquiries, finds what you need in manuals and contracts or writes a first draft of your next quote. Nothing goes out without your say-so.",
    },
    c: {
      title: "Automation",
      desc: "Copying data from one program to another, keying in incoming invoices, sending appointment reminders: a computer can handle all of that. Your team spends less time clicking and more time on the real work.",
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
      lede: "No drawn-out planning phase. Three steps, and after each one you decide whether to keep going.",
    },
    one: {
      title: "Listen first, <em>advise second.</em>",
      body: "We talk about how your business works and where things get stuck. I keep asking until I understand, and explain everything so you don't need a technical background.",
      items: ["In Cologne or by video call", "No sales pitch", "Honest advice, even if it's no"],
    },
    two: {
      title: "Start small, <em>see results fast.</em>",
      body: "We pick the one task where AI makes the biggest difference and solve that first. Within a few weeks, your team is trying out something real in their daily work. Not months from now.",
      items: ["One task at a time", "Tested early with your team", "No never-ending big project"],
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
    lede: "I've been building software for as long as I can remember: websites, apps, automations and AI tools. <em>What I care about most is whether it really helps.</em> <muted>Building a tool is one thing. Getting people to use it every day, and making it pay for itself, is another. So the technology is only half of what I think about. The other half is processes, costs and the people using it.</muted>",
    credo: {
      contactK: "Your contact",
      contactV: "Just me, from the first call to the finished tool",
      focusK: "Focus",
      focusV: "AI check · AI assistant · Automation · Custom software",
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
    alt: "Two people walk through the glass door of a brightly lit office where the team is already at work.",
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
  imageCredit: {
    label: "AI-generated",
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
