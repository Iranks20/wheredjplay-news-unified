'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

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
  }

  return (
    <header className="bg-white dark:bg-wdp-surface border-b border-gray-200 dark:border-wdp-muted sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/images/logos/wheredjsplay_logo.png" 
              alt="WhereDJsPlay" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
              Latest News
            </Link>
            <Link to="/category/artist-news" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
              Artist News
            </Link>
            <Link to="/category/event-reports" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
              Event Reports
            </Link>
            <Link to="/category/gear-tech" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
              Gear & Tech
            </Link>
            <Link to="/category/trending-tracks" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
              Trending Tracks
            </Link>
            <Link to="/category/industry-news" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
              Industry
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-wdp-text hover:text-wdp-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Submit News Button */}
            <a
              href="https://djlink.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-2 bg-wdp-accent text-white px-4 py-2 rounded-lg hover:bg-wdp-accent-hover transition-all duration-200 font-medium"
            >
              <Plus size={16} />
              <span>Join Djlinkme</span>
            </a>


            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-500 dark:text-wdp-text hover:text-wdp-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-wdp-muted py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
                Latest News
              </Link>
              <Link to="/category/artist-news" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
                Artist News
              </Link>
              <Link to="/category/event-reports" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
                Event Reports
              </Link>
              <Link to="/category/gear-tech" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
                Gear & Tech
              </Link>
              <Link to="/category/trending-tracks" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
                Trending Tracks
              </Link>
              <Link to="/category/industry-news" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent font-medium transition-colors">
                Industry
              </Link>
              <a
                href="https://djlink.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center space-x-2 bg-wdp-accent text-white px-4 py-2 rounded-lg hover:bg-wdp-accent-hover transition-all duration-200 font-medium"
              >
                <Plus size={16} />
                <span>Join Djlinkme</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}