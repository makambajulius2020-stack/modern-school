import React, { useState } from 'react';
import { 
  Users, Bell, Shield, Palette, Globe, Smartphone, 
  Mail, Lock, Eye, EyeOff, Save, Download, Upload,
  CheckCircle, AlertCircle, Info, Moon, Sun, Monitor,
  UserPlus, Heart, Calendar, CreditCard
} from 'lucide-react';

const ParentSettingsPanel = ({ userRole, currentUser, darkMode = false, setDarkMode, fontSize, setFontSize, setActiveTab }) => {
  const [settingsTab, setSettingsTab] = useState('children');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      firstName: currentUser?.name?.split(' ')[0] || '',
      lastName: currentUser?.name?.split(' ')[1] || '',
      email: currentUser?.email || '',
      phone: '',
      address: '',
      occupation: '',
      employer: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    children: {
      addChildNotifications: true,
      childProgressUpdates: true,
      attendanceAlerts: true,
      gradeNotifications: true,
      behaviorReports: true,
      schoolEvents: true,
      teacherMessages: true,
      feeReminders: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      weeklyReports: true,
      monthlyReports: true,
      urgentAlerts: true,
      schoolAnnouncements: true,
      parentTeacherMeetings: true
    },
    privacy: {
      profileVisibility: 'school-staff',
      showContactInfo: 'teachers-only',
      allowMessages: 'teachers-staff',
      shareProgress: 'teachers-only',
      dataSharing: 'minimal'
    },
    appearance: {
      theme: darkMode ? 'dark' : 'light',
      language: 'en',
      fontSize: fontSize || 'medium',
      colorScheme: 'default'
    },
    financial: {
      feeNotifications: true,
      paymentReminders: true,
      receiptNotifications: true,
      budgetTracking: true,
      expenseReports: true
    }
  });

  // Dark mode utility classes
  const containerBg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Handle theme changes
    if (section === 'appearance' && field === 'theme') {
      if (value === 'light') {
        setDarkMode(false);
      } else if (value === 'dark') {
        setDarkMode(true);
      } else if (value === 'auto') {
        // Auto theme - use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
    }
    
    // Handle font size changes
    if (section === 'appearance' && field === 'fontSize') {
      setFontSize(value);
    }
  };

  const handleSaveSettings = () => {
    // Simulate API call
    console.log('Settings saved:', settings);
    // You could replace this with a proper notification system
    // For now, we'll just log to console instead of using alert
  };

  const tabs = [
    { id: 'children', label: 'Children', icon: UserPlus },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'financial', label: 'Financial', icon: CreditCard }
  ];

  return (
    <div className={`min-h-screen ${containerBg} p-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${cardBg} rounded-xl shadow-lg p-6 mb-6 border`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${textPrimary} flex items-center`}>
                <Users className="w-8 h-8 mr-3 text-blue-600" />
                Parent Settings
              </h1>
              <p className={`${textSecondary} mt-2`}>
                Manage your account preferences and family settings
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm ${textMuted}`}>Welcome, {currentUser?.name}</p>
              <p className={`text-xs ${textMuted} capitalize`}>{userRole}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`${cardBg} rounded-xl shadow-lg p-4 border sticky top-4`}>
              <h3 className={`font-semibold ${textPrimary} mb-4`}>Settings</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      settingsTab === tab.id 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' 
                        : `${hoverBg} ${textSecondary}`
                    }`}
                  >
                    <tab.icon className="w-4 h-4 inline mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {settingsTab === 'children' && (
              <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
                <h2 className={`text-xl font-semibold ${textPrimary} mb-6`}>Children Management</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Child-Related Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'addChildNotifications', label: 'Add Child Notifications', desc: 'Get notified when new children are added to your account' },
                        { key: 'childProgressUpdates', label: 'Progress Updates', desc: 'Receive updates about your children\'s academic progress' },
                        { key: 'attendanceAlerts', label: 'Attendance Alerts', desc: 'Get alerts about attendance issues' },
                        { key: 'gradeNotifications', label: 'Grade Notifications', desc: 'Get notified when grades are posted' },
                        { key: 'behaviorReports', label: 'Behavior Reports', desc: 'Receive behavior reports and updates' },
                        { key: 'schoolEvents', label: 'School Events', desc: 'Get notified about school events and activities' },
                        { key: 'teacherMessages', label: 'Teacher Messages', desc: 'Receive messages from your children\'s teachers' },
                        { key: 'feeReminders', label: 'Fee Reminders', desc: 'Get reminders about school fees and payments' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${textPrimary}`}>{item.label}</div>
                            <div className={`text-sm ${textSecondary}`}>{item.desc}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.children[item.key]}
                              onChange={(e) => handleInputChange('children', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <h4 className={`font-medium ${textPrimary}`}>Child Management</h4>
                    </div>
                    <p className={`text-sm ${textSecondary} mb-3`}>
                      To add or manage your children, please contact the school administration or use the Children Management section in the main menu.
                    </p>
                    <button 
                      onClick={() => setSettingsTab && setSettingsTab('children')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Manage Children
                    </button>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'notifications' && (
              <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
                <h2 className={`text-xl font-semibold ${textPrimary} mb-6`}>Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Communication Channels</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
                        { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: Smartphone },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive push notifications on mobile app', icon: Bell }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 text-blue-600" />
                            <div>
                              <div className={`font-medium ${textPrimary}`}>{item.label}</div>
                              <div className={`text-sm ${textSecondary}`}>{item.desc}</div>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key]}
                              onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Report Preferences</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly progress reports' },
                        { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Receive monthly comprehensive reports' },
                        { key: 'urgentAlerts', label: 'Urgent Alerts', desc: 'Receive urgent notifications immediately' },
                        { key: 'schoolAnnouncements', label: 'School Announcements', desc: 'Receive school-wide announcements' },
                        { key: 'parentTeacherMeetings', label: 'Parent-Teacher Meetings', desc: 'Get notified about meeting schedules' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <div className={`font-medium ${textPrimary}`}>{item.label}</div>
                            <div className={`text-sm ${textSecondary}`}>{item.desc}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.notifications[item.key]}
                              onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'appearance' && (
              <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
                <h2 className={`text-xl font-semibold ${textPrimary} mb-6`}>Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Light', icon: Sun, color: 'text-yellow-500' },
                        { value: 'dark', label: 'Dark', icon: Moon, color: 'text-blue-500' },
                        { value: 'auto', label: 'Auto', icon: Monitor, color: 'text-gray-500' }
                      ].map((theme) => (
                        <label 
                          key={theme.value} 
                          className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            settings.appearance.theme === theme.value
                              ? darkMode 
                                ? 'border-blue-400 bg-blue-900/20' 
                                : 'border-blue-500 bg-blue-50'
                              : darkMode
                                ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={theme.value}
                            checked={settings.appearance.theme === theme.value}
                            onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
                            className="sr-only"
                          />
                          <theme.icon className={`w-6 h-6 mb-2 ${theme.color} ${
                            settings.appearance.theme === theme.value ? 'opacity-100' : 'opacity-60'
                          }`} />
                          <span className={`text-sm font-medium ${
                            settings.appearance.theme === theme.value 
                              ? darkMode ? 'text-blue-300' : 'text-blue-700'
                              : textSecondary
                          }`}>{theme.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Language</h3>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => handleInputChange('appearance', 'language', e.target.value)}
                      className={`w-full px-3 py-2 border ${borderColor} rounded-lg ${cardBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <h3 className={`text-lg font-medium ${textPrimary} mb-4`}>Font Size</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'small', label: 'Small', size: 'text-sm', icon: 'A' },
                        { value: 'medium', label: 'Medium', size: 'text-base', icon: 'A' },
                        { value: 'large', label: 'Large', size: 'text-lg', icon: 'A' }
                      ].map((size) => (
                        <label 
                          key={size.value} 
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                            settings.appearance.fontSize === size.value
                              ? darkMode 
                                ? 'border-blue-400 bg-blue-900/20 shadow-lg shadow-blue-500/20' 
                                : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                              : darkMode
                                ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="fontSize"
                            value={size.value}
                            checked={settings.appearance.fontSize === size.value}
                            onChange={(e) => handleInputChange('appearance', 'fontSize', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`${size.size} font-bold mb-2 ${
                            settings.appearance.fontSize === size.value 
                              ? darkMode ? 'text-blue-300' : 'text-blue-700'
                              : textSecondary
                          }`}>
                            {size.icon}
                          </div>
                          <span className={`text-sm font-medium ${
                            settings.appearance.fontSize === size.value 
                              ? darkMode ? 'text-blue-300' : 'text-blue-700'
                              : textSecondary
                          }`}>
                            {size.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-sm ${textMuted} mt-2`}>
                      Choose your preferred font size for better readability
                    </p>
                  </div>
                </div>
              </div>
            )}

            {settingsTab === 'financial' && (
              <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
                <h2 className={`text-xl font-semibold ${textPrimary} mb-6`}>Financial Preferences</h2>
                
                <div className="space-y-6">
                  {[
                    { 
                      key: 'feeNotifications', 
                      label: 'Fee Notifications', 
                      desc: 'Get notified about school fees and payments' 
                    },
                    { 
                      key: 'paymentReminders', 
                      label: 'Payment Reminders', 
                      desc: 'Receive reminders about upcoming payments' 
                    },
                    { 
                      key: 'receiptNotifications', 
                      label: 'Receipt Notifications', 
                      desc: 'Get notified when receipts are available' 
                    },
                    { 
                      key: 'budgetTracking', 
                      label: 'Budget Tracking', 
                      desc: 'Track your school-related expenses' 
                    },
                    { 
                      key: 'expenseReports', 
                      label: 'Expense Reports', 
                      desc: 'Receive monthly expense reports' 
                    }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <div className={`font-medium ${textPrimary}`}>{item.label}</div>
                        <div className={`text-sm ${textSecondary}`}>{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.financial[item.key]}
                          onChange={(e) => handleInputChange('financial', item.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSettingsPanel;
