'use client'

import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Shield } from 'lucide-react';
import { UsersService } from '../lib/api';
import { toast } from 'sonner';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteUserModal({ isOpen, onClose, onSuccess }: InviteUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'writer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await UsersService.inviteUser(formData);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to invite user');
      }

      toast.success('User invited successfully! An email with login details has been sent.');
      setFormData({ name: '', email: '', role: 'writer' });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', role: 'writer' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="relative p-6">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-admin-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Invite New User
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Send an invitation with login credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="writer">Writer</option>
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.role === 'writer' && 'Can write articles and submit for review'}
                {formData.role === 'author' && 'Can create and publish articles'}
                {formData.role === 'editor' && 'Can edit and publish articles, manage content'}
                {formData.role === 'admin' && 'Full access to all features and user management'}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Email Invitation
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    An email will be sent to {formData.email || 'the user'} with their login credentials and instructions.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-admin-accent text-white rounded-lg hover:bg-admin-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Inviting...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
