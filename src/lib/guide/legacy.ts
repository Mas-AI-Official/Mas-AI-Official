/**
 * Site guide intelligence. FROZEN by owner order (Masoud Masoori, 2026-09-30): this file is the ORIGINAL
 * DaenaGuide knowledge base, keyword matcher and fallback, copied from git tag pre-redesign-2026-09-30
 * (src/components/DaenaGuide.tsx). Do not redesign, reorder, retune or "fix" matching here. Matching is the
 * original substring scoring: score = sum of the lengths of the keywords contained in the lowercased input,
 * highest score wins, first entry wins ties, no match returns null.
 *
 * Only redesign-forced edits are allowed, each one marked FORCED below with the reason:
 *  - a link or home section id that no longer exists on the rebuilt site,
 *  - a sentence that src/content/facts.ts or the content gate (scripts/check-content.mjs) now contradicts.
 * Forced remaps (see guide.test.ts): section ids paths->services, products->daena, portfolio->work,
 * enterprise->services, credibility->company, contact->start, proof->daena (the old homepage sections are gone);
 * link /book->/start/ (the old page is now a redirect stub).
 * Owner-approved marketing update (expanded-proposition brief, 2026-09-30): answers 0, 1, 8, 13, 17, 18, 30, 37,
 * 41 and 48 rewritten for the AI implementation and software delivery proposition. Answers only: keywords, order,
 * sections, links and the greeting are unchanged, so every query still routes to the same entry.
 * The characterization test src/lib/guide/guide.test.ts pins every query to the original's entry.
 */

export interface KnowledgeEntry {
  keywords: string[]
  answer: string
  section: string | null
  link?: string
}

