import React, { useState } from 'react';
import { 
  Award, Clock, BookOpen, TrendingUp, Star, AlertTriangle, 
  CheckCircle, MessageSquare, Download, Calendar, Bell, Activity
} from 'lucide-react';

const ParentChildAnalyticsPanel = ({ userRole, currentUser, darkMode = false, setActiveTab }) => {
  const [selectedChild, setSelectedChild] = useState('sarah');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const cardBg = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  // Parent's children data (start empty)
  const children = [];

  // Child performance data for parents (start empty)
  const childData = {};

  const defaultChild = {
    id: 'none',
    name: '—',
    class: '',
    photo: '',
    studentId: '',
    age: 0,
    dateOfBirth: '',
    currentGPA: 0,
    attendance: 0,
    bloodGroup: '',
    allergies: [],
    medicalConditions: [],
    emergencyContact: { name: '—', relationship: '—', phone: '—', email: '—' },
    subjects: [],
    recentActivities: [],
    upcomingEvents: [],
    behaviorReport: {},
    fees: { totalDue: 0, paid: 0, balance: 0, dueDate: '', paymentHistory: [] },
    extracurricular: [],
    assignments: [],
    examSchedule: [],
    medicalRecords: { vaccinations: [], checkups: [], medications: [], healthAlerts: [] },
    transport: { method: '', route: '', pickupTime: '', dropoffTime: '', driverName: '', driverPhone: '', busNumber: '' },
    meals: { plan: '', preferences: [], allergies: [], specialDiet: '', monthlyFee: 0 },
    progressCharts: { academicTrend: [], attendanceTrend: [] },
    academicAnalytics: { classRank: 0, totalStudents: 0, percentile: 0, strongSubjects: [], weakSubjects: [], improvementAreas: [], studyRecommendations: [] },
    unebPreparation: { targetGrade: '', currentPrediction: '', readinessScore: 0, subjectReadiness: [], recommendations: [] }
  };

  const currentChild = children.find(c => c.id === selectedChild) || defaultChild;
  const defaultData = {
    currentGPA: 0,
    classRank: 0,
    totalStudents: 0,
    attendanceRate: 0,
    behaviorScore: 0,
    subjects: [],
    recentTests: [],
    teacherComments: [],
    achievements: [],
    concerns: []
  };
  const data = childData[selectedChild] || defaultData;

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleMessageTeachers = () => {
    showNotificationToast('Opening messaging panel...');
    if (setActiveTab) setTimeout(() => setActiveTab('messaging'), 500);
  };

  const handleScheduleMeeting = () => {
    showNotificationToast('Opening meeting scheduler...');
    if (setActiveTab) setTimeout(() => setActiveTab('meetings'), 500);
  };

  const handleDownloadReport = () => {
    showNotificationToast('Generating report...');
    setTimeout(() => showNotificationToast('Report downloaded!'), 2000);
  };

  const showNotificationToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} relative`}>
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border rounded-xl shadow-2xl p-4 flex items-center space-x-3 min-w-[300px]`}>
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <p className={`${textPrimary} text-sm font-medium`}>{notificationMessage}</p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className={`text-3xl lg:text-4xl font-bold ${textPrimary} mb-2`}>
              Child Analytics
            </h1>
            <p className={`${textSecondary} text-lg`}>
              Monitor your child's academic progress and performance
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            {children.length === 0 ? (
              <div className={`${textSecondary}`}>No children available</div>
            ) : (
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name} - {child.class}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Child Profile */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <div className="flex items-center space-x-6">
            <img 
              src={currentChild.photo} 
              alt={currentChild.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
            />
            <div>
              <h2 className={`text-2xl font-bold ${textPrimary}`}>{currentChild.name}</h2>
              <p className={`${textSecondary} text-lg`}>{currentChild.class}</p>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Current GPA</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{data.currentGPA}</p>
                <p className={`text-sm text-blue-600 mt-1`}>
                  Rank #{data.classRank} of {data.totalStudents}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Attendance</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{data.attendanceRate}%</p>
                <p className={`text-sm text-green-600 mt-1`}>Excellent</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Behavior</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{data.behaviorScore}</p>
                <p className={`text-sm text-purple-600 mt-1`}>Outstanding</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Subjects</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{data.subjects.length}</p>
                <p className={`text-sm text-orange-600 mt-1`}>Enrolled</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Subject Performance</h3>
          <div className="space-y-4">
            {data.subjects.map((subject, index) => (
              <div key={index} className={`border rounded-xl p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className={`font-semibold ${textPrimary}`}>{subject.name}</h4>
                    <p className={`text-sm ${textMuted}`}>Teacher: {subject.teacher}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getTrendIcon(subject.trend)}
                    <span className={`text-2xl font-bold ${textPrimary}`}>{subject.grade}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                    style={{ width: `${subject.grade}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Recent Test Results</h3>
          <div className="space-y-4">
            {data.recentTests.map((test, index) => (
              <div key={index} className={`border rounded-xl p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${textPrimary}`}>{test.subject} - {test.type}</h4>
                    <p className={`text-sm ${textMuted}`}>{test.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${textPrimary}`}>{test.score}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Comments */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Teacher Comments</h3>
          <div className="space-y-4">
            {data.teacherComments.map((comment, index) => (
              <div key={index} className={`border-l-4 border-blue-500 pl-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-r-lg`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-semibold ${textPrimary}`}>{comment.subject}</h4>
                  <span className={`text-sm ${textMuted}`}>{comment.teacher}</span>
                </div>
                <p className={textSecondary}>{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements and Concerns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-3">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className={textSecondary}>{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
              <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
              Areas for Attention
            </h3>
            <div className="space-y-3">
              {data.concerns.map((concern, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span className={textSecondary}>{concern}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={handleMessageTeachers} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
            <MessageSquare className="w-5 h-5" />
            <span>Message Teachers</span>
          </button>
         
          <button onClick={handleDownloadReport} className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentChildAnalyticsPanel;
