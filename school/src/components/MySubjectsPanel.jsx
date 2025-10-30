import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Award, Users, MapPin, 
  CheckCircle, Calendar, Eye, MessageSquare, Brain, AlertTriangle
} from 'lucide-react';

const MySubjectsPanel = ({ userRole, currentUser, darkMode = false, setActiveTab }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Dark mode utility classes
  const cardBg = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  // Dynamic subjects data - will be fetched from API or localStorage
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subjects data on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(`${baseUrl}/api/students/${currentUser?.id}/subjects`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.success && data.subjects) {
                setSubjects(data.subjects);
                setLoading(false);
                return;
              }
            }
          } catch (apiError) {
            console.log('API fetch failed, trying localStorage:', apiError);
          }
        }
        
        // Fallback to localStorage
        const savedSubjects = localStorage.getItem(`subjects_${currentUser?.id}`);
        if (savedSubjects) {
          try {
            const parsedSubjects = JSON.parse(savedSubjects);
            setSubjects(parsedSubjects);
          } catch (parseError) {
            console.error('Error parsing saved subjects:', parseError);
            setSubjects([]);
          }
        } else {
          setSubjects([]);
        }
        
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects');
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) {
      fetchSubjects();
    } else {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const getGradeColor = (grade) => {
    if (grade >= 85) return 'text-green-600';
    if (grade >= 75) return 'text-blue-600';
    if (grade >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-l-blue-500 bg-blue-50',
      purple: 'border-l-purple-500 bg-purple-50',
      green: 'border-l-green-500 bg-green-50',
      orange: 'border-l-orange-500 bg-orange-50',
      indigo: 'border-l-indigo-500 bg-indigo-50'
    };
    return darkMode ? 'border-l-gray-500 bg-gray-700' : colors[color] || colors.blue;
  };

  // Loading state
  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-white' : ''}`}>
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>My Subjects</h1>
          <p className={textSecondary}>Loading your subjects...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-white' : ''}`}>
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>My Subjects</h1>
          <p className={textSecondary}>Error loading subjects</p>
        </div>
        <div className={`${cardBg} rounded-xl shadow-lg p-8 text-center`}>
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>Unable to Load Subjects</h3>
          <p className={`${textSecondary} mb-4`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-white' : ''}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>My Subjects</h1>
        <p className={textSecondary}>
          {subjects.length > 0 
            ? `Your enrolled subjects (${subjects.length} total)`
            : 'No subjects enrolled yet'
          }
        </p>
      </div>

      {/* Summary Stats - Only show when subjects exist */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>{subjects.length}</p>
              <p className={`text-sm ${textMuted}`}>Total Subjects</p>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center">
            <Award className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {subjects.length ? Math.round(subjects.reduce((acc, s) => acc + s.currentGrade, 0) / subjects.length) : 0}%
              </p>
              <p className={`text-sm ${textMuted}`}>Average Grade</p>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {subjects.length ? Math.round(subjects.reduce((acc, s) => acc + s.attendance, 0) / subjects.length) : 0}%
              </p>
              <p className={`text-sm ${textMuted}`}>Avg Attendance</p>
            </div>
          </div>
        </div>
        
        <div className={`${cardBg} rounded-xl shadow-lg p-6`}>
          <div className="flex items-center">
            <Users className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {subjects.reduce((acc, s) => acc + s.credits, 0)}
              </p>
              <p className={`text-sm ${textMuted}`}>Total Credits</p>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Quick Actions - Only show when subjects exist */}
      {subjects.length > 0 && (
        <div className={`${cardBg} rounded-xl shadow-lg p-6 mb-8`}>
        <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab('assignments')}
            className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-blue-900">View Assignments</p>
              <p className="text-sm text-blue-700">Check your pending tasks</p>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('grades')}
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Award className="w-6 h-6 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-green-900">View Grades</p>
              <p className="text-sm text-green-700">Check your performance</p>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('timetable')}
            className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Calendar className="w-6 h-6 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Class Timetable</p>
              <p className="text-sm text-purple-700">View your schedule</p>
            </div>
          </button>
        </div>
        </div>
      )}

      {/* Empty State */}
      {subjects.length === 0 && (
        <div className={`${cardBg} rounded-xl shadow-lg p-12 text-center`}>
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>No Subjects Enrolled</h3>
          <p className={`${textSecondary} mb-6`}>
            You haven't been enrolled in any subjects yet. Please contact your administrator to get enrolled.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setActiveTab('messaging')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* Subjects Grid */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subjects.map((subject) => (
          <div 
            key={subject.id}
            className={`${cardBg} rounded-xl shadow-lg border-l-4 ${getColorClasses(subject.color)} p-6 hover:shadow-xl transition-shadow cursor-pointer`}
            onClick={() => setSelectedSubject(subject)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-xl font-semibold ${textPrimary} mb-1`}>{subject.name}</h3>
                <p className={`text-sm ${textMuted} mb-2`}>{subject.code}</p>
                <p className={`text-sm ${textSecondary} flex items-center`}>
                  <Users className="w-4 h-4 mr-1" />
                  {subject.teacher}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                  {subject.currentGrade}%
                </div>
                <p className={`text-xs ${textMuted}`}>Current Grade</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                <div>
                  <p className={`text-sm font-medium ${textPrimary}`}>Schedule</p>
                  <p className={`text-xs ${textMuted}`}>{subject.schedule}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-green-600" />
                <div>
                  <p className={`text-sm font-medium ${textPrimary}`}>Location</p>
                  <p className={`text-xs ${textMuted}`}>{subject.room}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className={`text-sm font-medium ${textPrimary}`}>{subject.attendance}%</p>
                  <p className={`text-xs ${textMuted}`}>Attendance</p>
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${textPrimary}`}>{subject.credits}</p>
                  <p className={`text-xs ${textMuted}`}>Credits</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSubject(subject);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (setActiveTab) {
                      setActiveTab('messaging');
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Message Teacher"
                >
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${cardBg} rounded-xl shadow-xl p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>{selectedSubject.name}</h3>
              <button 
                onClick={() => setSelectedSubject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className={`text-sm ${textMuted}`}>Subject Code</p>
                <p className={`font-medium ${textPrimary}`}>{selectedSubject.code}</p>
              </div>
              <div>
                <p className={`text-sm ${textMuted}`}>Teacher</p>
                <p className={`font-medium ${textPrimary}`}>{selectedSubject.teacher}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textMuted}`}>Current Grade</p>
                  <p className={`font-medium ${getGradeColor(selectedSubject.currentGrade)}`}>
                    {selectedSubject.currentGrade}%
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Attendance</p>
                  <p className={`font-medium ${textPrimary}`}>{selectedSubject.attendance}%</p>
                </div>
              </div>
              <div>
                <p className={`text-sm ${textMuted}`}>Schedule</p>
                <p className={`font-medium ${textPrimary}`}>{selectedSubject.schedule}</p>
                <p className={`text-sm ${textMuted}`}>{selectedSubject.room}</p>
              </div>
              <div>
                <p className={`text-sm ${textMuted}`}>Description</p>
                <p className={`font-medium ${textPrimary}`}>{selectedSubject.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${textMuted}`}>Assignments</p>
                  <p className={`font-medium ${textPrimary}`}>{selectedSubject.completed}/{selectedSubject.assignments}</p>
                </div>
                <div>
                  <p className={`text-sm ${textMuted}`}>Credits</p>
                  <p className={`font-medium ${textPrimary}`}>{selectedSubject.credits}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 mt-4 border-t border-gray-200">
              <button 
                onClick={() => {
                  setActiveTab('assignments');
                  setSelectedSubject(null);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Assignments
              </button>
              <button 
                onClick={() => {
                  if (setActiveTab) {
                    setActiveTab('messaging');
                  } else {
                    alert('Please use the sidebar menu to access messaging.');
                  }
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Message Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubjectsPanel;
