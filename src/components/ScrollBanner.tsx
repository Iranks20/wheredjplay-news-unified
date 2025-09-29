'use client'

import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Music, Mic, Headphones, Radio, Volume2 } from 'lucide-react'

export default function ScrollBanner() {

  const socialMediaData = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/wheredjsplay',
      handle: '@wheredjsplay',
      stats: '25K followers'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/wheredjsplay',
      handle: '@wheredjsplay',
      stats: '15K followers'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/@wheredjsplay',
      handle: '@wheredjsplay',
      stats: '8K subscribers'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/wheredjsplay',
      handle: '@wheredjsplay',
      stats: '12K followers'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/wheredjsplay',
      handle: 'WhereDJsPlay',
      stats: '5K connections'
    }
  ]

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white border-b border-gray-700 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-1"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        {/* Main Headline */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-wider uppercase leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              ADVERTISE WITH THE BEST
            </span>
            <span className="text-wdp-accent font-black ml-4 drop-shadow-lg">MUSIC PLATFORM</span>
          </h2>
          <div className="w-32 h-1 bg-wdp-accent mx-auto mt-4 rounded-full shadow-lg shadow-wdp-accent/50"></div>
        </div>

        {/* Social Media Icons and Stats */}
        <div className="mb-12">
          {/* Desktop: Row Layout */}
          <div className="hidden md:flex justify-center items-center gap-6 lg:gap-8 max-w-5xl mx-auto">
            {socialMediaData.map((social) => {
              const IconComponent = social.icon
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-2xl bg-white/10 group-hover:bg-wdp-accent/20 transition-all duration-300 mb-3 shadow-lg group-hover:shadow-wdp-accent/25">
                    <IconComponent size={32} className="text-white group-hover:text-wdp-accent group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm lg:text-base font-bold mb-1">{social.handle}</p>
                    <p className="text-xs lg:text-sm text-gray-300 font-medium">{social.stats}</p>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Mobile: Grid Layout */}
          <div className="md:hidden grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {socialMediaData.map((social) => {
              const IconComponent = social.icon
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-wdp-accent/20 transition-all duration-300 group-hover:shadow-wdp-accent/25">
                    <IconComponent size={24} className="text-white group-hover:text-wdp-accent group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{social.handle}</p>
                    <p className="text-xs text-gray-300 font-medium truncate">{social.stats}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="group relative bg-white text-black px-12 py-4 rounded-2xl font-black text-xl uppercase tracking-wider hover:bg-wdp-accent hover:text-white transition-all duration-300 shadow-2xl hover:shadow-wdp-accent/50 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-wdp-accent/30">
            <span className="relative z-10">CLICK HERE</span>
            <div className="absolute inset-0 bg-gradient-to-r from-wdp-accent to-wdp-accent-hover rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-wdp-accent/30"></div>
          </button>
          <p className="text-sm text-gray-400 mt-3 font-medium">Reach thousands of music fans, DJs, and industry professionals worldwide</p>
        </div>
      </div>
    </div>
  )
}
