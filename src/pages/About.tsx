'use client'

import React from 'react'
import { Music, Users, Globe, Mail, Heart, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAssetPath } from '../lib/utils'
import * as Components from '../components'

export default function About() {
  const stats = [
    { number: '50K+', label: 'Readers', icon: Users },
    { number: '1000+', label: 'Articles', icon: TrendingUp },
    { number: '6', label: 'Categories', icon: Globe },
    { number: '24/7', label: 'Coverage', icon: Music }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-wdp-background">
      <Components.ScrollBanner />
      <Components.Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-wdp-accent/10 via-wdp-accent/5 to-wdp-accent/15 dark:from-wdp-accent/20 dark:via-wdp-accent/10 dark:to-wdp-accent/25">
        <div className="max-w-[1400px] mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-wdp-text">
              About WhereDJsPlay
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-wdp-text/90 max-w-3xl mx-auto leading-relaxed">
              Your ultimate source for electronic music news, DJ culture, and industry insights. 
              We're building the world's most comprehensive platform for electronic music journalism.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-wdp-surface">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-wdp-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={24} className="text-wdp-accent" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-wdp-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-wdp-text/70">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-gray-50 dark:bg-wdp-background">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-wdp-text mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-wdp-text/80 mb-6 leading-relaxed">
                We believe electronic music deserves world-class journalism. Our mission is to provide 
                comprehensive, accurate, and engaging coverage of the electronic music industry, from 
                underground scenes to mainstream festivals.
              </p>
              <p className="text-lg text-gray-600 dark:text-wdp-text/80 mb-8 leading-relaxed">
                Through our platform, we connect artists, fans, industry professionals, and journalists 
                to create a vibrant community that celebrates and documents the evolution of electronic 
                music culture.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-wdp-accent rounded-full flex items-center justify-center">
                  <Heart size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-wdp-text">Powered by Passion</h3>
                  <p className="text-gray-600 dark:text-wdp-text/70">Built by music lovers, for music lovers</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={getAssetPath('images/logos/wheredjsplay_logo.PNG')} 
                alt="WhereDJsPlay Logo" 
                className="w-full max-w-md mx-auto opacity-90"
              />
            </div>
          </div>
        </div>
      </div>

      {/* What We Cover */}
      <div className="py-16 bg-white dark:bg-wdp-surface">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-wdp-text mb-4">
              What We Cover
            </h2>
            <p className="text-lg text-gray-600 dark:text-wdp-text/80 max-w-2xl mx-auto">
              Comprehensive coverage across all aspects of electronic music
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Artist News', description: 'Latest updates from your favorite DJs and producers' },
              { name: 'Event Reports', description: 'Festival coverage, club nights, and event reviews' },
              { name: 'Gear & Tech', description: 'Equipment reviews, software updates, and tech innovations' },
              { name: 'Trending Tracks', description: 'Chart-topping tracks and viral hits' },
              { name: 'Industry News', description: 'Business updates, label news, and industry insights' },
              { name: 'Education', description: 'Tutorials, tips, and learning resources for DJs' }
            ].map((category, index) => (
              <div key={index} className="bg-gray-50 dark:bg-wdp-background rounded-xl p-6 border border-gray-200 dark:border-wdp-muted">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-wdp-text mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-wdp-text/80 text-sm">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Our Team */}
      <div className="py-16 bg-gradient-to-r from-wdp-accent to-wdp-accent-hover text-white">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            We're always looking for passionate writers, editors, and content creators to help us 
            document the electronic music scene. Start contributing today.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 bg-white text-wdp-accent px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Mail size={20} />
            <span>Get Started</span>
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gray-50 dark:bg-wdp-background">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-wdp-text mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 dark:text-wdp-text/80 mb-8">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-wdp-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-wdp-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-wdp-text mb-2">
                General Inquiries
              </h3>
              <p className="text-gray-600 dark:text-wdp-text/80">
                team@wheredjsplay.com
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-wdp-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-wdp-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-wdp-text mb-2">
                Content Submissions
              </h3>
              <p className="text-gray-600 dark:text-wdp-text/80">
                submissions@wheredjsplay.com
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-wdp-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe size={24} className="text-wdp-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-wdp-text mb-2">
                Business & Partnerships
              </h3>
              <p className="text-gray-600 dark:text-wdp-text/80">
                business@wheredjsplay.com
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Components.Footer />
    </div>
  )
}