'use client'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Settings as SettingsIcon,
  Globe,
  Shield,
  Palette,
  Bell,
  Database,
  Save,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'

export default function Settings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  // Check if user has permission to access settings
  useEffect(() => {
    if (user && user.role === 'writer') {
      toast.error('Access denied. Writers cannot access settings.')
      navigate('/admin/dashboard')
      return
    }
  }, [user, navigate])

  // If user is a writer, don't render the component
  if (user?.role === 'writer') {
    return null
  }

  const [settings, setSettings] = useState({
    siteName: 'WhereDJsPlay',
    siteDescription: 'Your Ultimate Source for DJ & Electronic Music News',
    siteUrl: 'https://wheredjsplay.com',
    contactEmail: 'admin@wheredjsplay.com',
    newsletterEnabled: true,
    newsletterAutomationEnabled: true,
    newsletterAutomationCategories: 'all',
    newsletterAutomationExcludeFeatured: false,
    newsletterAutomationExcludeBreaking: false,
    darkModeEnabled: true,
    autoSaveEnabled: true,
    maxUploadSize: '10MB',
    allowedFileTypes: 'jpg, jpeg, png, webp',
    seoEnabled: true,
    analyticsEnabled: true
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'newsletter', name: 'Newsletter', icon: Mail },
    { id: 'media', name: 'Media', icon: Database },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Globe }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your platform settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-admin-accent text-white px-4 py-2 rounded-lg hover:bg-admin-accent-hover transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <nav className="p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-admin-accent text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.name}</span>
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {activeTab === 'general' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable dark mode for the admin panel</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.darkModeEnabled}
                        onChange={(e) => handleSettingChange('darkModeEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-accent"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto Save</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save drafts while editing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoSaveEnabled}
                        onChange={(e) => handleSettingChange('autoSaveEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-accent"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Newsletter Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about newsletter subscriptions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.newsletterEnabled}
                        onChange={(e) => handleSettingChange('newsletterEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-accent"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Media Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Upload Size
                    </label>
                    <select
                      value={settings.maxUploadSize}
                      onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                    >
                      <option value="5MB">5MB</option>
                      <option value="10MB">10MB</option>
                      <option value="20MB">20MB</option>
                      <option value="50MB">50MB</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      value={settings.allowedFileTypes}
                      onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                      placeholder="jpg, jpeg, png, webp"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">API Keys</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Manage your API keys for external integrations
                    </p>
                    <button className="text-admin-accent hover:text-admin-accent-hover text-sm font-medium">
                      Manage API Keys
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Backup & Restore</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Create backups of your content and settings
                    </p>
                    <button className="text-admin-accent hover:text-admin-accent-hover text-sm font-medium">
                      Create Backup
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'newsletter' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Newsletter Settings</h2>
                
                <div className="space-y-6">
                  {/* Newsletter Automation */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">Automated Newsletter</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Enable Automation</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300">Automatically send newsletter notifications when articles are published</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.newsletterAutomationEnabled}
                            onChange={(e) => handleSettingChange('newsletterAutomationEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {settings.newsletterAutomationEnabled && (
                        <div className="space-y-4 pl-4 border-l-2 border-blue-200 dark:border-blue-700">
                          <div>
                            <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Categories to Include
                            </label>
                            <select
                              value={settings.newsletterAutomationCategories}
                              onChange={(e) => handleSettingChange('newsletterAutomationCategories', e.target.value)}
                              className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="all">All Categories</option>
                              <option value="featured">Featured Articles Only</option>
                              <option value="breaking">Breaking News Only</option>
                              <option value="custom">Custom Selection</option>
                            </select>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Exclude Featured Articles</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">Don't send newsletters for featured articles</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.newsletterAutomationExcludeFeatured}
                                  onChange={(e) => handleSettingChange('newsletterAutomationExcludeFeatured', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              </label>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">Exclude Breaking News</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">Don't send newsletters for breaking news articles</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={settings.newsletterAutomationExcludeBreaking}
                                  onChange={(e) => handleSettingChange('newsletterAutomationExcludeBreaking', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Newsletter Status */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Newsletter Status</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Newsletter System</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Enable newsletter subscription and management</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.newsletterEnabled}
                            onChange={(e) => handleSettingChange('newsletterEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-accent"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Integration Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">SEO Optimization</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable SEO features and meta tags</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.seoEnabled}
                        onChange={(e) => handleSettingChange('seoEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-accent"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Analytics</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enable analytics tracking</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.analyticsEnabled}
                        onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-accent/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-admin-accent"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 