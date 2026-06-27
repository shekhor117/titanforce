'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, MapPin, MessageSquare, Send, ArrowLeft, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { dataStore } from '@/lib/data-store'
import { EntranceReveal } from '@/components/entrance-reveal'
import { ScrollStaggerContainer } from '@/components/scroll-stagger-container'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      // Save using dataStore (works with both localStorage fallback and Supabase when connected)
      await dataStore.addContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      })
      
      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      console.error('[v0] Error submitting contact form:', err)
      setError(isBn ? 'বার্তা পাঠাতে ত্রুটি হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।' : 'Error sending message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: isBn ? 'ফোন' : 'Phone',
      value: '+8809697377938',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: isBn ? 'ইমেইল' : 'Email',
      value: 'titanforcemulikandi@gmail.com',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: isBn ? 'অবস্থান' : 'Location',
      value: isBn ? 'মুলিকান্দি, জাকিগঞ্জ, সিলেট' : 'Mulikandi, Zakigonj, Sylhet',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-20 relative z-10">
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

      {/* Contact Info and Form */}
      <EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">
                {isBn ? 'আমাদের তথ্য' : 'Contact Information'}
              </h2>
              <ScrollStaggerContainer 
                className="space-y-6"
                staggerDelay={0.1}
                variant="fadeInLeft"
              >
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-primary mt-1">{info.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.label}</h3>
                      <p className="text-foreground/60">{info.value}</p>
                    </div>
                  </div>
                ))}
              </ScrollStaggerContainer>


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
                  className="neo-input w-full px-4 py-2 rounded-lg bg-background outline-none transition"
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
                  className="neo-input w-full px-4 py-2 rounded-lg bg-background outline-none transition"
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
                  className="neo-input w-full px-4 py-2 rounded-lg bg-background outline-none transition"
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
                  className="neo-input w-full px-4 py-2 rounded-lg bg-background outline-none transition"
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
                  className="neo-input w-full px-4 py-2 rounded-lg bg-background outline-none transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="neo-btn neo-btn-primary w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                {isSubmitting ? (isBn ? 'পাঠাচ্ছে...' : 'Sending...') : (isBn ? 'পাঠান' : 'Send Message')}
              </button>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  {isBn ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Your message has been sent successfully!'}
                </div>
              )}
            </form>
          </div>
        </div>
        </div>
      </EntranceReveal>
    </div>
  )
}
