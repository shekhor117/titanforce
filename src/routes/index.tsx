import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: TitanForceHome,
})

const players = [
  { number: 1, name: 'Shuronjit', position: 'Goalkeeper' },
  { number: 3, name: 'Srijon', position: 'CB / RB' },
  { number: 4, name: 'Akash', position: 'CB / LB' },
  { number: 5, name: 'Akash', position: 'CB / CDM' },
  { number: 6, name: 'Sujon', position: 'CAM' },
  { number: 7, name: 'Shuvo', position: 'LW / RW / CAM' },
  { number: 8, name: 'Sojib', position: 'CM / CAM' },
  { number: 9, name: 'Sajon', position: 'ST / LW / CAM' },
  { number: 11, name: 'Kourov', position: 'ST / LW / RW' },
  { number: 17, name: 'Shekhor', position: 'CB / CM / CAM' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function PlayerCard({ player, delay }: { player: typeof players[0]; delay: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="player-card"
      style={{
        transitionDelay: inView ? `${delay}ms` : '0ms',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.96)',
      }}
    >
      <div className="player-number">{player.number}</div>
      <div className="player-divider" />
      <div className="player-name">{player.name}</div>
      <div className="player-position">{player.position}</div>
      <div className="card-corner-tl" />
      <div className="card-corner-br" />
    </div>
  )
}

export default function TitanForceHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const aboutSection = useInView()
  const matchSection = useInView()
  const contactSection = useInView()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --red: #ff0000;
          --red-dim: #cc0000;
          --red-glow: rgba(255,0,0,0.25);
          --bg-deep: #080808;
          --bg-base: #111111;
          --bg-card: #161616;
          --bg-elevated: #1e1e1e;
          --text-primary: #f5f5f5;
          --text-muted: #888;
          --border: rgba(255,255,255,0.07);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg-deep);
          color: var(--text-primary);
          font-family: 'Barlow', sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* ── PITCH TEXTURE ── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.018) 59px, rgba(255,255,255,0.018) 60px),
            repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.018) 59px, rgba(255,255,255,0.018) 60px);
          pointer-events: none;
          z-index: 0;
        }

        /* ── NAVBAR ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 2px solid var(--red);
          transition: box-shadow 0.3s;
        }
        .navbar.scrolled {
          box-shadow: 0 4px 32px rgba(255,0,0,0.18);
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 64px;
        }
        .nav-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--red);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          user-select: none;
        }
        .nav-links {
          display: flex;
          gap: 8px;
          list-style: none;
        }
        .nav-links a {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-muted);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 8px 14px;
          border-radius: 2px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-links a:hover {
          color: var(--red);
          background: rgba(255,0,0,0.08);
        }
        .nav-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          background: none;
          border: none;
        }
        .nav-burger span {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text-primary);
          transition: transform 0.3s, opacity 0.3s;
        }
        .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-burger.open span:nth-child(2) { opacity: 0; }
        .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .nav-mobile {
          display: none;
          position: absolute;
          top: 64px; left: 0; right: 0;
          background: rgba(8,8,8,0.98);
          border-bottom: 2px solid var(--red);
          padding: 12px 0;
        }
        .nav-mobile.open { display: block; }
        .nav-mobile a {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-muted);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 14px 32px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-mobile a:hover { color: var(--red); background: rgba(255,0,0,0.06); }

        @media (max-width: 640px) {
          .nav-links { display: none; }
          .nav-burger { display: flex; }
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding-top: 64px;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,0,0,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 80%, rgba(255,0,0,0.06) 0%, transparent 60%),
            linear-gradient(180deg, #0a0a0a 0%, #080808 100%);
        }
        .hero-field-lines {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background:
            radial-gradient(circle at 50% 50%, transparent 28%, rgba(255,255,255,0.3) 29%, rgba(255,255,255,0.3) 30%, transparent 31%),
            linear-gradient(90deg, transparent 49.6%, rgba(255,255,255,0.4) 49.6%, rgba(255,255,255,0.4) 50.4%, transparent 50.4%),
            linear-gradient(0deg, transparent 4.9%, rgba(255,255,255,0.2) 4.9%, rgba(255,255,255,0.2) 5.1%, transparent 5.1%),
            linear-gradient(0deg, transparent 94.9%, rgba(255,255,255,0.2) 94.9%, rgba(255,255,255,0.2) 95.1%, transparent 95.1%);
        }
        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 40px 24px;
          max-width: 900px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,0,0,0.12);
          border: 1px solid rgba(255,0,0,0.4);
          padding: 6px 16px;
          border-radius: 2px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 28px;
          animation: fadeDown 0.8s ease both;
        }
        .hero-badge::before {
          content: '';
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--red);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
        .hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(3rem, 10vw, 7.5rem);
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 8px;
          animation: fadeUp 0.9s 0.1s ease both;
        }
        .hero-title-red { color: var(--red); }
        .hero-subtitle {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.4rem, 4vw, 2.8rem);
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 32px;
          animation: fadeUp 0.9s 0.2s ease both;
        }
        .hero-tagline {
          font-size: 1.1rem;
          color: rgba(245,245,245,0.6);
          font-weight: 300;
          letter-spacing: 0.03em;
          max-width: 540px;
          margin: 0 auto 40px;
          animation: fadeUp 0.9s 0.3s ease both;
        }
        .hero-cta {
          display: inline-flex;
          gap: 16px;
          animation: fadeUp 0.9s 0.4s ease both;
          flex-wrap: wrap;
          justify-content: center;
        }
        .btn-primary {
          background: var(--red);
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: none;
          cursor: pointer;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .btn-primary:hover {
          background: var(--red-dim);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,0,0,0.35);
        }
        .btn-secondary {
          background: transparent;
          color: var(--text-primary);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 13px 32px;
          border: 1px solid rgba(255,255,255,0.25);
          cursor: pointer;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .btn-secondary:hover {
          border-color: var(--red);
          color: var(--red);
          transform: translateY(-2px);
        }
        .hero-scroll-hint {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: fadeUp 1s 0.8s ease both;
        }
        .scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, transparent, var(--red));
          animation: scrollLine 1.8s ease infinite;
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
        .scroll-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* ── SECTION COMMON ── */
        .section {
          position: relative;
          z-index: 1;
          padding: 100px 24px;
        }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: var(--red);
        }
        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 0.95;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }

        /* ── ABOUT ── */
        .about-section {
          background: linear-gradient(135deg, #111 0%, #0e0e0e 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .about-text {
          font-size: 1.2rem;
          font-weight: 300;
          color: rgba(245,245,245,0.75);
          line-height: 1.8;
          border-left: 3px solid var(--red);
          padding-left: 24px;
        }
        .about-text strong { color: var(--text-primary); font-weight: 600; }
        .about-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }
        .stat-box {
          background: var(--bg-card);
          padding: 28px 24px;
          border: 1px solid var(--border);
          transition: border-color 0.3s;
        }
        .stat-box:hover { border-color: rgba(255,0,0,0.4); }
        .stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          color: var(--red);
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        /* ── SQUAD ── */
        .squad-section { background: var(--bg-deep); }
        .squad-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
          margin-top: 56px;
        }
        .player-card {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--red);
          padding: 28px 20px 24px;
          text-align: center;
          cursor: default;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s, border-color 0.3s, opacity 0.5s, background 0.3s;
          overflow: hidden;
        }
        .player-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,0,0,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .player-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 16px 48px rgba(255,0,0,0.22), 0 0 0 1px var(--red);
          border-color: var(--red);
          background: #1b1010;
        }
        .player-card:hover::before { opacity: 1; }
        .card-corner-tl, .card-corner-br {
          position: absolute;
          width: 12px; height: 12px;
        }
        .card-corner-tl {
          top: -1px; left: -1px;
          border-top: 2px solid #fff;
          border-left: 2px solid #fff;
        }
        .card-corner-br {
          bottom: -1px; right: -1px;
          border-bottom: 2px solid #fff;
          border-right: 2px solid #fff;
        }
        .player-number {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 3.8rem;
          font-weight: 900;
          color: var(--red);
          line-height: 1;
          margin-bottom: 10px;
          text-shadow: 0 0 40px rgba(255,0,0,0.3);
          transition: text-shadow 0.3s;
        }
        .player-card:hover .player-number {
          text-shadow: 0 0 60px rgba(255,0,0,0.6);
        }
        .player-divider {
          width: 32px;
          height: 2px;
          background: var(--red);
          margin: 0 auto 12px;
          transition: width 0.3s;
        }
        .player-card:hover .player-divider { width: 56px; }
        .player-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .player-position {
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          background: rgba(255,255,255,0.05);
          padding: 3px 8px;
          border-radius: 2px;
          display: inline-block;
        }

        /* ── MATCHES ── */
        .matches-section {
          background: linear-gradient(180deg, #0e0e0e 0%, #111 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .match-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-top: 3px solid var(--red);
          padding: 48px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          max-width: 800px;
          margin: 56px auto 0;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .match-card:hover {
          border-color: rgba(255,0,0,0.5);
          box-shadow: 0 8px 48px rgba(255,0,0,0.12);
        }
        .match-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 3px;
          background: linear-gradient(90deg, var(--red), transparent);
        }
        .match-team {
          text-align: center;
          flex: 1;
        }
        .match-team-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .match-team-name.home { color: var(--red); }
        .match-vs {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          padding: 0 16px;
          flex-shrink: 0;
        }
        .match-date {
          text-align: center;
          margin-top: 32px;
        }
        .match-date-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .match-date-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--red);
        }
        @media (max-width: 540px) {
          .match-card { flex-direction: column; text-align: center; padding: 32px 24px; }
        }

        /* ── CONTACT ── */
        .contact-section { background: var(--bg-deep); }
        .contact-box {
          max-width: 640px;
          margin: 56px auto 0;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--red);
          padding: 48px 40px;
          text-align: center;
          transition: box-shadow 0.3s;
        }
        .contact-box:hover {
          box-shadow: 0 8px 48px rgba(255,0,0,0.1);
        }
        .contact-icon {
          width: 56px; height: 56px;
          background: rgba(255,0,0,0.1);
          border: 1px solid rgba(255,0,0,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .contact-icon svg { width: 24px; height: 24px; fill: var(--red); }
        .contact-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }
        .contact-email {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
          display: inline-block;
          word-break: break-all;
        }
        .contact-email:hover { color: var(--red); }
        .contact-subtitle {
          margin-top: 12px;
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 300;
        }

        /* ── FOOTER ── */
        .footer {
          background: #050505;
          border-top: 2px solid var(--red);
          padding: 28px 24px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .footer-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .footer-text span { color: var(--red); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-in.visible { opacity: 1 !important; transform: translateY(0) !important; }

        /* ── DIVIDER ── */
        .red-divider {
          width: 64px; height: 3px;
          background: var(--red);
          margin-bottom: 24px;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollTo('hero')}>
            ⚽ Titan Force
          </div>
          <ul className="nav-links">
            {['Home', 'Squad', 'Matches', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()) }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <button
            className={`nav-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
          {['Home', 'Squad', 'Matches', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()) }}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-bg" />
        <div className="hero-field-lines" />
        <div className="hero-content">
          <div className="hero-badge">Mulikandi, Sylhet — Est. Football Club</div>
          <h1 className="hero-title">
            Welcome to<br />
            <span className="hero-title-red">Titan Force</span>
          </h1>
          <p className="hero-subtitle">Mulikandi Football Team</p>
          <p className="hero-tagline">
            Heart. Teamwork. Pride. We are Titan Force — built from the streets of Mulikandi, united by the beautiful game.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo('squad')}>
              View Squad
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('matches')}>
              Next Match
            </button>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span className="scroll-label">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section about-section">
        <div
          ref={aboutSection.ref}
          className="section-inner"
          style={{
            opacity: aboutSection.inView ? 1 : 0,
            transform: aboutSection.inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="about-grid">
            <div>
              <div className="section-label">About the Club</div>
              <h2 className="section-title">Our<br />Story</h2>
              <div className="red-divider" />
              <p className="about-text">
                We are a <strong>passionate football club</strong> from Mulikandi, Sylhet.
                We play with <strong>heart, teamwork, and pride</strong> — representing our community
                on every pitch we set foot on. Titan Force is more than a team; it's a brotherhood
                forged through dedication to the beautiful game.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-box">
                <div className="stat-num">10</div>
                <div className="stat-label">Squad Players</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">1</div>
                <div className="stat-label">Club Motto</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">SYL</div>
                <div className="stat-label">Sylhet Based</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">∞</div>
                <div className="stat-label">Ambition</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SQUAD */}
      <section id="squad" className="section squad-section">
        <div className="section-inner">
          <div className="section-label">Team Roster</div>
          <h2 className="section-title">The<br />Squad</h2>
          <div className="squad-grid">
            {players.map((player, i) => (
              <PlayerCard key={player.number} player={player} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* MATCHES */}
      <section id="matches" className="section matches-section">
        <div
          ref={matchSection.ref}
          className="section-inner"
          style={{
            opacity: matchSection.inView ? 1 : 0,
            transform: matchSection.inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="section-label">Upcoming Fixture</div>
          <h2 className="section-title">Next<br />Match</h2>
          <div className="match-card">
            <div className="match-team">
              <div className="match-team-name home">Titan<br />Force</div>
            </div>
            <div className="match-vs">VS</div>
            <div className="match-team">
              <div className="match-team-name">Zakigonj<br />XI</div>
            </div>
          </div>
          <div className="match-date">
            <div className="match-date-label">Date</div>
            <div className="match-date-value">Coming Soon</div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section contact-section">
        <div
          ref={contactSection.ref}
          className="section-inner"
          style={{
            opacity: contactSection.inView ? 1 : 0,
            transform: contactSection.inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title">Contact<br />Us</h2>
          <div className="contact-box">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <div className="contact-label">Email Us</div>
            <a href="mailto:titanforce.mulikandi@gmail.com" className="contact-email">
              titanforce.mulikandi@gmail.com
            </a>
            <p className="contact-subtitle">
              Reach out for matches, partnerships, or general enquiries.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-text">
          &copy; 2026 <span>Titan Force</span> | All Rights Reserved ⚽
        </p>
      </footer>
    </>
  )
}
