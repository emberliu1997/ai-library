import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const PEOPLE = [
  { name: 'Andrej Karpathy', handle: '@karpathy', platform: 'X / YouTube', url: 'https://x.com/karpathy', annotation: 'The most generous technical educator in AI. Follow to understand how models actually work.', tags: ['Education', 'LLMs'] },
  { name: 'Simon Willison', handle: '@simonw', platform: 'X / Blog', url: 'https://x.com/simonw', annotation: 'Follow to see what building with LLMs looks like in daily practice.', tags: ['Building', 'Tools'] },
  { name: 'Hamel Husain', handle: '@HamelHusain', platform: 'X', url: 'https://x.com/HamelHusain', annotation: 'The evals expert. Best signal on measuring and improving AI products.', tags: ['Evals', 'MLOps'] },
  { name: 'Jenny Wen', handle: '@jennyblogs', platform: 'X', url: 'https://x.com/jennyblogs', annotation: 'Head of design at Claude. Best signal on the AI × design intersection.', tags: ['Design', 'AI UX'] },
  { name: 'Ethan Mollick', handle: '@emollick', platform: 'X', url: 'https://x.com/emollick', annotation: 'Best researcher on using AI productively at work.', tags: ['Research', 'Strategy'] },
  { name: 'Lenny Rachitsky', handle: '@lennysan', platform: 'X / Newsletter', url: 'https://x.com/lennysan', annotation: 'Deep dives on AI product strategy from someone who talks to everyone building it.', tags: ['Product', 'Strategy'] },
  { name: 'Amanda Askell', handle: '@amandaaskell', platform: 'X', url: 'https://x.com/amandaaskell', annotation: "Guardian of Claude's vibes. Expert on AI personality and character.", tags: ['Design', 'Ethics'] },
  { name: 'Boris Cherny', handle: '@bcherny', platform: 'X', url: 'https://x.com/bcherny', annotation: 'Creator of Claude Code. Sharp thinking on developer tools and AI agents.', tags: ['Agents', 'Dev Tools'] },
  { name: 'Shreya Shankar', handle: '@sh_reya', platform: 'X', url: 'https://x.com/sh_reya', annotation: 'ML engineer doing the most rigorous thinking on AI evals and data pipelines.', tags: ['Evals', 'Research'] },
  { name: 'Ryo Lu', handle: '@ryolu_', platform: 'X', url: 'https://x.com/ryolu_', annotation: 'Head of design at Cursor. Best signal on AI-native product design.', tags: ['Design', 'AI UX'] },
]

const NEWSLETTERS = [
  { name: "Simon Willison's Weblog", url: 'https://simonwillison.net', annotation: 'Daily dispatches from someone who actually builds with LLMs. Best practical signal in AI.', cadence: 'Daily' },
  { name: "Lenny's Newsletter", url: 'https://www.lennysnewsletter.com', annotation: 'Deep-dives on AI product strategy, prompting, and evals from the people shipping it.', cadence: 'Weekly' },
  { name: 'TLDR AI', url: 'https://tldr.tech/ai', annotation: '5-minute daily brief. Use it to stay aware, not to go deep.', cadence: 'Daily' },
  { name: 'Interconnects (Nathan Lambert)', url: 'https://www.interconnects.ai', annotation: 'The clearest writing on how AI models are actually trained and evaluated.', cadence: 'Weekly' },
  { name: 'Latent Space', url: 'https://www.latent.space', annotation: "Technical but accessible. Covers what's actually happening at the AI frontier.", cadence: 'Weekly' },
]

const SHOWS = [
  { name: "Lenny's Podcast", url: 'https://www.lennyspodcast.com', annotation: 'Best show for AI product builders. Every episode is a masterclass in shipping AI.' },
  { name: 'Lex Fridman Podcast', url: 'https://lexfridman.com/podcast', annotation: 'Long-form with the people building AI. Dense but irreplaceable.' },
  { name: 'Dive Club', url: 'https://www.youtube.com/@joindiveclub', annotation: 'Deep dives into AI tools and workflows for designers and builders.' },
  { name: 'UX Coffee', url: 'https://open.spotify.com/show/3Nx0Z9ZkIsJAWg4gGv2tWA', annotation: 'Conversations on UX craft, career, and the future of design.' },
]

