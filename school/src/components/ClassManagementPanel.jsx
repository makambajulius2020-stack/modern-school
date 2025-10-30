import React, { useState } from 'react';
import { 
  Users, Plus, Edit3, Trash2, Search, Filter, BookOpen, 
  GraduationCap, MapPin, Clock, Calendar, Settings, Eye,
  UserPlus, UserMinus, BarChart3, TrendingUp, Award
} from 'lucide-react';

const ClassManagementPanel = ({ userRole, currentUser, darkMode = false }) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dark mode utility classes
  const cardBg = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  // Classes data (start empty; populate from backend when available)
  const classes = [];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${textSecondary}`}>Total Classes</p>
              <p className={`text-3xl font-bold ${textPrimary}`}>{classes.length}</p>
              <p className="text-blue-600 text-sm">Active classes</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${textSecondary}`}>Total Students</p>
              <p className={`text-3xl font-bold ${textPrimary}`}>{classes.reduce((sum, cls) => sum + cls.students, 0)}</p>
              <p className="text-green-600 text-sm">Enrolled students</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${textSecondary}`}>Avg Performance</p>
              <p className={`text-3xl font-bold ${textPrimary}`}>
                {(classes.reduce((sum, cls) => sum + cls.performance, 0) / classes.length).toFixed(1)}%
              </p>
              <p className="text-purple-600 text-sm">Academic average</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${textSecondary}`}>Avg Attendance</p>
              <p className={`text-3xl font-bold ${textPrimary}`}>
                {(classes.reduce((sum, cls) => sum + cls.attendance, 0) / classes.length).toFixed(1)}%
              </p>
              <p className="text-orange-600 text-sm">Daily average</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className={`${cardBg} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textPrimary}`}>{classItem.name}</h3>
                  <p className={`${textSecondary}`}>{classItem.code} • {classItem.level}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClass(classItem)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={textSecondary}>Students</span>
                <span className={`font-medium ${textPrimary}`}>{classItem.students}/{classItem.capacity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={textSecondary}>Class Teacher</span>
                <span className={`font-medium ${textPrimary}`}>{classItem.classTeacher}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={textSecondary}>Room</span>
                <span className={`font-medium ${textPrimary}`}>{classItem.room}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={textSecondary}>Performance</span>
                <span className="font-medium text-green-600">{classItem.performance}%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  Manage
                </button>
                <button className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm">
                  Students
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-white' : ''}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Class Management</h1>
        <p className={textSecondary}>Manage classes, students, and academic performance</p>
      </div>

      {/* Header Controls */}
      <div className={`${cardBg} rounded-xl shadow-lg p-6 mb-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>
            <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </button>
        </div>

        {/* View Toggle */}
        <div className={`flex space-x-1 rounded-lg p-1 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'list', label: 'List View', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeView === view.id
                  ? `${darkMode ? 'bg-gray-800' : 'bg-white'} text-blue-600 shadow-sm`
                  : `${textSecondary} hover:text-blue-600 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-white/50'}`
              }`}
            >
              <view.icon className="w-4 h-4 mr-2" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Views */}
      {activeView === 'overview' && renderOverview()}
      
      {activeView === 'list' && (
        <div className={`${cardBg} rounded-xl shadow-lg p-8 text-center`}>
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>List View</h3>
          <p className={textSecondary}>Detailed list view with advanced sorting and filtering coming soon.</p>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className={`${cardBg} rounded-xl shadow-lg p-8 text-center`}>
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>Analytics</h3>
          <p className={textSecondary}>Advanced class analytics and performance metrics coming soon.</p>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Create New Class</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              alert(`Class Created Successfully! ✅\n\nClass Name: ${formData.get('className')}\nLevel: ${formData.get('level')}\nCapacity: ${formData.get('capacity')}\nClass Teacher: ${formData.get('teacher')}`);
              setShowCreateModal(false);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>Class Name *</label>
                  <input
                    name="className"
                    required
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="e.g., S1 Alpha"
                  />
                </div>
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>Level *</label>
                  <select
                    name="level"
                    required
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Select level</option>
                    <option value="S1">Senior 1</option>
                    <option value="S2">Senior 2</option>
                    <option value="S3">Senior 3</option>
                    <option value="S4">Senior 4</option>
                    <option value="S5">Senior 5</option>
                    <option value="S6">Senior 6</option>
                  </select>
                </div>
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>Class Teacher *</label>
                  <input
                    name="teacher"
                    required
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="Teacher name"
                  />
                </div>
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>Capacity *</label>
                  <input
                    name="capacity"
                    type="number"
                    required
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="e.g., 40"
                  />
                </div>
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>Room Number</label>
                  <input
                    name="room"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="e.g., Room 101"
                  />
                </div>
                <div>
                  <label className={`block ${textSecondary} text-sm font-medium mb-2`}>Stream</label>
                  <select
                    name="stream"
                    className={`w-full px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="">Select stream</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagementPanel;
