'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Search, User, ExternalLink, Monitor } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { getAssetPath } from '../lib/utils'
import { useTheme } from '../contexts/ThemeContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { theme, resolvedTheme, toggleTheme } = useTheme()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navigationItems = [
    { name: 'Latest News', href: '/', current: location.pathname === '/' },
    { name: 'Artist News', href: '/category/artist-news', current: location.pathname === '/category/artist-news' },
    { name: 'Event Reports', href: '/category/event-reports', current: location.pathname === '/category/event-reports' },
    { name: 'Gear & Tech', href: '/category/gear-tech', current: location.pathname === '/category/gear-tech' },
    { name: 'Trending Tracks', href: '/category/trending-tracks', current: location.pathname === '/category/trending-tracks' },
    { name: 'Industry', href: '/category/industry-news', current: location.pathname === '/category/industry-news' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
    { name: 'Contact', href: '/contact', current: location.pathname === '/contact' }
  ]

  // Get the appropriate logo based on theme
  const getLogoPath = () => {
    return resolvedTheme === 'dark' 
      ? getAssetPath('images/logos/wheredjsplay_logo.PNG')
      : getAssetPath('images/logos/wheredjsplay_light_mode.png')
  }

  // Get theme icon
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />
      case 'dark':
        return <Moon size={20} />
      case 'system':
        return <Monitor size={20} />
      default:
        return <Sun size={20} />
    }
  }

  return (
    <>
      <header className={`bg-white/95 dark:bg-wdp-surface/95 backdrop-blur-md border-b border-gray-200 dark:border-wdp-muted sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo - Far Left */}
            <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
              <img 
                src={getLogoPath()} 
                alt="WhereDJsPlay" 
                className="h-12 lg:h-14 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation - Responsive */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 xl:mx-8 2xl:mx-12">
              <div className="flex items-center space-x-1 xl:space-x-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-2 xl:px-3 2xl:px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap text-xs xl:text-sm ${
                      item.current
                        ? 'bg-wdp-accent text-white shadow-md'
                        : 'text-gray-700 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right Side Actions - Far Right */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Search Button - Mobile */}
              <button className="lg:hidden p-2 text-gray-500 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                aria-label={`Current theme: ${theme}. Click to cycle through themes.`}
                title={`Current: ${theme} (${resolvedTheme})`}
              >
                {getThemeIcon()}
              </button>

              {/* DJLink.me Button - Desktop */}
              <a
                href="https://djlink.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <span>Join DJLink.me</span>
                <ExternalLink size={14} />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-gray-500 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <img 
                    src={getLogoPath()} 
                    alt="WhereDJsPlay" 
                    className="h-14 w-auto"
                  />
                </div>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wdp-accent focus:border-transparent"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-6 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      item.current
                        ? 'bg-wdp-accent text-white shadow-md'
                        : 'text-gray-700 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <a
                  href="https://djlink.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-gray-800 dark:bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 font-medium shadow-md"
                >
                  <span>Join DJLink.me</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Quick Stats */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-wdp-accent">50K+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Readers</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-wdp-accent">1000+</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Articles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}