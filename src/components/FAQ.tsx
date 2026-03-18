'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

// --- Data -------------------------------------------------------------------

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What is MAS-AI?',
    answer:
      'MAS-AI Technologies Inc. is a Canadian AI company building Daena, a governance-first multi-agent AI orchestration platform for enterprises. Incorporated in Ontario, January 2026.',
  },
  {
    question: 'What is Daena?',
    answer:
      'Daena is an AI-autonomous company OS that coordinates multiple AI agents with built-in governance, auditable memory (NBMF), and a 10-stage execution pipeline. Every agent action is governed, traced, and auditable.',
  },
  {
    question: 'What is an AI governance platform?',
    answer:
      'An AI governance platform ensures autonomous AI agents operate within defined policies, with audit trails and compliance controls. Daena embeds governance inside the execution layer rather than monitoring from outside.',
  },
  {
    question: 'How is Daena different from AI governance monitoring tools?',
    answer:
      'Most AI governance platforms (Holistic AI, Cranium, Credo AI) monitor existing AI systems for compliance. Daena runs governed AI agents natively. Governance is inside the execution layer, not added after deployment.',
  },
  {
    question: 'What is the PhiLattice Architecture?',
    answer:
      "PhiLattice is MAS-AI's patent-pending topology for scalable multi-agent orchestration. It combines departmental organization (honeycomb structure) with governance-first coordination, enabling agents to collaborate across departments while maintaining policy enforcement.",
  },
  {
    question: 'What is NBMF (Neural-Backed Memory Fabric)?',
    answer:
      "NBMF is MAS-AI's patent-pending memory architecture. It gives AI agents persistent, auditable, queryable memory with full traceability, so every decision and piece of context can be reviewed.",
  },
  {
    question: 'Who is Daena built for?',
    answer:
      'Daena is built for enterprises, AI-native companies, and organizations in regulated industries that need to deploy autonomous AI agents with governance, compliance, and auditability.',
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

const answerVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3 },
  },
  expanded: {
    height: 'auto' as const,
    opacity: 1,
    transition: { duration: 0.3 },
  },
}

// --- Component --------------------------------------------------------------

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="relative px-6 py-20 md:py-32">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-gradient font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className={`glass overflow-hidden rounded-xl transition-colors ${isOpen ? 'border-l-2 border-l-mas-cyan' : ''}`}
              >
                {/* Question row */}
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-mas-text sm:text-lg">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                    className="shrink-0 text-mas-text-muted"
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
                      <div className="px-6 pb-5 text-sm leading-relaxed text-mas-text-secondary sm:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
