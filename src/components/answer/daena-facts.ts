/**
 * Names behind the Daena counts in src/content/facts.ts. Read from the Daena repository on 2026-09-30:
 * ModelProvider enum (10 members), DEFAULT_DEPARTMENTS (10), RoutingMode (3), GovernanceMode (3),
 * and the request pipeline as described in src/content/work.ts. Counts themselves stay in facts.ts.
 */

export const PROVIDER_NAMES = [
  'Anthropic',
  'OpenAI',
  'Google Gemini',
  'Perplexity',
  'Groq',
  'OpenRouter',
  'Together',
  'Qwen Cloud',
  'Ollama (local)',
  'vLLM (local)',
]

export const DEPARTMENT_NAMES = [
  'Engineering',
  'Product',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Research',
  'Legal and Compliance',
  'Skill Governance',
  'Security Operations',
]

export const CAPABILITY_NAMES = ['Mind', 'Eyes', 'Hands', 'Voice', 'Shield', 'Memory']

/** The ten stages of a request, in order (src/content/work.ts, Daena case study). */
export const PIPELINE_STAGES = [
  'Security gate',
  'Session',
  'Intent and risk',
  'Governance check',
  'Cost preflight',
  'Model routing',
  'Memory recall',
  'Request build',
  'Streaming',
  'Persist and audit',
]