export const KNOWLEDGE: KnowledgeEntry[] = [
  // --- TWO PATHS (primary navigation intent)
  {
    keywords: ['two paths', 'paths', 'which path', 'what do you do', 'services', 'what can you', 'offerings', 'what do you offer'],
    answer: "We are an AI implementation and software delivery company. We work inside your business, find where the work stalls, and decide what should exist: automation, an integration, custom software, AI, or no change at all. Then we build it, connect it to your systems, deploy it in your cloud, on your own hardware or both, and keep improving it. Not sure where to start? Tell me what slows your team down.",
    section: 'services',
  },
  {
    keywords: ['build path', 'automation', 'install', 'installation', 'deploy ai', 'need an agent', 'build for me', 'custom agent'],
    answer: "We build agents, assistants, automations, internal tools, APIs, portals and websites that do work, connected to the systems you already use. Agents act through your tools inside approval steps, and every action is logged so you can check it. Scope and price are agreed before the build starts, and the code is yours.",
    section: 'services',
    link: '/automation',
  },
  {
    keywords: ['secure path', 'scan', 'vulnerability', 'audit my', 'pen test', 'hack my', 'find holes', 'exposed', 'security audit'],
    answer: 'Path 2, Secure. I scan your website, API, mobile app, or cloud using Klyntar. Zero-FP gate means no false alarms, every operator-tier finding comes with a working exploit. Free 2-hour recon first, then paid audits from $12.5k.',
    section: 'services',
    link: '/security',
  },
  {
    keywords: ['book call', 'book consultation', 'schedule call', 'appointment', 'meeting', 'free call', 'book meeting'],
    answer: 'Three booking options. (1) Free 30-min consultation where we map your options and pick a path. (2) Free security scan, send a URL and get 3 findings in 48h. (3) Free automation audit, 45 min to scope the agent you need.',
    section: null,
    link: '/start/',
  },
  {
    keywords: ['not sure', 'help me decide', 'which one', 'dont know', "don't know", 'recommend', 'suggest'],
    answer: 'Book the free 30-min call. I listen, map the gaps, and tell you which path fits. If neither fits, I tell you that too. No pitch deck, no commitment.',
    section: null,
    link: '/start/',
  },
  {
    keywords: ['klyntar', 'klynter', 'security platform', 'red team', 'offensive security'],
    answer: 'Klyntar is my security platform. 25+ exploit signatures, 45+ scanners detected by behavior. Zero-FP gate drops findings without a working exploit. Asset Shield vault, AI enrichment. Frontier-level vulnerability discovery, tuned for AI-era stacks.',
    section: 'daena',
    link: '/security',
  },
  {
    keywords: ['mythos', 'frontier', 'anthropic security'],
    answer: 'My scan depth is comparable to frontier-AI vulnerability discovery. I tune the discovery for your specific stack rather than a generic crawl.',
    section: 'daena',
  },
  {
    keywords: ['ai act', 'eu ai act', 'eu regulation', 'compliance deadline'],
    answer: 'I run a fixed 2-week readiness sprint: classification, Article 9/11/12/14 documentation, Daena-wired audit trail. $18k.',
    section: null,
    link: '/ai-act-readiness',
  },
  {
    keywords: ['what is mas-ai', 'mas-ai', 'company', 'who are you', 'about mas', 'tell me about'],
    answer: "MAS-AI Technologies Inc. is a Canadian company, federally incorporated and based in Ontario. We implement AI and deliver software: we diagnose the gap in how your work runs, then design, build, integrate and deploy the system that closes it. Daena, ragX and our other products show what we build; you do not need them to work with us. One US provisional patent application filed.",
    section: 'hero',
  },
  {
    keywords: ['founder', 'masoud', 'ceo', 'who built', 'team'],
    answer: 'MAS-AI was founded by Masoud Masoori, a solo technical founder and senior AI/ML architect based in Ontario, Canada. He built MAS-AI from zero with two architectures, PhiLattice and NBMF.',
    section: 'company',
  },
  {
    keywords: ['daena', 'product', 'platform', 'flagship', 'what is daena'],
    answer: 'Daena is our flagship platform: a governance-first AI agent orchestration system. It coordinates multiple AI agents with built-in policy enforcement, auditable memory, and a 10-stage execution pipeline. Want the full details?',
    section: 'daena',
    link: 'https://daena.mas-ai.co',
  },
  {
    keywords: ['governance', 'governed', 'policy', 'audit', 'trust'],
    answer: 'Governance is at the core of everything we build. Our AI agents operate within policy-enforced pipelines where every decision is traced and auditable. No black boxes.',
    section: 'daena',
  },
  {
    keywords: ['patent', 'ip', 'philattice', 'nbmf', 'architecture', 'memory'],
    answer: 'We have one US provisional patent application on file: NBMF (Neural-Backed Memory Fabric, our auditable memory system).',
    section: 'company',
  },
  {
    keywords: ['products', 'portfolio', 'build', 'built', 'what do you', 'what you built', 'what are you doing', 'projects', 'what have you', 'show me', 'your work'],
    answer: "We build what a business is missing: automation, integrations, custom software, AI systems and websites that do work. Products we operate include Daena, our governed multi-agent platform, ragX, our retrieval system, and MCP Switchboard. The work page shows each one, what it is today and what it proves.",
    section: 'work',
  },
  {
    keywords: ['contentops', 'content'],
    answer: 'ContentOPS is our autonomous content operations engine. It scrapes, generates, and publishes content across platforms using self-coordinating agents.',
    section: 'work',
  },
  {
    keywords: ['medsmart', 'med smart', 'healthcare', 'medical'],
    answer: 'Med Smart is our AI-powered patient care management system.',
    section: 'work',
  },
  {
    keywords: ['construction', 'building', 'permits'],
    answer: 'Construction AI handles building code compliance, permit analysis, and project management using AI.',
    section: 'work',
  },
  {
    keywords: ['enterprise', 'deploy', 'b2b', 'business', 'work with', 'services', 'consulting'],
    answer: "We cover the whole path: workflow discovery, integration with your existing and older systems, AI implementation, custom software, agents with approval steps, and deployment in a cloud service, your own cloud account, your own hardware or a hybrid of these. Access control, evaluation, monitoring, documentation and handover are part of the build, not extras.",
    section: 'services',
  },
  {
    keywords: ['industries', 'serve', 'clients', 'who use', 'sectors'],
    answer: "We build for operations-heavy businesses, including regulated ones where data location, approvals and audit trails matter. We start from how your work actually runs, not from an industry template.",
    section: 'services',
  },
  {
    keywords: ['google', 'startups', 'azure', 'gcp', 'credits', 'programs'],
    answer: "We're accepted into the Google for Startups Cloud Program, have Azure for Startups and GCP credits secured, and are approved for Perplexity for Startups.",
    section: 'company',
  },
  {
    keywords: ['test', 'demo', 'proof', 'working', 'ready', 'how many tests'],
    answer: 'Daena (beta) ships with an automated test suite. We do not publish a test count. One US provisional patent application filed. Production-deployed on GCP. Not a roadmap, real software.',
    section: 'daena',
  },
  {
    keywords: ['exploit', 'signatures', 'zero-fp', 'zero fp', 'false positive', 'scanner'],
    answer: 'Klyntar ships 25+ exploit signatures (SQLi, XSS, CMDi, SSRF, XXE, Log4Shell, and more), detects 45+ hacking tools by behavioral fingerprint (nuclei, sqlmap, burp, nmap, hydra). The Zero-FP gate drops any operator-tier finding we cannot reproduce with a working exploit, so we never ship noise.',
    section: 'daena',
    link: '/security',
  },
  {
    keywords: ['asset shield', 'vault', 'consent token', 'egress'],
    answer: 'Asset Shield is the data-safety sub-system inside Klyntar. Vault + egress filter + consent tokens. Any sensitive material pulled into Klyntar during a scan is destroyed within 24 hours of delivery. Audit trail signed end-to-end.',
    section: 'daena',
  },
  {
    keywords: ['beyondmythos', 'beyond mythos', 'enrichment'],
    answer: 'Klyntar\'s enrichment stage runs every finding through three AI checks: ErrorOracle verifies the reasoning, AdversarialSimulator stress-tests the claim, CompositionalPlanner attaches remediation. Hallucinated vulnerabilities get killed at the gate.',
    section: 'daena',
  },
  {
    keywords: ['contact', 'email', 'call', 'reach', 'book', 'talk', 'meet', 'schedule'],
    answer: "You can reach us at masoud.masoori@mas-ai.co or connect on LinkedIn. We'd love to discuss how governed AI can work for your organization.",
    section: 'start',
  },
  {
    keywords: ['invest', 'funding', 'investor', 'raise', 'pitch'],
    answer: 'For investment inquiries, please reach out directly to masoud.masoori@mas-ai.co. We can share our pitch deck and discuss our roadmap.',
    section: 'start',
  },
  {
    keywords: ['pipeline', 'stages', '10-stage', 'how does daena work', 'technical', 'council', 'quintessence'],
    answer: 'Great question! The technical deep-dive lives on the Daena product page. Let me take you there.',
    section: null,
    link: 'https://daena.mas-ai.co',
  },
  {
    keywords: ['who is daena', 'what are you', 'are you ai', 'are you real', 'your name'],
    answer: "I'm Daena, the AI guide for MAS-AI Technologies. I can answer questions about our company, products, and services. I'm also the name of our flagship platform!",
    section: 'daena',
  },
  {
    keywords: ['how many', 'size', 'employees', 'people work'],
    answer: 'MAS-AI is currently a solo-founder company. Masoud Masoori is the technical founder and CEO, building the entire platform and product suite.',
    section: 'company',
  },
  {
    keywords: ['where', 'location', 'based', 'canada', 'ontario', 'office'],
    answer: 'MAS-AI Technologies Inc. is based in Ontario, Canada. We were incorporated in January 2026.',
    section: 'company',
  },
  {
    keywords: ['pricing', 'cost', 'price', 'how much', 'free'],
    answer: "Every engagement starts with the problem and a written scope. Scope and price are agreed before any build starts. For Daena itself, ask us about early access at masoud.masoori@mas-ai.co.",
    section: 'start',
  },
  // TECHNOLOGY / INNOVATION
  {
    keywords: ['innovation', 'innovative', 'new', 'different', 'unique', 'special'],
    answer: 'Our key innovations are two architectures: PhiLattice (Fibonacci-based agent topology for scalable orchestration) and NBMF (Neural-Backed Memory Fabric for persistent, auditable agent memory). No other platform has governance built directly into the execution layer.',
    section: 'company',
  },
  {
    keywords: ['how it works', 'explain', 'how does it', 'tell me more', 'details'],
    answer: 'At a high level: Daena coordinates AI agents through a 10-stage governed pipeline. Every agent action passes through SecurityGate, GovernanceEngine, ReasoningCore, and AuditLog before reaching output. For the full technical deep-dive, visit daena.mas-ai.co.',
    section: 'daena',
    link: 'https://daena.mas-ai.co',
  },
  {
    keywords: ['security', 'safe', 'secure', 'protect', 'risk'],
    answer: 'Security is the first stage of our pipeline (SecurityGate). Every input is screened before processing. Combined with policy enforcement at the GovernanceEngine stage and full audit logging, Daena provides enterprise-grade security for AI operations.',
    section: 'daena',
  },
  {
    keywords: ['agent', 'agents', 'multi-agent', 'autonomous', 'orchestrat'],
    answer: 'Daena orchestrates multiple AI agents as governed departments. Each agent operates within policy boundaries, shares auditable memory via NBMF, and coordinates through the PhiLattice topology. Think of it as a governed operating system for AI workforces.',
    section: 'daena',
  },
  {
    keywords: ['10-stage', 'pipeline', 'stages', 'securitygate', 'auditlog'],
    answer: 'The 10-stage pipeline: SecurityGate, InputValidator, GovernanceEngine, ContextBuilder, ReasoningCore, ActionPlanner, OutputValidator, ResponseFormatter, FeedbackLoop, AuditLog. Every agent action passes through all 10 stages.',
    section: null,
    link: 'https://daena.mas-ai.co',
  },

  // COMPETITION / COMPARISON
  {
    keywords: ['competitor', 'competition', 'compare', 'vs', 'alternative', 'similar', 'other'],
    answer: 'Most AI governance tools (Holistic AI, Cranium, Credo AI) monitor existing AI systems from the outside. Daena is fundamentally different: governance is inside the execution layer. We are not monitoring AI, we are running governed AI natively.',
    section: 'services',
  },
  {
    keywords: ['why', 'why mas-ai', 'why daena', 'why choose', 'advantage', 'benefit'],
    answer: "Three reasons: (1) We decide before we build, and sometimes the right answer is not AI. (2) The person who maps your business is the person who builds the system, so nothing is lost in a handoff. (3) It runs where your data should live, and the code, data and accounts are yours.",
    section: 'daena',
  },

  // HIRING / CAREERS
  {
    keywords: ['hiring', 'job', 'career', 'work for', 'join', 'open position', 'role'],
    answer: 'We are always looking for exceptional engineers and AI researchers. Reach out to masoud.masoori@mas-ai.co with your background and what excites you about governed AI.',
    section: 'start',
  },

  // OPEN SOURCE
  {
    keywords: ['open source', 'github', 'code', 'repo', 'repository', 'source code'],
    answer: 'Some of our projects are open source on GitHub. Check out github.com/Mas-AI-Official for our public repositories including ContentOPS and other tools.',
    section: 'work',
    link: 'https://github.com/Mas-AI-Official',
  },

  // TIMELINE / AVAILABILITY
  {
    keywords: ['when', 'launch', 'release', 'timeline', 'available', 'waitlist', 'early access'],
    answer: 'Daena is in beta with a working demo. We are onboarding early access partners now. Contact us to discuss pilot opportunities.',
    section: 'start',
  },

  // PARTNERSHIPS
  {
    keywords: ['partner', 'partnership', 'collaborate', 'integration', 'integrate'],
    answer: "We connect the systems you already use, such as your CRM, ERP, accounting, document systems, databases and internal APIs, so work moves without re-typing. For partnerships with system integrators or technology providers, write to masoud.masoori@mas-ai.co.",
    section: 'start',
  },

  // COMPLIANCE / REGULATION
  {
    keywords: ['compliance', 'regulation', 'regulatory', 'gdpr', 'hipaa', 'sox', 'legal'],
    answer: 'Daena is designed for regulated industries. The 10-stage pipeline enforces policies at execution time, NBMF provides complete audit trails, and every decision is traceable. This is built for finance, healthcare, legal, and other compliance-heavy sectors.',
    section: 'services',
  },

  // DEMO / TRY
  {
    keywords: ['try', 'see', 'demo', 'video', 'watch', 'preview', 'look'],
    answer: 'You can explore our working demo and video walkthrough on the Daena product page. We also offer live technical walkthroughs for qualified prospects.',
    section: 'daena',
    link: 'https://daena.mas-ai.co',
  },

  // DAENA GUARD
  {
    keywords: ['guard', 'daena guard', 'security layer', 'protection'],
    answer: 'Daena Guard is our AI security and governance layer for enterprise agent deployments. It is currently in development as part of the MAS-AI product suite.',
    section: 'work',
  },

  // GENERAL / CONVERSATIONAL
  {
    keywords: ['hello', 'hi', 'hey', 'greet', 'sup', 'yo', 'what up', 'good morning', 'good evening'],
    answer: "Hello! Welcome to MAS-AI. I'm Daena, the AI behind the brand. What would you like to know?",
    section: null,
  },
  {
    keywords: ['thank', 'thanks', 'awesome', 'cool', 'great', 'nice', 'good job', 'impressive'],
    answer: 'Happy to help! Feel free to ask anything else about MAS-AI or our products.',
    section: null,
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'take care'],
    answer: "Thanks for visiting! If you need anything, I'm always here. Come back anytime.",
    section: null,
  },
  {
    keywords: ['help', 'what can you', 'options', 'menu', 'guide'],
    answer: "I can tell you about what we build, where it can run (a cloud service, your own cloud account, your own hardware or hybrid), how a project starts, our products such as Daena, the founder, and how to get in touch. Just ask!",
    section: null,
  },
  {
    keywords: ['funny', 'joke', 'laugh', 'humor'],
    answer: "I'm better at explaining governed AI than telling jokes. But here's a thought: an AI without governance is like a car without brakes. Fast, but you won't like the destination.",
    section: null,
  },
]

// The opening message. FORCED: the original used an em dash escape and said "the patents" (facts.ts lists one).
export const GREETING =
  "Hi. I'm Daena, the governance side of MAS-AI. My security mode is called Klyntar, you'll meet her below. "
  + 'Two paths here: (1) we build governed AI agents for your business, or (2) we scan and secure what you already run. '
  + "Ask about either, the patent, Klyntar's 25+ exploit signatures, or just type \u201Cnot sure\u201D and I'll help you pick."

export const FALLBACK = "I'm not sure about that one. For detailed questions, you can email masoud.masoori@mas-ai.co. Or try asking about our products, services, or team!"

export function findBestMatch(input: string): KnowledgeEntry | null {
  const lower = input.toLowerCase().trim()
  let bestScore = 0
  let bestEntry: KnowledgeEntry | null = null
  for (const entry of KNOWLEDGE) {
    let score = 0
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += keyword.length
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestEntry = entry
    }
  }
  return bestScore > 0 ? bestEntry : null
}