function PersonCard({ item, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className="group block rounded-xl p-3.5 relative overflow-hidden"
      style={{ textDecoration: 'none', background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}
      onMouseEnter={(e) => {
        setHovered(true)
        e.currentTarget.style.borderColor = 'rgba(200,151,74,0.25)'
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(200,151,74,0.08), 0 8px 24px rgba(0,0,0,0.4)'
        e.currentTarget.style.background = 'var(--th-surface2)'
      }}
      onMouseLeave={(e) => {
        setHovered(false)
        e.currentTarget.style.borderColor = 'var(--th-border)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.background = 'var(--th-surface)'
      }}
    >
      {/* Amber top line on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,151,74,0.4), transparent)', pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-[13px] font-medium leading-snug" style={{ color: 'var(--th-text)' }}>
          {item.name}
        </p>
        <motion.div animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 4 }} transition={{ duration: 0.15 }}>
          <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: '#C8974A' }} />
        </motion.div>
      </div>

      <p className="text-xs mb-2" style={{ color: 'var(--th-text-2)' }}>
        {item.handle}
        <span style={{ color: 'var(--th-border)', margin: '0 4px' }}>·</span>
        {item.platform}
      </p>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--th-text-3)' }}>
        {item.annotation}
      </p>

      <div className="flex gap-1 mt-2.5 flex-wrap">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium uppercase tracking-widest px-1.5 py-0.5 rounded"
            style={{ color: '#C8974A', background: 'rgba(200,151,74,0.07)', letterSpacing: '0.12em' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}

function NewsletterRow({ item, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group flex items-start gap-4 py-3 border-b"
      style={{ textDecoration: 'none', borderColor: 'var(--th-border-sub)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className="text-[13px] font-medium transition-colors duration-150"
            style={{ color: hovered ? 'var(--th-text)' : 'var(--th-text-2)' }}
          >
            {item.name}
          </p>
          <motion.div animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }} transition={{ duration: 0.15 }}>
            <ExternalLink className="w-3 h-3" style={{ color: '#C8974A' }} />
          </motion.div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--th-text-3)' }}>
          {item.annotation}
        </p>
      </div>
      <span
        className="text-xs font-medium uppercase tracking-widest px-2 py-1 rounded flex-shrink-0 mt-0.5"
        style={{ color: 'var(--th-text-3)', background: 'var(--th-surface2)', letterSpacing: '0.12em' }}
      >
        {item.cadence}
      </span>
    </motion.a>
  )
}

function SectionHeader({ label, count }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: '#C8974A', letterSpacing: '0.16em' }}>
        {label}
      </span>
      {count != null && (
        <span className="text-xs tabular-nums px-1.5 py-0.5 rounded" style={{ color: 'var(--th-text-3)', background: 'var(--th-surface2)' }}>
          {count}
        </span>
      )}
      <div className="flex-1 h-px" style={{ background: 'var(--th-border-sub)' }} />
    </div>
  )
}

export function PeopleIFollow() {
  const { t } = useLanguage()

  return (
    <div className="px-4 sm:px-8 pt-8 sm:pt-10 pb-20">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#C8974A', letterSpacing: '0.18em' }}>
          {t('people_label')}
        </p>
        <h1
          className="text-4xl leading-tight mb-2"
          style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', color: 'var(--th-text)' }}
        >
          {t('people_h1a')}<br />{t('people_h1b')}
        </h1>
        <p className="text-sm max-w-lg" style={{ color: 'var(--th-text-2)', lineHeight: 1.7 }}>
          {t('people_desc')}
        </p>
        <div className="mt-5 h-px" style={{ background: 'linear-gradient(90deg, #C8974A22, transparent)' }} />
      </div>

      {/* Creators — 5-col grid */}
      <section className="mb-14">
        <SectionHeader label={t('section_creators')} count={PEOPLE.length} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {PEOPLE.map((person, i) => (
            <PersonCard key={person.name} item={person} index={i} />
          ))}
        </div>
      </section>

      {/* Podcast shows — 3-col */}
      <section className="mb-14 max-w-2xl">
        <SectionHeader label={t('section_shows')} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SHOWS.map((item, i) => (
            <motion.a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              className="group block rounded-xl p-3.5"
              style={{ textDecoration: 'none', background: 'var(--th-surface)', border: '1px solid var(--th-border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,151,74,0.25)'; e.currentTarget.style.background = 'var(--th-surface2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--th-border)'; e.currentTarget.style.background = 'var(--th-surface)' }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-[13px] font-medium" style={{ color: 'var(--th-text)' }}>{item.name}</p>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" style={{ color: '#C8974A' }} />
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--th-text-3)' }}>{item.annotation}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Newsletters — list view */}
      <section className="max-w-2xl">
        <SectionHeader label={t('section_newsletters')} />
        <div>
          {NEWSLETTERS.map((item, i) => (
            <NewsletterRow key={item.name} item={item} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
