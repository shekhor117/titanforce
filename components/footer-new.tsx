'use client'

import { memo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Twitter, Facebook, Instagram, Youtube, Mail } from "lucide-react"

function FooterNewComponent() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Team', href: '/team-squad' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Football',
      links: [
        { label: 'Fixtures', href: '/fixtures-results' },
        { label: 'Players', href: '/team-squad' },
        { label: 'Statistics', href: '/statistics' },
        { label: 'Gallery', href: '/gallery' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Youth Academy', href: '/academy' },
        { label: 'Supporters', href: '/supporters' },
        { label: 'News', href: '/news' },
        { label: 'Events', href: '/events' }
      ]
    }
  ]

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' }
  ]

  return (
    <footer className="relative bg-black/40 border-t border-red-500/20 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          {/* Logo and Description */}
          <div className="grid md:grid-cols-4 gap-8 mb-12 sm:mb-16">
            {/* Brand */}
            <motion.div
              className="md:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="font-display font-black text-2xl sm:text-3xl bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-4">
                TITAN FORCE
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Pride of Mulikandi. Power of the Titans. Building excellence in football.
              </p>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-300 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent my-12 sm:my-16" />

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <motion.p
              className="text-sm text-gray-500 text-center sm:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              © {currentYear} Titan Force Mulikandi. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-red-900/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-900/40 hover:border-red-500/50 transition-all"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </motion.div>

            {/* Contact */}
            <motion.a
              href="mailto:contact@titanforce.com"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
              whileHover={{ x: 4 }}
            >
              <Mail className="w-4 h-4" />
              contact@titanforce.com
            </motion.a>
          </div>
        </div>

        {/* Legal Links */}
        <motion.div
          className="border-t border-red-500/10 px-4 sm:px-6 py-6 max-w-6xl mx-auto flex flex-col sm:flex-row justify-center gap-6 text-xs text-gray-600 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="#" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link href="#" className="hover:text-red-400 transition-colors">Terms of Service</Link>
          <span>•</span>
          <Link href="#" className="hover:text-red-400 transition-colors">Cookie Policy</Link>
        </motion.div>
      </div>
    </footer>
  )
}

export const FooterNew = memo(FooterNewComponent)
