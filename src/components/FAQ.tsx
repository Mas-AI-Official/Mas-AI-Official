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
    <section id="faq" className="relative px-6 py-20 md:py-32">
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
                className={`glass overflow-hidden rounded-xl transition-colors ${
                  isOpen ? 'border-l-2 border-l-[var(--color-mas-cyan)]' : ''
                }`}
              >
                {/* Question row */}
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-[var(--color-mas-text)] sm:text-lg">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-[var(--color-mas-text-muted)]"
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
                      <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--color-mas-text-secondary)] sm:text-base">
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
