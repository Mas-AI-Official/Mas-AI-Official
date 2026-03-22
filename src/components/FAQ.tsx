'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, MessageCircleQuestion } from 'lucide-react'

// --- Data -------------------------------------------------------------------

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is MAS-AI Technologies?',
    answer:
      'MAS-AI Technologies Inc. is a Canadian AI company building governed AI systems for enterprises. We develop platforms, products, and deployment services for organizations that need trustworthy, auditable AI agent systems.',
  },
  {
    question: 'What is Daena?',
    answer:
      'Daena is our flagship platform: a governance-first AI agent orchestration system with auditable memory and traceable decisions. Explore it at daena.mas-ai.co.',
  },
  {
    question: 'Does MAS-AI work with enterprises?',
    answer:
      'Yes. We help medium and large enterprises deploy AI agent systems with built-in governance, audit trails, and policy enforcement. We offer system deployment, governance integration, and architecture consulting.',
  },
  {
    question: 'What industries do you serve?',
    answer:
      'We build AI products across enterprise operations, healthcare, construction, content operations, and security. Our focus is regulated industries where governance and auditability are essential.',
  },
  {
    question: 'Is Daena available for deployment?',
    answer:
      'Daena is currently in advanced development with 300+ automated tests passing and a working demo. Contact us to discuss early access and pilot opportunities.',
  },
]

// --- JSON-LD ----------------------------------------------------------------

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

// --- Variants ---------------------------------------------------------------

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const answerVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  expanded: {
    height: 'auto' as const,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

// --- Component --------------------------------------------------------------

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-60px' })

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faq" className="relative px-6 py-16 md:py-24">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-sm uppercase tracking-widest font-[family-name:var(--font-mono)] text-[var(--color-mas-cyan)]">
            FAQ
          </p>
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-mas-text-secondary)]">
            Common questions about MAS-AI Technologies and our platform.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`glass overflow-hidden rounded-xl transition-all duration-300 group ${
                  isOpen
                    ? 'border-l-2 border-l-[var(--color-mas-cyan)] shadow-[0_0_20px_rgba(0,200,255,0.06)]'
                    : 'hover:border-[var(--color-mas-cyan)]/20'
                }`}
              >
                {/* Question row */}
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold font-[family-name:var(--font-mono)] shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: isOpen ? 'rgba(0,200,255,0.12)' : 'rgba(255,255,255,0.03)',
                        color: isOpen ? 'var(--color-mas-cyan)' : 'var(--color-mas-text-muted)',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-display text-base font-semibold sm:text-lg transition-colors duration-200 ${isOpen ? 'text-white' : 'text-[var(--color-mas-text)]'}`}>
                      {faq.question}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 transition-colors duration-200"
                    style={{ color: isOpen ? 'var(--color-mas-cyan)' : 'var(--color-mas-text-muted)' }}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      variants={answerVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-[4.5rem] text-sm leading-relaxed text-[var(--color-mas-text-secondary)] sm:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[var(--color-mas-text-muted)] mb-4">
            Still have questions?
          </p>
          <a
            href="#contact"
            className="btn-ripple inline-flex items-center gap-2 rounded-full border border-[var(--color-mas-cyan)]/30 px-6 py-2.5 text-sm font-semibold text-[var(--color-mas-cyan)] transition-all hover:bg-[var(--color-mas-cyan)]/10 hover:shadow-[0_0_20px_var(--color-mas-cyan-glow)]"
          >
            <MessageCircleQuestion className="h-4 w-4" />
            <span className="relative z-10">Contact Us</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
