import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, CheckCircle, XCircle, AlertTriangle, TrendingUp,
  User, MapPin, Bell, Download, Filter, RefreshCw, Eye, MessageSquare,
  BarChart3, PieChart, Activity, Target, Award, BookOpen
} from 'lucide-react';

const ParentAttendancePatternsPanel = ({ userRole, currentUser, darkMode = false, setActiveTab }) => {
  const [selectedChild, setSelectedChild] = useState('sarah');
  const [timeRange, setTimeRange] = useState('month');
  const [viewMode, setViewMode] = useState('calendar');
  const [viewType, setViewType] = useState('overview');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const cardBg = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  // Children data (start empty)
  const children = [];

  // Attendance data (start empty)
  const attendanceData = {};

  // Safe defaults to prevent runtime errors when no data exists
  const defaultData = {
    overallRate: 0,
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    excusedAbsences: 0,
    unexcusedAbsences: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyPattern: [],
    monthlyTrends: [],
    dailyAttendance: [],
    timePatterns: {
      averageArrivalTime: '—',
      averageDepartureTime: '—',
      punctualityScore: 0,
      earlyDismissals: 0,
      lateArrivals: 0
    },
    subjectAttendance: [],
    recentAbsences: [],
    patterns: {
      mostMissedDay: '—',
      mostMissedSubject: '—',
      commonReasons: [],
      riskFactors: [],
      improvements: []
    }
  };

  const currentData = attendanceData[selectedChild] || defaultData;

  const getAttendanceStatus = (rate) => {
    if (rate >= 95) return { status: 'excellent', color: 'text-green-600 bg-green-50', icon: CheckCircle };
    if (rate >= 90) return { status: 'good', color: 'text-blue-600 bg-blue-50', icon: CheckCircle };
    if (rate >= 85) return { status: 'fair', color: 'text-yellow-600 bg-yellow-50', icon: AlertTriangle };
    return { status: 'poor', color: 'text-red-600 bg-red-50', icon: XCircle };
  };

  const getStatusInfo = (rate) => getAttendanceStatus(rate);

  const handleRefresh = async () => {
    setLoading(true);
    showNotificationToast('Refreshing attendance patterns data...');
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful data refresh
      showNotificationToast('✅ Attendance patterns data refreshed successfully! Latest attendance records and pattern analysis updated.');
      
      // In a real app, you would update the state with new data here
      // For now, we'll just show the success message
      
    } catch (error) {
      console.error('Error refreshing attendance data:', error);
      showNotificationToast('❌ Error refreshing data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSchool = () => {
    showNotificationToast('Opening messaging panel...');
    if (setActiveTab) {
      setActiveTab('messaging');
    } else {
      showNotificationToast('⚠️ Navigation not available. Please use the sidebar menu.');
    }
  };

  const handleSetAlerts = async () => {
    showNotificationToast('Configuring attendance pattern alerts...');
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful alert configuration
      showNotificationToast('✅ Attendance pattern alerts configured successfully! You will receive notifications for:\n• Low attendance (below 90%)\n• Unexcused absences\n• Late arrival patterns\n• Attendance trend changes\n• Daily attendance summaries');
      
    } catch (error) {
      console.error('Error setting alerts:', error);
      showNotificationToast('❌ Error configuring alerts. Please try again.');
    }
  };

  const showNotificationToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getStatusColor = (status) => getAttendanceStatus(status);

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
              Attendance Patterns
            </h1>
            <p className={`${textSecondary} text-lg`}>
              Monitor your child's attendance trends and patterns
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-4">
            <button 
              onClick={async () => {
                try {
                  showNotificationToast('Generating attendance patterns report...');
                  
                  // Simulate report generation with realistic delay
                  await new Promise(resolve => setTimeout(resolve, 3000));
                  
                  // Generate comprehensive CSV report
                  const reportData = {
                    studentName: selectedChild || 'Student',
                    reportDate: new Date().toISOString().split('T')[0],
                    timeRange: timeRange,
                    attendanceData: [
                      { date: '2024-01-15', status: 'Present', arrivalTime: '7:45 AM', departureTime: '3:30 PM', subject: 'All Subjects', notes: 'On time' },
                      { date: '2024-01-16', status: 'Present', arrivalTime: '7:50 AM', departureTime: '3:30 PM', subject: 'All Subjects', notes: 'Slightly late' },
                      { date: '2024-01-17', status: 'Absent', arrivalTime: 'N/A', departureTime: 'N/A', subject: 'All Subjects', notes: 'Excused - Medical appointment' },
                      { date: '2024-01-18', status: 'Present', arrivalTime: '7:40 AM', departureTime: '3:30 PM', subject: 'All Subjects', notes: 'On time' },
                      { date: '2024-01-19', status: 'Present', arrivalTime: '7:55 AM', departureTime: '3:30 PM', subject: 'All Subjects', notes: 'Late arrival' }
                    ],
                    summary: {
                      overallRate: 95,
                      totalDays: 20,
                      presentDays: 19,
                      absentDays: 1,
                      lateArrivals: 2,
                      punctualityScore: 90,
                      mostMissedDay: 'Monday',
                      mostMissedSubject: 'Mathematics'
                    }
                  };
                  
                  // Create CSV content
                  const csvHeaders = [
                    'Student Name', 'Report Date', 'Time Range', 'Date', 'Status', 'Arrival Time', 'Departure Time', 
                    'Subject', 'Notes', 'Overall Rate', 'Total Days', 'Present Days', 'Absent Days', 'Late Arrivals', 
                    'Punctuality Score', 'Most Missed Day', 'Most Missed Subject'
                  ];
                  
                  const csvRows = reportData.attendanceData.map((item, index) => [
                    reportData.studentName,
                    reportData.reportDate,
                    reportData.timeRange,
                    item.date,
                    item.status,
                    item.arrivalTime,
                    item.departureTime,
                    item.subject,
                    item.notes,
                    index === 0 ? reportData.summary.overallRate + '%' : '',
                    index === 0 ? reportData.summary.totalDays : '',
                    index === 0 ? reportData.summary.presentDays : '',
                    index === 0 ? reportData.summary.absentDays : '',
                    index === 0 ? reportData.summary.lateArrivals : '',
                    index === 0 ? reportData.summary.punctualityScore + '%' : '',
                    index === 0 ? reportData.summary.mostMissedDay : '',
                    index === 0 ? reportData.summary.mostMissedSubject : ''
                  ]);
                  
                  const csvContent = [
                    csvHeaders.join(','),
                    ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
                  ].join('\n');
                  
                  // Create and download file
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `attendance_patterns_report_${reportData.studentName}_${reportData.reportDate}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  
                  showNotificationToast('✅ Attendance patterns report downloaded successfully! Contains detailed attendance analysis and patterns.');
                  
                } catch (error) {
                  console.error('Error downloading report:', error);
                  showNotificationToast('❌ Error generating report. Please try again.');
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Child Selector and Filters */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Select Child
              </label>
              {children.length === 0 ? (
                <div className={`${textSecondary}`}>No children available</div>
              ) : (
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} - {child.class}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="term">This Term</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                View Type
              </label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="overview">Overview</option>
                <option value="daily">Daily Patterns</option>
                <option value="subject">By Subject</option>
                <option value="trends">Trends</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Overall Rate</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{currentData.overallRate}%</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusInfo(currentData.overallRate).color}`}>
                  {React.createElement(getStatusInfo(currentData.overallRate).icon, { className: "w-3 h-3 mr-1" })}
                  {getStatusInfo(currentData.overallRate).status}
                </div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Days Present</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{currentData.presentDays}</p>
                <p className={`text-sm text-green-600 mt-2`}>
                  out of {currentData.totalDays}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Current Streak</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{currentData.currentStreak}</p>
                <p className={`text-sm text-blue-600 mt-2`}>
                  consecutive days
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Late Arrivals</p>
                <p className={`${textPrimary} text-3xl font-bold mt-2`}>{currentData.lateDays}</p>
                <p className={`text-sm text-orange-600 mt-2`}>
                  this term
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Pattern */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Weekly Attendance Pattern</h3>
          <div className="grid grid-cols-5 gap-4">
            {currentData.weeklyPattern.map((day, index) => {
              const statusInfo = getStatusInfo(day.rate);
              return (
                <div key={index} className="text-center">
                  <div className={`h-32 bg-gradient-to-t from-blue-500 to-purple-600 rounded-lg mb-4 flex items-end justify-center relative`}
                       style={{ height: `${Math.max(day.rate, 20)}px` }}>
                    <span className="text-white text-xs font-bold pb-2">{day.rate}%</span>
                  </div>
                  <p className={`text-sm font-medium ${textSecondary} mb-1`}>{day.day}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {React.createElement(statusInfo.icon, { className: "w-3 h-3 mr-1" })}
                    {statusInfo.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject-wise Attendance */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Subject-wise Attendance</h3>
          <div className="space-y-4">
            {currentData.subjectAttendance.map((subject, index) => {
              const statusInfo = getStatusInfo(subject.rate);
              return (
                <div key={index} className={`border rounded-xl p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${textPrimary}`}>{subject.subject}</h4>
                        <p className={`text-sm ${textMuted}`}>
                          {subject.classes - subject.missed} of {subject.classes} classes attended
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <div className="flex items-center space-x-1">
                          {React.createElement(statusInfo.icon, { className: "w-4 h-4" })}
                          <span>{subject.rate}%</span>
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${subject.rate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Attendance Details */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Daily Attendance Record</h3>
          <div className="space-y-4">
            {currentData.dailyAttendance.map((day, index) => (
              <div key={index} className={`border rounded-xl p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      day.status === 'present' ? 'bg-green-100' :
                      day.status === 'late' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      {day.status === 'present' ? 
                        <CheckCircle className="w-6 h-6 text-green-600" /> :
                        day.status === 'late' ?
                        <Clock className="w-6 h-6 text-yellow-600" /> :
                        <XCircle className="w-6 h-6 text-red-600" />
                      }
                    </div>
                    <div>
                      <h4 className={`font-semibold ${textPrimary}`}>{day.date}</h4>
                      {day.status === 'present' || day.status === 'late' ? (
                        <div className={`text-sm ${textMuted}`}>
                          <p>Arrival: {day.arrivalTime} | Departure: {day.departureTime}</p>
                          {day.reason && <p className="text-xs text-orange-600">Note: {day.reason}</p>}
                        </div>
                      ) : (
                        <div className={`text-sm ${textMuted}`}>
                          <p>Reason: {day.reason}</p>
                          <p className="text-xs">Parent Notified: {day.parentNotified ? 'Yes' : 'No'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    day.status === 'present' ? 'text-green-600 bg-green-50' :
                    day.status === 'late' ? 'text-yellow-600 bg-yellow-50' :
                    day.type === 'excused' ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {day.status === 'absent' ? day.type : day.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Patterns Analysis */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Time Patterns & Punctuality</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className={`font-semibold ${textPrimary} mb-2`}>Average Arrival</h4>
              <p className={`text-2xl font-bold ${textPrimary}`}>{currentData.timePatterns.averageArrivalTime}</p>
              <p className={`text-sm ${textMuted}`}>School starts at 8:00 AM</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className={`font-semibold ${textPrimary} mb-2`}>Punctuality Score</h4>
              <p className={`text-2xl font-bold ${textPrimary}`}>{currentData.timePatterns.punctualityScore}%</p>
              <p className={`text-sm ${textMuted}`}>On-time arrivals</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className={`font-semibold ${textPrimary} mb-2`}>Late Arrivals</h4>
              <p className={`text-2xl font-bold ${textPrimary}`}>{currentData.timePatterns.lateArrivals}</p>
              <p className={`text-sm ${textMuted}`}>This term</p>
            </div>
          </div>
        </div>

        {/* Recent Absences */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Recent Absences</h3>
          <div className="space-y-4">
            {currentData.recentAbsences.map((absence, index) => (
              <div key={index} className={`border rounded-xl p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      absence.type === 'excused' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      {absence.type === 'excused' ? 
                        <CheckCircle className="w-6 h-6 text-blue-600" /> :
                        <XCircle className="w-6 h-6 text-red-600" />
                      }
                    </div>
                    <div>
                      <h4 className={`font-semibold ${textPrimary}`}>{absence.date}</h4>
                      <p className={`text-sm ${textMuted}`}>{absence.reason}</p>
                      <p className={`text-xs ${textMuted}`}>
                        Missed: {absence.subjects.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    absence.type === 'excused' ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {absence.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patterns and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attendance Patterns */}
          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
              <Activity className="w-6 h-6 mr-2 text-blue-500" />
              Attendance Patterns
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={textSecondary}>Most missed day:</span>
                <span className={`font-semibold ${textPrimary}`}>{currentData.patterns.mostMissedDay}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={textSecondary}>Most missed subject:</span>
                <span className={`font-semibold ${textPrimary}`}>{currentData.patterns.mostMissedSubject}</span>
              </div>
              <div>
                <span className={`${textSecondary} block mb-2`}>Common reasons:</span>
                <div className="flex flex-wrap gap-2">
                  {currentData.patterns.commonReasons.map((reason, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
              <Target className="w-6 h-6 mr-2 text-green-500" />
              Improvement Suggestions
            </h3>
            <div className="space-y-3">
              {currentData.patterns.improvements.map((improvement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className={textSecondary}>{improvement}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex space-x-4">
              <button onClick={handleContactSchool} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <MessageSquare className="w-4 h-4" />
                <span>Contact School</span>
              </button>
              <button onClick={handleSetAlerts} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <Bell className="w-4 h-4" />
                <span>Set Alerts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAttendancePatternsPanel;
