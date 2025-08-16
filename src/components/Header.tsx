'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Plus, Search, User, ExternalLink } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { getAssetPath } from '../lib/utils'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    } else {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

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
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChanged'))
  }

  const navigationItems = [
    { name: 'Latest News', href: '/', current: location.pathname === '/' },
    { name: 'Artist News', href: '/category/artist-news', current: location.pathname === '/category/artist-news' },
    { name: 'Event Reports', href: '/category/event-reports', current: location.pathname === '/category/event-reports' },
    { name: 'Gear & Tech', href: '/category/gear-tech', current: location.pathname === '/category/gear-tech' },
    { name: 'Trending Tracks', href: '/category/trending-tracks', current: location.pathname === '/category/trending-tracks' },
    { name: 'Industry', href: '/category/industry-news', current: location.pathname === '/category/industry-news' }
  ]

  // Get the appropriate logo based on theme
  const getLogoPath = () => {
    return isDarkMode 
      ? getAssetPath('images/logos/wheredjsplay_logo.PNG')
      : getAssetPath('images/logos/wheredjsplay_light_mode.png')
  }

  return (
    <>
      <header className={`bg-white/95 dark:bg-wdp-surface/95 backdrop-blur-md border-b border-gray-200 dark:border-wdp-muted sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src={getLogoPath()} 
                alt="WhereDJsPlay" 
                className="h-12 lg:h-14 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                    item.current
                      ? 'bg-wdp-accent text-white shadow-md'
                      : 'text-gray-700 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation - Compact */}
            <nav className="hidden lg:flex xl:hidden items-center space-x-1">
              {navigationItems.slice(0, 3).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-2 py-2 rounded-lg font-medium transition-all duration-200 text-sm whitespace-nowrap ${
                    item.current
                      ? 'bg-wdp-accent text-white shadow-md'
                      : 'text-gray-700 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Dropdown for remaining items */}
              <div className="relative group">
                <button className="px-2 py-2 rounded-lg font-medium transition-all duration-200 text-sm text-gray-700 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap">
                  More
                </button>
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[120px] z-50">
                  {navigationItems.slice(3).map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        item.current
                          ? 'bg-wdp-accent text-white'
                          : 'text-gray-700 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Button - Mobile */}
              <button className="lg:hidden p-2 text-gray-500 dark:text-wdp-text hover:text-wdp-accent transition-colors">
                <Search size={20} />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 dark:text-wdp-text hover:text-wdp-accent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Post News Button - Desktop */}
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-2 bg-wdp-accent text-white px-3 py-2 rounded-lg hover:bg-wdp-accent-hover transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                <span>Post News</span>
              </Link>

              {/* DJLink.me Button - Desktop */}
              <a
                href="https://djlink.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 bg-gray-800 dark:bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
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
                <Link
                  to="/admin"
                  className="flex items-center justify-center space-x-2 bg-wdp-accent text-white px-4 py-3 rounded-lg hover:bg-wdp-accent-hover transition-all duration-200 font-medium shadow-md"
                >
                  <Plus size={16} />
                  <span>Post News</span>
                </Link>
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