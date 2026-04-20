'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Send, ArrowUpRight } from 'lucide-react'

// ─── Section Moods (speech bubbles when scrolling) ──────────────────────────

interface SectionMood {
  glow: string
  caption: string
  brightness: number
}

const SECTION_MOODS: Record<string, SectionMood> = {
  hero:         { glow: '#00c8ff', caption: 'Welcome to MAS-AI.',        brightness: 1.0 },
  'what-we-do': { glow: '#00c8ff', caption: 'Three pillars. One mission.', brightness: 1.05 },
  daena:        { glow: '#00d4ff', caption: "That's my section.",          brightness: 1.1 },
  portfolio:    { glow: '#d4a853', caption: 'We ship real products.',     brightness: 1.05 },
  enterprise:   { glow: '#d4a853', caption: 'Built for scale.',          brightness: 0.95 },
  credibility:  { glow: '#c8956a', caption: 'Meet the founder.',         brightness: 0.9 },
  contact:      { glow: '#7c3aed', caption: "Let's connect.",            brightness: 1.0 },
  faq:          { glow: '#00c8ff', caption: 'Got questions?',            brightness: 0.9 },
}

const DEFAULT_MOOD: SectionMood = { glow: '#00c8ff', caption: '', brightness: 1.0 }

// ─── Knowledge Base ─────────────────────────────────────────────────────────

interface KnowledgeEntry {
  keywords: string[]
  answer: string
  section: string | null
  link?: string
}

