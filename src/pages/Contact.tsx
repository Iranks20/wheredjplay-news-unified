'use client'

import React, { useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react'
import { Header, Footer } from '../components'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 2000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['team@wheredjsplay.com', 'submissions@wheredjsplay.com'],
      description: 'For general inquiries and content submissions'
    },
    {
      icon: MapPin,
      title: 'Our Location',
      details: ['71-75 Shelton Street', 'Covent Garden, London, UK'],
      description: 'Based in the heart of London'
    },
    {
      icon: Phone,
      title: 'Business Inquiries',
      details: ['business@wheredjsplay.com', 'partnerships@wheredjsplay.com'],
      description: 'For partnerships and business opportunities'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-wdp-accent/10 via-wdp-accent/5 to-wdp-accent/15 dark:from-wdp-accent/20 dark:via-wdp-accent/10 dark:to-wdp-accent/25">
        <div className="max-w-[1400px] mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-wdp-text">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-wdp-text/90 max-w-3xl mx-auto leading-relaxed">
              Get in touch with our team. We'd love to hear from you and help with any questions or collaborations.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-wdp-text mb-6">
                  Get In Touch
                </h2>
                <p className="text-lg text-gray-600 dark:text-wdp-text/80 mb-8">
                  Whether you have a story to share, want to collaborate, or just want to say hello, 
                  we're here to help. Reach out to us through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-wdp-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent size={24} className="text-wdp-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-wdp-text mb-2">
                          {info.title}
                        </h3>
                        <div className="space-y-1 mb-2">
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-600 dark:text-wdp-text/80">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-wdp-text/60">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-wdp-surface rounded-xl p-8 shadow-lg border border-gray-200 dark:border-wdp-muted">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-wdp-text mb-6">
                Send us a Message
              </h3>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-wdp-text mb-2">
                    Message Sent!
                  </h4>
                  <p className="text-gray-600 dark:text-wdp-text/80">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-wdp-accent focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-wdp-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-wdp-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}