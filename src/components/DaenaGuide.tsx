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
  {
    keywords: ['what is mas-ai', 'mas-ai', 'company', 'who are you', 'about mas', 'tell me about'],
    answer: 'MAS-AI Technologies Inc. is a Canadian AI company building governed AI systems for enterprises. We develop platforms, products, and deployment services for organizations that need trustworthy, auditable AI agents.',
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
    section: 'daena',
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
    section: 'daena',
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
  {
    keywords: ['hello', 'hi', 'hey', 'greet', 'sup', 'yo', 'what up'],
    answer: "Hello! Welcome to MAS-AI. I'm Daena, the AI behind the brand. What would you like to know?",
    section: null,
  },
  {
    keywords: ['thank', 'thanks', 'awesome', 'cool', 'great'],
    answer: 'Happy to help! Feel free to ask anything else about MAS-AI or our products.',
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

        {/* Avatar */}
        <div
          onClick={() => setChatOpen(!chatOpen)}
          className={`${avatarSize} cursor-pointer`}
          style={{
            filter: `brightness(${mood.brightness}) drop-shadow(0 0 12px ${mood.glow}30)`,
            transition: 'filter 0.6s ease',
          }}
        >
          <Image
            src="/assets/img/daena-nobg.png"
            alt="Daena, AI VP of MAS-AI Technologies"
            width={200}
            height={280}
            className="object-cover object-top w-full h-full"
            priority
          />
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
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ borderBottom: `1px solid ${mood.glow}15` }}
            >
              <div
                className="w-8 h-8 rounded-full overflow-hidden border shrink-0"
                style={{ borderColor: `${mood.glow}30` }}
              >
                <Image src="/assets/img/daena-nobg.png" alt="Daena" width={32} height={32} className="object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)]">Daena</p>
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)]" style={{ color: mood.glow }}>AI Guide</p>
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