const knowledge: KnowledgeEntry[] = [
  // --- TWO PATHS (primary navigation intent)
  {
    keywords: ['two paths', 'paths', 'which path', 'what do you do', 'services', 'what can you', 'offerings', 'what do you offer'],
    answer: 'Two paths. (1) Build: I install governed AI agents for your business, custom ones or off-the-shelf like Claude Code or OpenClaw, all wrapped in my governance stack. (2) Secure: I scan your existing websites, apps, code, and cloud for vulnerabilities using Klyntar with frontier-level discovery. Pick one, or book a free 30-min call and we decide together.',
    section: 'paths',
  },
  {
    keywords: ['build path', 'automation', 'install', 'installation', 'deploy ai', 'need an agent', 'build for me', 'custom agent'],
    answer: 'Path 1, Build. I install custom AI agents, voice assistants, Claude Code, OpenClaw, or whatever fits. Everything ships wrapped in Daena governance (audit trail, approval queues, Shield always on). 21-day build, fixed price, source code yours.',
    section: 'paths',
    link: '/automation',
  },
  {
    keywords: ['secure path', 'scan', 'vulnerability', 'audit my', 'pen test', 'hack my', 'find holes', 'exposed', 'security audit'],
    answer: 'Path 2, Secure. I scan your website, API, mobile app, or cloud using Klyntar. Zero-FP gate means no false alarms, every operator-tier finding comes with a working exploit. Free 2-hour recon first, then paid audits from $12.5k.',
    section: 'paths',
    link: '/security',
  },
  {
    keywords: ['book call', 'book consultation', 'schedule call', 'appointment', 'meeting', 'free call', 'book meeting'],
    answer: 'Three booking options. (1) Free 30-min consultation where we map your options and pick a path. (2) Free security scan, send a URL and get 3 findings in 48h. (3) Free automation audit, 45 min to scope the agent you need.',
    section: null,
    link: '/book',
  },
  {
    keywords: ['not sure', 'help me decide', 'which one', 'dont know', "don't know", 'recommend', 'suggest'],
    answer: 'Book the free 30-min call. I listen, map the gaps, and tell you which path fits. If neither fits, I tell you that too. No pitch deck, no commitment.',
    section: null,
    link: '/book',
  },
  {
    keywords: ['klyntar', 'klynter', 'security platform', 'red team', 'offensive security'],
    answer: 'Klyntar is my security platform. 25+ exploit signatures, 45+ scanners detected by behavior. Zero-FP gate drops findings without a working exploit. Asset Shield vault, BeyondMythos enrichment. Frontier-level vulnerability discovery, tuned for AI-era stacks.',
    section: 'products',
    link: '/security',
  },
  {
    keywords: ['mythos', 'frontier', 'anthropic security'],
    answer: 'My scan depth is comparable to frontier-AI vulnerability discovery (the public benchmark here is the Project Mythos level from Anthropic). I tune the discovery for your specific stack rather than a generic crawl.',
    section: 'products',
  },
  {
    keywords: ['ai act', 'eu ai act', 'eu regulation', 'compliance deadline'],
    answer: 'August 2, 2026 is the EU AI Act enforcement deadline. Up to €35M or 7% of global turnover in penalties. I run a fixed 2-week readiness sprint: classification, Article 9/11/12/14 documentation, Daena-wired audit trail. $18k.',
    section: null,
    link: '/ai-act-readiness',
  },
  {
    keywords: ['what is mas-ai', 'mas-ai', 'company', 'who are you', 'about mas', 'tell me about'],
    answer: 'MAS-AI Technologies Inc. is my company. Canadian, federally incorporated. I build governed AI platforms (Daena) and security tools (Klyntar), and I run services: installing AI agents or auditing the AI and stack you already have. Two USPTO patents filed. One solo founder.',
    section: 'hero',
  },
  {
    keywords: ['founder', 'masoud', 'ceo', 'who built', 'team'],
    answer: 'MAS-AI was founded by Masoud Masoori, a solo technical founder and senior AI/ML architect based in Ontario, Canada. He built MAS-AI from zero with two patent-pending architectures.',
    section: 'credibility',
  },
  {
    keywords: ['daena', 'product', 'platform', 'flagship', 'what is daena'],
    answer: 'Daena is our flagship platform: a governance-first AI agent orchestration system. It coordinates multiple AI agents with built-in policy enforcement, auditable memory, and a 10-stage execution pipeline. Want the full details?',
    section: 'products',
    link: 'https://daena.mas-ai.co',
  },
  {
    keywords: ['governance', 'governed', 'policy', 'audit', 'trust'],
    answer: 'Governance is at the core of everything we build. Our AI agents operate within policy-enforced pipelines where every decision is traced and auditable. No black boxes.',
    section: 'products',
  },
  {
    keywords: ['patent', 'ip', 'philattice', 'nbmf', 'architecture', 'memory'],
    answer: 'We have two USPTO provisional patents pending: PhiLattice Architecture (our scalable agent topology) and NBMF (Neural-Backed Memory Fabric, our auditable memory system).',
    section: 'credibility',
  },
  {
    keywords: ['products', 'portfolio', 'build', 'built', 'what do you', 'what you built', 'what are you doing', 'projects', 'what have you', 'show me', 'your work'],
    answer: 'We build across multiple verticals: Daena (AI orchestration), ContentOPS (content automation), Med Smart (healthcare AI), Construction AI (building compliance), Daena Guard (AI security), and more.',
    section: 'portfolio',
  },
  {
    keywords: ['contentops', 'content'],
    answer: 'ContentOPS is our autonomous content operations engine. It scrapes, generates, and publishes content across platforms using self-coordinating agents.',
    section: 'portfolio',
  },
  {
    keywords: ['medsmart', 'med smart', 'healthcare', 'medical'],
    answer: 'Med Smart is our AI-powered medical diagnosis and patient care management system.',
    section: 'portfolio',
  },
  {
    keywords: ['construction', 'building', 'permits'],
    answer: 'Construction AI handles building code compliance, permit analysis, and project management using AI.',
    section: 'portfolio',
  },
  {
    keywords: ['enterprise', 'deploy', 'b2b', 'business', 'work with', 'services', 'consulting'],
    answer: 'We help enterprises deploy governed AI agent systems. Our services include: AI agent system deployment, enterprise governance integration, and AI architecture consulting using patent-pending PhiLattice principles.',
    section: 'enterprise',
  },
  {
    keywords: ['industries', 'serve', 'clients', 'who use', 'sectors'],
    answer: 'We build for enterprise operations, healthcare, construction, content operations, security, and compliance-heavy industries where governance and auditability are essential.',
    section: 'enterprise',
  },
  {
    keywords: ['google', 'startups', 'azure', 'gcp', 'credits', 'programs'],
    answer: "We're accepted into the Google for Startups Cloud Program, have Azure for Startups and GCP credits secured, and are approved for Perplexity for Startups.",
    section: 'credibility',
  },
  {
    keywords: ['test', 'demo', 'proof', 'working', 'ready'],
    answer: 'Daena has 300+ automated tests passing, 6/6 end-to-end Playwright tests, and a working demo. We are in the commercialization phase.',
    section: 'products',
  },
  {
    keywords: ['contact', 'email', 'call', 'reach', 'book', 'talk', 'meet', 'schedule'],
    answer: "You can reach us at masoud.masoori@mas-ai.co or connect on LinkedIn. We'd love to discuss how governed AI can work for your organization.",
    section: 'contact',
  },
  {
    keywords: ['invest', 'funding', 'investor', 'raise', 'pitch'],
    answer: 'For investment inquiries, please reach out directly to masoud.masoori@mas-ai.co. We can share our pitch deck and discuss our roadmap.',
    section: 'contact',
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
    section: 'products',
  },
  {
    keywords: ['how many', 'size', 'employees', 'people work'],
    answer: 'MAS-AI is currently a solo-founder company. Masoud Masoori is the technical founder and CEO, building the entire platform and product suite.',
    section: 'credibility',
  },
  {
    keywords: ['where', 'location', 'based', 'canada', 'ontario', 'office'],
    answer: 'MAS-AI Technologies Inc. is based in Ontario, Canada. We were incorporated in January 2026.',
    section: 'credibility',
  },
  {
    keywords: ['pricing', 'cost', 'price', 'how much', 'free'],
    answer: 'Daena is currently in advanced development. For pricing and early access, please contact us at masoud.masoori@mas-ai.co.',
    section: 'contact',
  },
  // TECHNOLOGY / INNOVATION
  {
    keywords: ['innovation', 'innovative', 'new', 'different', 'unique', 'special'],
    answer: 'Our key innovations are two patent-pending architectures: PhiLattice (Fibonacci-based agent topology for scalable orchestration) and NBMF (Neural-Backed Memory Fabric for persistent, auditable agent memory). No other platform has governance built directly into the execution layer.',
    section: 'credibility',
  },
  {
    keywords: ['how it works', 'explain', 'how does it', 'tell me more', 'details'],
    answer: 'At a high level: Daena coordinates AI agents through a 10-stage governed pipeline. Every agent action passes through SecurityGate, GovernanceEngine, ReasoningCore, and AuditLog before reaching output. For the full technical deep-dive, visit daena.mas-ai.co.',
    section: 'products',
    link: 'https://daena.mas-ai.co',
  },
  {
    keywords: ['security', 'safe', 'secure', 'protect', 'risk'],
    answer: 'Security is the first stage of our pipeline (SecurityGate). Every input is screened before processing. Combined with policy enforcement at the GovernanceEngine stage and full audit logging, Daena provides enterprise-grade security for AI operations.',
    section: 'products',
  },
  {
    keywords: ['agent', 'agents', 'multi-agent', 'autonomous', 'orchestrat'],
    answer: 'Daena orchestrates multiple AI agents as governed departments. Each agent operates within policy boundaries, shares auditable memory via NBMF, and coordinates through the PhiLattice topology. Think of it as a governed operating system for AI workforces.',
    section: 'products',
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
    section: 'enterprise',
  },
  {
    keywords: ['why', 'why mas-ai', 'why daena', 'why choose', 'advantage', 'benefit'],
    answer: 'Three reasons: (1) Governance built into the execution layer, not bolted on. (2) Persistent auditable memory via NBMF, so every decision is traceable. (3) PhiLattice topology for scalable multi-agent coordination. Two patent-pending architectures protect this moat.',
    section: 'products',
  },

  // HIRING / CAREERS
  {
    keywords: ['hiring', 'job', 'career', 'work for', 'join', 'open position', 'role'],
    answer: 'We are always looking for exceptional engineers and AI researchers. Reach out to masoud.masoori@mas-ai.co with your background and what excites you about governed AI.',
    section: 'contact',
  },

  // OPEN SOURCE
  {
    keywords: ['open source', 'github', 'code', 'repo', 'repository', 'source code'],
    answer: 'Some of our projects are open source on GitHub. Check out github.com/Mas-AI-Official for our public repositories including ContentOPS and other tools.',
    section: 'portfolio',
    link: 'https://github.com/Mas-AI-Official',
  },

  // TIMELINE / AVAILABILITY
  {
    keywords: ['when', 'launch', 'release', 'timeline', 'available', 'waitlist', 'early access'],
    answer: 'Daena is in advanced development with 300+ tests passing and a working demo. We are onboarding early access partners now. Contact us to discuss pilot opportunities.',
    section: 'contact',
  },

  // PARTNERSHIPS
  {
    keywords: ['partner', 'partnership', 'collaborate', 'integration', 'integrate'],
    answer: 'We welcome partnerships with enterprises, system integrators, and technology providers. Reach out at masoud.masoori@mas-ai.co to explore collaboration opportunities.',
    section: 'contact',
  },

  // COMPLIANCE / REGULATION
  {
    keywords: ['compliance', 'regulation', 'regulatory', 'gdpr', 'hipaa', 'sox', 'legal'],
    answer: 'Daena is designed for regulated industries. The 10-stage pipeline enforces policies at execution time, NBMF provides complete audit trails, and every decision is traceable. This is built for finance, healthcare, legal, and other compliance-heavy sectors.',
    section: 'enterprise',
  },

  // DEMO / TRY
  {
    keywords: ['try', 'see', 'demo', 'video', 'watch', 'preview', 'look'],
    answer: 'You can explore our working demo and video walkthrough on the Daena product page. We also offer live technical walkthroughs for qualified prospects.',
    section: 'products',
    link: 'https://daena.mas-ai.co',
  },

  // DAENA GUARD
  {
    keywords: ['guard', 'daena guard', 'security layer', 'protection'],
    answer: 'Daena Guard is our AI security and governance layer for enterprise agent deployments. It is currently in development as part of the MAS-AI product suite.',
    section: 'portfolio',
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
    answer: "I can tell you about: our company, Daena platform, portfolio of products, enterprise services, patents, founder, pricing, careers, and more. Just ask!",
    section: null,
  },
  {
    keywords: ['funny', 'joke', 'laugh', 'humor'],
    answer: "I'm better at explaining governed AI than telling jokes. But here's a thought: an AI without governance is like a car without brakes. Fast, but you won't like the destination.",
    section: null,
  },
]

