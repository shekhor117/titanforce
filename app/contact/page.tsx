'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, MapPin, MessageSquare, Send, Facebook, Twitter, Instagram, Youtube, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

export default function ContactPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to an API
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: isBn ? 'ফোন' : 'Phone',
      value: '+880-1-XXX-XXXXXX',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: isBn ? 'ইমেইল' : 'Email',
      value: 'contact@titanforce.com',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: isBn ? 'অবস্থান' : 'Location',
      value: isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors group"
            aria-label={isBn ? 'ফিরে যান' : 'Go back'}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">{isBn ? 'ফিরে যান' : 'Back'}</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              {isBn 
                ? 'আমাদের সাথে যোগাযোগ করতে আমরা আমাদের থেকে শুনতে আগ্রহী' 
                : 'Get in touch with us. We\'d love to hear from you.'}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info and Form */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">
              {isBn ? 'আমাদের তথ্য' : 'Contact Information'}
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-primary mt-1">{info.icon}</div>
                  <div>
                    <h3 className="font-semibold mb-1">{info.label}</h3>
                    <p className="text-foreground/60">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-semibold mb-4">
                {isBn ? 'আমাদের অনুসরণ করুন' : 'Follow Us'}
              </h3>
              <div className="flex gap-4">
                <button
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 transition text-primary flex items-center justify-center"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 transition text-primary flex items-center justify-center"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 transition text-primary flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </button>
                <button
                  className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 transition text-primary flex items-center justify-center"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">
              {isBn ? 'বার্তা পাঠান' : 'Send us a Message'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isBn ? 'নাম' : 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={isBn ? 'আপনার নাম' : 'Your name'}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background hover:border-primary/50 focus:border-primary outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isBn ? 'ইমেইল' : 'Email'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={isBn ? 'আপনার ইমেইল' : 'Your email'}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background hover:border-primary/50 focus:border-primary outline-none transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isBn ? 'ফোন' : 'Phone'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={isBn ? 'আপনার ফোন নাম্বার' : 'Your phone number'}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background hover:border-primary/50 focus:border-primary outline-none transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isBn ? 'বিষয়' : 'Subject'}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder={isBn ? 'বিষয় লিখুন' : 'Subject'}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background hover:border-primary/50 focus:border-primary outline-none transition"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {isBn ? 'বার্তা' : 'Message'}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={isBn ? 'আপনার বার্তা লিখুন' : 'Your message'}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background hover:border-primary/50 focus:border-primary outline-none transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isBn ? 'পাঠান' : 'Send Message'}
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600">
                  {isBn ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Your message has been sent successfully!'}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
