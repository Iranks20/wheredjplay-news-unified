import React, { useState, useEffect } from 'react'
import { getAssetPath } from '../lib/utils'

export default function Footer() {
  const [currentTheme, setCurrentTheme] = useState('dark')

  // Get current theme from localStorage or default to dark
  const getCurrentTheme = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark'
    }
    return 'dark'
  }

  // Listen for theme changes
  useEffect(() => {
    const updateTheme = () => {
      setCurrentTheme(getCurrentTheme())
    }

    // Set initial theme
    updateTheme()

    // Listen for storage changes (when theme is changed in header)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        updateTheme()
      }
    }

    // Listen for custom theme change event
    const handleThemeChange = () => {
      updateTheme()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('themeChanged', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('themeChanged', handleThemeChange)
    }
  }, [])

  // Get the appropriate logo based on theme
  const getLogoPath = () => {
    return currentTheme === 'dark'
      ? getAssetPath('images/logos/wheredjsplay_logo.PNG')
      : getAssetPath('images/logos/wheredjsplay_light_mode.png')
  }

  return (
    <footer className="bg-wdp-surface dark:bg-gray-900 border-t border-gray-200 dark:border-wdp-muted mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-10 flex flex-col md:flex-row md:justify-between gap-8">
        {/* Left: Logo and Description */}
        <div className="flex-1 min-w-[220px] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={getLogoPath()} alt="WhereDJsPlay Logo" className="h-20 w-auto" />
          </div>
          <p className="text-gray-600 dark:text-wdp-text/70 text-sm max-w-xs">
            Your ultimate source for DJ & electronic music news, events, and artist discovery. Powered by the global DJ community.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a 
              href="https://djlink.me" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center h-12 w-48 rounded-lg bg-gray-800 dark:bg-gray-700 p-2 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <img src={getAssetPath('images/logos/djlinkme_logo.svg')} alt="DJLink.me Logo" className="h-10 w-auto" />
            </a>
            <span className="text-xs text-gray-500 dark:text-wdp-text/50">A product of DJLink.me</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex-1 min-w-[180px] flex flex-col gap-2">
          <h4 className="font-semibold text-gray-900 dark:text-wdp-text mb-2">Navigation</h4>
          <a href="/" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent text-sm">News</a>
          <a href="/category/artist-news" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent text-sm">Artists</a>
          <a href="/category/event-reports" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent text-sm">Events</a>
          <a href="https://djlink.me" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-wdp-text hover:text-wdp-accent text-sm">DJLink.me</a>
        </div>

        {/* Right: Social & Legal */}
        <div className="flex-1 min-w-[220px] flex flex-col gap-4">
          <h4 className="font-semibold text-gray-900 dark:text-wdp-text mb-2">Connect</h4>
          <div className="flex items-center gap-4 mb-2">
            <a href="https://instagram.com/wheredjsplay" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-wdp-accent text-gray-500 dark:text-wdp-text/70">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5Zm8.75 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"/></svg>
            </a>
            <a href="https://facebook.com/wheredjsplay" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-wdp-accent text-gray-500 dark:text-wdp-text/70">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 2.25A7.75 7.75 0 0 0 5.75 10v2.25H3.5a.75.75 0 0 0 0 1.5h2.25V21.5a.75.75 0 0 0 1.5 0v-7.75h2.25a.75.75 0 0 0 0-1.5H7.25V10A6.25 6.25 0 0 1 13.5 3.75a.75.75 0 0 0 0-1.5Z"/></svg>
            </a>
            <a href="https://youtube.com/@wheredjsplay" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-wdp-accent text-gray-500 dark:text-wdp-text/70">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M21.8 7.2a2.75 2.75 0 0 0-1.94-1.94C18.1 5 12 5 12 5s-6.1 0-7.86.26A2.75 2.75 0 0 0 2.2 7.2C2 8.96 2 12 2 12s0 3.04.2 4.8a2.75 2.75 0 0 0 1.94 1.94C5.9 19 12 19 12 19s6.1 0 7.86-.26a2.75 2.75 0 0 0 1.94-1.94C22 15.04 22 12 22 12s0-3.04-.2-4.8ZM10 15.5V8.5l6 3.5-6 3.5Z"/></svg>
            </a>
          </div>
          <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-wdp-text/50">
            <a href="/privacy" className="hover:text-wdp-accent">Privacy Policy</a>
            <a href="/terms" className="hover:text-wdp-accent">Terms & Conditions</a>
            <span>team@wheredjsplay.com</span>
            <span>71-75 Shelton Street, Covent Garden, London, UK</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-wdp-muted py-4 text-center text-xs text-gray-500 dark:text-wdp-text/50 bg-wdp-surface dark:bg-gray-900">
        © {new Date().getFullYear()} WhereDJsPlay. All rights reserved.
      </div>
    </footer>
  )
}