const FALLBACK = "I'm not sure about that one. For detailed questions, you can email masoud.masoori@mas-ai.co. Or try asking about our products, services, or team!"

function findBestMatch(input: string): KnowledgeEntry | null {
  const lower = input.toLowerCase().trim()
  let bestScore = 0
  let bestEntry: KnowledgeEntry | null = null
  for (const entry of knowledge) {
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

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (!el) return
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.classList.add('section-highlight')
    setTimeout(() => el.classList.remove('section-highlight'), 1500)
  }, 500)
}

// ─── Chat Message ───────────────────────────────────────────────────────────

interface ChatMessage {
  role: 'daena' | 'user'
  text: string
  link?: string
  section?: string | null
}

const EASE: [number, number, number, number] = [0, 0, 0.2, 1]

// ─── Component ──────────────────────────────────────────────────────────────

export default function DaenaGuide() {
  const [activeSection, setActiveSection] = useState('hero')
  const [chatOpen, setChatOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'daena',
      text: "Hi! I'm Daena. I can tell you about MAS-AI, our products, and how we help enterprises deploy governed AI. What would you like to know?",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevSection = useRef('hero')
  const hasGreeted = useRef(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)

    // Show welcome greeting on first page load (after 1.5s)
    if (!hasGreeted.current) {
      hasGreeted.current = true
      const greetTimer = setTimeout(() => {
        setShowBubble(true)
        if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
        bubbleTimer.current = setTimeout(() => setShowBubble(false), 3500)
      }, 1500)
      return () => clearTimeout(greetTimer)
    }
  }, [])

  // Section tracking (single threshold, debounced to prevent duplicates)
  useEffect(() => {
    const sections = document.querySelectorAll('section[id], div[id="hero"]')
    const observer = new IntersectionObserver(
      (entries) => {
        // Only consider the entry with highest ratio
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry
          }
        }
        if (best) {
          const id = best.target.id
          if (id && id !== prevSection.current) {
            // Debounce: wait 200ms before changing section to prevent rapid switching
            if (debounceTimer.current) clearTimeout(debounceTimer.current)
            debounceTimer.current = setTimeout(() => {
              prevSection.current = id
              setActiveSection(id)
              const mood = SECTION_MOODS[id]
              if (mood?.caption) {
                setShowBubble(true)
                if (bubbleTimer.current) clearTimeout(bubbleTimer.current)
                bubbleTimer.current = setTimeout(() => setShowBubble(false), 3000)
              } else {
                setShowBubble(false)
              }
            }, 200)
          }
        }
      },
      { threshold: 0.4 } // Single threshold to prevent multiple fires
    )
    sections.forEach((s) => observer.observe(s))
    return () => {
      observer.disconnect()
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus()
  }, [chatOpen])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [...prev.slice(-48), { role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const match = findBestMatch(text)
      const msg: ChatMessage = {
        role: 'daena',
        text: match?.answer || FALLBACK,
        link: match?.link,
        section: match?.section,
      }
      setMessages((prev) => [...prev, msg])
      setTyping(false)
      if (match?.section) scrollToSection(match.section)
    }, 300)
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const mood = SECTION_MOODS[activeSection] || DEFAULT_MOOD
  const avatarSize = isMobile ? 'w-12 h-16' : 'w-20 h-28'

  // Klyntar mode activates when the user is on a security-adjacent surface:
  // the /security route, the AI Act page (security-adjacent), or when the
  // chat is discussing security/Klyntar (mood glow flips red). Same character,
  // security mode on.
  const [pathname, setPathname] = useState('/')
  useEffect(() => {
    if (typeof window === 'undefined') return
    const update = () => setPathname(window.location.pathname)
    update()
    // Pick up client-side navigations
    window.addEventListener('popstate', update)
    // Next.js App Router: listen for click on any <a> that changes the path
    const onClick = () => setTimeout(update, 50)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', update)
      document.removeEventListener('click', onClick)
    }
  }, [])

  const onSecurityRoute =
    pathname.startsWith('/security') || pathname.startsWith('/ai-act-readiness')
  // Red-tinted section moods signal security context even on the homepage
  const redMood = mood.glow === '#ff4060' || mood.glow.toLowerCase().startsWith('#ff4')
  const klyntarMode = onSecurityRoute || redMood
  // Chatbot uses the full-body Daena avatar (looks right at small size).
  // Swap to the half-face Klyntar portrait when on security surfaces.
  // Framing mismatch is intentional: full body = calm, close-up = intensity.
  const avatarSrc = klyntarMode
    ? '/assets/img/klyntar-avatar.png'
    : '/assets/img/daena-nobg.png'
  const avatarLabel = klyntarMode ? 'Klyntar, security mode' : 'Daena, AI guide'

  return (
    <>
      {/* Avatar + speech bubble */}
      <div
        className={`fixed z-50 flex flex-col items-end gap-2 ${
          isMobile ? 'bottom-4 right-3 w-12' : 'bottom-6 right-6 w-20'
        }`}
      >
        {/* Speech bubble: only when chat is CLOSED */}
        <AnimatePresence mode="wait">
          {showBubble && !chatOpen && mood.caption && (
            <motion.div
              key={mood.caption}
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div
                className="rounded-xl px-4 py-2 text-xs font-medium text-center leading-snug max-w-[140px]"
                style={{
                  background: 'rgba(8,11,20,0.92)',
                  border: `1px solid ${mood.glow}30`,
                  color: mood.glow,
                  boxShadow: `0 0 20px ${mood.glow}15`,
                }}
              >
                {mood.caption}
              </div>
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full" style={{ background: mood.glow + '40' }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: mood.glow + '25' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar. swaps between Daena and Klyntar based on context. */}
        <div
          onClick={() => setChatOpen(!chatOpen)}
          className={`${avatarSize} cursor-pointer relative`}
          style={{
            filter: `brightness(${mood.brightness}) drop-shadow(0 0 12px ${mood.glow}30)`,
            transition: 'filter 0.6s ease',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={avatarSrc}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={avatarSrc}
                alt={avatarLabel}
                width={200}
                height={280}
                className="object-cover object-top w-full h-full"
                priority
                onError={(e) => {
                  // Fallback to Daena if Klyntar image is not saved yet
                  const target = e.currentTarget as HTMLImageElement
                  if (target.src.includes('klyntar-avatar')) {
                    target.src = '/assets/img/daena-avatar-new.png'
                  }
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Chat Panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE }}
            role="dialog"
            aria-label="Chat with Daena"
            className={`fixed z-50 flex flex-col overflow-hidden rounded-2xl border ${
              isMobile
                ? 'bottom-24 right-4 left-4 max-h-[60vh]'
                : 'bottom-40 right-6 w-80 max-h-[420px]'
            }`}
            style={{
              background: '#0a0e1a',
              borderColor: `${mood.glow}20`,
              boxShadow: `0 0 40px ${mood.glow}08, 0 20px 60px rgba(0,0,0,0.5)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Header. avatar mirrors the floating one (Daena / Klyntar). */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ borderBottom: `1px solid ${mood.glow}15` }}
            >
              <div
                className="w-8 h-8 rounded-full overflow-hidden border shrink-0"
                style={{ borderColor: `${mood.glow}30` }}
              >
                <Image
                  src={avatarSrc}
                  alt={avatarLabel}
                  width={32}
                  height={32}
                  className="object-cover object-top"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    if (target.src.includes('klyntar-avatar')) {
                      target.src = '/assets/img/daena-avatar-new.png'
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)]">
                  {klyntarMode ? 'Klyntar' : 'Daena'}
                </p>
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)]" style={{ color: mood.glow }}>
                  {klyntarMode ? 'Security Mode' : 'AI Guide'}
                </p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-[var(--color-mas-text-muted)] hover:text-white p-1" aria-label="Close chat">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" role="log" style={{ minHeight: 0 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white/[0.07] text-[var(--color-mas-text)]'
                        : 'text-[var(--color-mas-text-secondary)]'
                    }`}
                    style={msg.role === 'daena' ? { background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.08)' } : undefined}
                  >
                    {msg.text}
                    {msg.link && (
                      <a href={msg.link} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1 text-xs font-semibold" style={{ color: mood.glow }}>
                        Visit <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-2 flex gap-1" style={{ background: 'rgba(0,200,255,0.04)', border: '1px solid rgba(0,200,255,0.08)' }}>
                    {[0, 1, 2].map((d) => (
                      <div key={d} className="w-1.5 h-1.5 rounded-full bg-[var(--color-mas-cyan)]" style={{ animation: `pulse 1s ease-in-out ${d * 0.15}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 px-3 py-3 flex items-center gap-2" style={{ borderTop: `1px solid ${mood.glow}10` }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about MAS-AI..."
                aria-label="Type your question"
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[var(--color-mas-text)] placeholder:text-[var(--color-mas-text-muted)] outline-none focus:border-[var(--color-mas-cyan)]/30"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="Send message"
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
                style={{ backgroundColor: mood.glow + '20', color: mood.glow }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
