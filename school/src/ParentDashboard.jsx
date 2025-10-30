import React, { useState, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import AIInsightsPanel from './AIInsightsPanel';
import RequiredActions from './components/RequiredActions';
import TopPerformingStudents from './components/TopPerformingStudents';
import TopMostActiveStudents from './components/TopMostActiveStudents';
import AITutorForm from './components/AITutorForm';
import { Award, Clock, CreditCard, Users, User, AlertTriangle, CheckCircle, TrendingUp, Target, Calendar, Star, BarChart3, Eye, Brain } from 'lucide-react';

const ParentDashboard = ({ aiInsights, setActiveTab, darkMode = false, currentUser }) => {
  const [selectedChild, setSelectedChild] = useState(0);
  const [children, setChildren] = useState([]);
  const [showAITutorForm, setShowAITutorForm] = useState(false);
  const [teacherRatings, setTeacherRatings] = useState([]);

  // Dark mode utility classes
  const bgPrimary = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
  const bgCard = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  useEffect(() => {
    // Initialize with empty children data - no fake data
    setChildren([]);
  }, []);

  useEffect(() => {
    const loadTeacherRatings = async () => {
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${baseUrl}/api/teacher-ratings/summary`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTeacherRatings(Array.isArray(data?.teachers) ? data.teachers : []);
        } else {
          setTeacherRatings([]);
        }
      } catch (e) {
        console.error('Failed to load teacher ratings', e);
        setTeacherRatings([]);
      }
    };
    loadTeacherRatings();
  }, []);

  const currentChild = children[selectedChild] || {
    id: null,
    name: 'No Child Selected',
    class: 'N/A',
    currentGPA: 0,
    attendance: 0,
    age: 0
  };

  return (
    <div className={`min-h-screen ${bgPrimary}`}>
      <div className="max-w-5xl mx-auto px-2 sm:px-3 lg:px-4 py-3 space-y-3 sm:space-y-4">
        {/* Welcome Header */}
        <div className={`rounded-lg shadow-sm p-2 sm:p-3 text-white ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-bold truncate">Parent Dashboard</h1>
              <p className="text-blue-100 text-xs truncate">Track your children's progress</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded px-2 py-1">
              <div className="text-center">
                <div className="text-xs font-bold">{children.length}</div>
                <div className="text-xs text-blue-100">Kids</div>
              </div>
              <div className="w-px h-4 bg-white/40"></div>
              <div className="text-center">
                <div className="text-xs font-bold">{new Date().getDate()}</div>
                <div className="text-xs text-blue-100">Today</div>
              </div>
            </div>
          </div>
        </div>

        <RequiredActions userRole="parent" setActiveTab={setActiveTab} darkMode={darkMode} />
        
        {/* AI Tutor Button */}
        <div className={`rounded-lg shadow-sm border p-4 ${bgCard}`}>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">AI Tutor Assistant</h3>
                  <p className="text-purple-100 text-sm">Get help with your child's studies</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAITutorForm(true)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>Try AI Tutor</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Child Selector */}
        <div className={`rounded-lg shadow-sm border p-2 sm:p-3 ${bgCard}`}>
          <div className="flex items-center mb-2">
            <Users className="w-4 h-4 text-blue-600 mr-2" />
            <h3 className={`text-sm sm:text-base font-bold ${textPrimary}`}>My Children</h3>
          </div>
          
          {children.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className={`${textSecondary}`}>No children registered</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact the school to add your children</p>
            </div>
          ) : (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {children.map((child, index) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(index)}
                  className={`flex-shrink-0 rounded-lg border-2 transition-all p-2 min-w-[140px] ${
                    selectedChild === index
                      ? darkMode 
                        ? 'border-blue-400 bg-blue-900/30 shadow-sm'
                        : 'border-blue-500 bg-blue-50 shadow-sm'
                      : darkMode
                        ? 'border-gray-600 hover:border-blue-400 bg-gray-700'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      {selectedChild === index && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                          <CheckCircle className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className={`font-bold text-xs truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{child.name}</p>
                      <p className="text-blue-600 text-xs truncate">{child.class}</p>
                      <div className="flex items-center mt-0.5 space-x-1">
                        <span className="text-xs text-yellow-600 font-medium">{child.currentGPA}</span>
                        <span className="text-xs text-green-600 font-medium">{child.attendance}%</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Child Overview Cards */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-2 text-white text-center">
            <Award className="w-3 h-3 mx-auto mb-1 text-white" />
            <div className="text-sm sm:text-base font-bold">{currentChild.currentGPA || '0.0'}</div>
            <div className="text-xs text-blue-100">GPA</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded p-2 text-white text-center">
            <Clock className="w-3 h-3 mx-auto mb-1 text-white" />
            <div className="text-sm sm:text-base font-bold">{currentChild.attendance || 0}%</div>
            <div className="text-xs text-green-100">Attend</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded p-2 text-white text-center cursor-pointer" onClick={() => setActiveTab('payments')}>
            <CreditCard className="w-3 h-3 mx-auto mb-1 text-white" />
            <div className="text-sm sm:text-base font-bold">UGX 0</div>
            <div className="text-xs text-white/80">Fee Balance</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded p-2 text-white text-center">
            <User className="w-3 h-3 mx-auto mb-1 text-white" />
            <div className="text-sm sm:text-base font-bold">{currentChild.age || 0}</div>
            <div className="text-xs text-purple-100">Age</div>
          </div>
        </div>

        {/* Child Attendance Progress */}
        <div className={`rounded-lg shadow-sm border p-3 ${bgCard}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className={`text-base font-semibold ${textPrimary}`}>{currentChild.name}'s Attendance Progress</h3>
                <p className={`text-sm ${textSecondary}`}>Track attendance performance and encourage regular attendance</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${textPrimary}`}>{currentChild.attendance || 0}%</div>
              <div className={`text-sm ${textMuted}`}>This Month</div>
              <div className="w-24 bg-green-200 rounded-full h-2 mt-1">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${currentChild.attendance || 0}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-blue-500" />
                <span className={`text-xs font-medium ${textSecondary}`}>Present</span>
              </div>
              <div className={`text-sm font-bold ${textPrimary} mt-1`}>17/20</div>
            </div>
            <div className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3 text-purple-500" />
                <span className={`text-xs font-medium ${textSecondary}`}>Target</span>
              </div>
              <div className={`text-sm font-bold ${textPrimary} mt-1`}>90%</div>
            </div>
            <div className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-orange-500" />
                <span className={`text-xs font-medium ${textSecondary}`}>Streak</span>
              </div>
              <div className={`text-sm font-bold ${textPrimary} mt-1`}>5 days</div>
            </div>
          </div>
          
          <div className="mt-3 flex space-x-2">
            <button 
              onClick={() => setActiveTab('child-attendance')}
              className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
            >
              <Clock className="w-3 h-3" />
              <span>View Details</span>
            </button>
          </div>
        </div>

        {/* Teacher Ratings Analysis */}
        <div className={`rounded-lg shadow-sm border p-3 ${bgCard}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className={`text-base font-semibold ${textPrimary}`}>Teacher Ratings Analysis</h3>
                <p className={`text-sm ${textSecondary}`}>See how teachers are rated by students</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('teacher-ratings')}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>View All</span>
            </button>
          </div>

          {/* Top Rated Teachers */}
          <div className="mb-4">
            <h4 className={`text-sm font-medium ${textPrimary} mb-3`}>Top Rated Teachers</h4>
            <div className="space-y-2">
              {teacherRatings
                .sort((a, b) => b.overallRating - a.overallRating)
                .slice(0, 3)
                .map((teacher, index) => (
                <div key={teacher.id} className={`rounded-lg p-3 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">{teacher.avatar}</span>
                      </div>
                      <div>
                        <h5 className={`font-medium ${textPrimary}`}>{teacher.name}</h5>
                        <p className={`text-sm ${textSecondary}`}>{teacher.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className={`font-bold ${textPrimary}`}>{teacher.overallRating}</span>
                      </div>
                      <div className={`text-xs ${textSecondary}`}>{teacher.totalRatings} ratings</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Criteria Overview */}
          <div className="mb-4">
            <h4 className={`text-sm font-medium ${textPrimary} mb-3`}>Rating Criteria Overview</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center space-x-1 mb-1">
                  <BarChart3 className="w-3 h-3 text-blue-500" />
                  <span className={`text-xs font-medium ${textSecondary}`}>Clarity</span>
                </div>
                <div className={`text-sm font-bold ${textPrimary}`}>
                  {(teacherRatings.reduce((sum, t) => sum + t.criteria.clarity, 0) / teacherRatings.length).toFixed(1)}
                </div>
              </div>
              <div className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center space-x-1 mb-1">
                  <BarChart3 className="w-3 h-3 text-green-500" />
                  <span className={`text-xs font-medium ${textSecondary}`}>Organization</span>
                </div>
                <div className={`text-sm font-bold ${textPrimary}`}>
                  {(teacherRatings.reduce((sum, t) => sum + t.criteria.organization, 0) / teacherRatings.length).toFixed(1)}
                </div>
              </div>
              <div className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center space-x-1 mb-1">
                  <BarChart3 className="w-3 h-3 text-purple-500" />
                  <span className={`text-xs font-medium ${textSecondary}`}>Engagement</span>
                </div>
                <div className={`text-sm font-bold ${textPrimary}`}>
                  {(teacherRatings.reduce((sum, t) => sum + t.criteria.participation, 0) / teacherRatings.length).toFixed(1)}
                </div>
              </div>
              <div className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center space-x-1 mb-1">
                  <BarChart3 className="w-3 h-3 text-orange-500" />
                  <span className={`text-xs font-medium ${textSecondary}`}>Fairness</span>
                </div>
                <div className={`text-sm font-bold ${textPrimary}`}>
                  {(teacherRatings.reduce((sum, t) => sum + t.criteria.fairness, 0) / teacherRatings.length).toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Comments */}
          <div>
            <h4 className={`text-sm font-medium ${textPrimary} mb-3`}>Recent Student Feedback</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {teacherRatings
                .flatMap(teacher => teacher.recentComments.map(comment => ({ teacher: teacher.name, comment })))
                .slice(0, 3)
                .map((item, index) => (
                <div key={index} className={`rounded-lg p-2 border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${textSecondary}`}>
                        <span className="font-medium">{item.teacher}:</span> {item.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button 
              onClick={() => setActiveTab('teacher-ratings')}
              className="bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-1 text-sm"
            >
              <BarChart3 className="w-3 h-3" />
              <span>View Detailed Analysis</span>
            </button>
          </div>
        </div>

        {/* Student Daily Schedule */}
        <div className={`rounded-lg shadow-sm border p-3 ${bgCard}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className={`text-base font-semibold ${textPrimary}`}>{currentChild.name}'s Daily Schedule</h3>
                <p className={`text-sm ${textSecondary}`}>Today's classes and activities</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('timetable')}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
            >
              <Eye className="w-3 h-3" />
              <span>View Full Timetable</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {[
              { time: '08:00', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', type: 'class' },
              { time: '09:00', subject: 'English', teacher: 'Ms. Smith', room: 'Room 102', type: 'class' },
              { time: '10:00', subject: 'Break', teacher: '', room: '', type: 'break' },
              { time: '10:15', subject: 'Science', teacher: 'Dr. Brown', room: 'Lab 1', type: 'class' },
              { time: '11:15', subject: 'History', teacher: 'Mr. Taylor', room: 'Room 103', type: 'class' },
              { time: '12:15', subject: 'Lunch', teacher: '', room: '', type: 'break' },
              { time: '13:15', subject: 'Geography', teacher: 'Ms. Anderson', room: 'Room 104', type: 'class' },
              { time: '14:15', subject: 'Physical Education', teacher: 'Coach Wilson', room: 'Sports Hall', type: 'activity' }
            ].map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-2 rounded-lg border ${
                item.type === 'break' 
                  ? darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  : darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === 'break' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Clock className={`w-4 h-4 ${item.type === 'break' ? 'text-yellow-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${textPrimary}`}>{item.time}</p>
                    <p className={`text-sm ${textSecondary}`}>{item.subject}</p>
                    {item.teacher && (
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.teacher} • {item.room}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === 'break' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : item.type === 'activity'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.type === 'break' ? 'Break' : item.type === 'activity' ? 'Activity' : 'Class'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <TopPerformingStudents userRole="parent" darkMode={darkMode} />

        {/* Top Most Active Students */}
        <TopMostActiveStudents userRole="parent" currentUser={currentUser} darkMode={darkMode} setActiveTab={setActiveTab} />

        {/* Empty State Message */}
        {children.length === 0 && (
          <div className={`rounded-xl shadow-lg border p-8 text-center ${bgCard}`}>
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>No Data Available</h3>
            <p className={`${textSecondary} mb-6`}>
              Your children's data will appear here once they are registered in the system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveTab('children')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Manage Children
              </button>
              <button
                onClick={() => setActiveTab('messaging')}
                className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Contact School
              </button>
            </div>
          </div>
        )}
      </div>
      {/* AI Tutor Form */}
      <AITutorForm 
        userRole="parent" 
        isOpen={showAITutorForm} 
        onClose={() => setShowAITutorForm(false)} 
      />
    </div>
  );
};

export default ParentDashboard;
