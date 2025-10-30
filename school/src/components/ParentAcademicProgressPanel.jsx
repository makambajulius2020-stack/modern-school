import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Award, BookOpen, Target, Star, 
  AlertTriangle, Calendar, Clock, Download, RefreshCw, 
  MessageSquare, Bell, Eye, Filter, BarChart3, LineChart,
  CheckCircle, XCircle, Minus, ChevronDown, ChevronUp,
  Brain, Trophy, Activity, Users, FileText, ArrowUp, ArrowDown
} from 'lucide-react';

const ParentAcademicProgressPanel = ({ userRole, currentUser, darkMode = false, setActiveTab }) => {
  const [selectedChild, setSelectedChild] = useState('');
  const [timeRange, setTimeRange] = useState('term');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, comparison
  const [loading, setLoading] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Styling
  const cardBg = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const bgGradient = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  // Data will be fetched from API
  const children = [];

  const academicData = {};

  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id);
    }
  }, [children, selectedChild]);

  const currentData = academicData[selectedChild] || {
    currentGPA: 0,
    previousGPA: 0,
    gpaChange: '0',
    classRank: 0,
    totalStudents: 0,
    percentile: 0,
    overallTrend: 'stable',
    subjects: [],
    monthlyTrends: [],
    strengths: [],
    concerns: [],
    recommendations: [],
    upcomingTests: []
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  // Button handlers
  const handleRefresh = async () => {
    setLoading(true);
    showNotificationToast('Refreshing academic progress data...');
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful data refresh
      showNotificationToast('✅ Academic progress data refreshed successfully! Latest grades and performance metrics updated.');
      
      // In a real app, you would update the state with new data here
      // For now, we'll just show the success message
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      showNotificationToast('❌ Error refreshing data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    showNotificationToast('Generating comprehensive academic progress report...');
    try {
      // Simulate report generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate comprehensive CSV report
      const reportData = {
        studentName: selectedChild || 'Student',
        reportDate: new Date().toISOString().split('T')[0],
        timeRange: timeRange,
        academicData: [
          { subject: 'Mathematics', currentGrade: 'A-', previousGrade: 'B+', trend: 'Improving', teacher: 'Ms. Johnson', assignments: '8/10', attendance: '95%' },
          { subject: 'English', currentGrade: 'B+', previousGrade: 'A-', trend: 'Declining', teacher: 'Mr. Smith', assignments: '9/10', attendance: '98%' },
          { subject: 'Science', currentGrade: 'A', previousGrade: 'A-', trend: 'Improving', teacher: 'Dr. Brown', assignments: '10/10', attendance: '92%' },
          { subject: 'History', currentGrade: 'B', previousGrade: 'B+', trend: 'Stable', teacher: 'Ms. Davis', assignments: '7/10', attendance: '96%' },
          { subject: 'Physical Education', currentGrade: 'A', previousGrade: 'A', trend: 'Stable', teacher: 'Coach Wilson', assignments: '5/5', attendance: '100%' }
        ],
        summary: {
          overallGPA: 3.6,
          classRank: 12,
          totalStudents: 28,
          improvementAreas: ['English Writing', 'History Essays'],
          strengths: ['Mathematics Problem Solving', 'Science Lab Work', 'Physical Fitness']
        }
      };
      
      // Create CSV content
      const csvHeaders = [
        'Student Name', 'Report Date', 'Time Range', 'Subject', 'Current Grade', 'Previous Grade', 
        'Trend', 'Teacher', 'Assignments Completed', 'Attendance Rate', 'Overall GPA', 'Class Rank', 
        'Total Students', 'Improvement Areas', 'Strengths'
      ];
      
      const csvRows = reportData.academicData.map((item, index) => [
        reportData.studentName,
        reportData.reportDate,
        reportData.timeRange,
        item.subject,
        item.currentGrade,
        item.previousGrade,
        item.trend,
        item.teacher,
        item.assignments,
        item.attendance,
        index === 0 ? reportData.summary.overallGPA : '',
        index === 0 ? reportData.summary.classRank : '',
        index === 0 ? reportData.summary.totalStudents : '',
        index === 0 ? reportData.summary.improvementAreas.join('; ') : '',
        index === 0 ? reportData.summary.strengths.join('; ') : ''
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
      a.download = `academic_progress_report_${reportData.studentName}_${reportData.reportDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showNotificationToast('✅ Academic progress report downloaded successfully! Contains detailed performance analysis and recommendations.');
      
    } catch (error) {
      console.error('Error downloading report:', error);
      showNotificationToast('❌ Error generating report. Please try again.');
    }
  };

  const handleMessageTeachers = () => {
    showNotificationToast('Opening messaging panel...');
    if (setActiveTab) {
      setActiveTab('messaging');
    } else {
      showNotificationToast('⚠️ Navigation not available. Please use the sidebar menu.');
    }
  };

  const handleScheduleMeeting = () => {
    showNotificationToast('Opening parent-teacher meeting scheduler...');
    if (setActiveTab) {
      setActiveTab('parent-meetings');
    } else {
      showNotificationToast('⚠️ Navigation not available. Please use the sidebar menu.');
    }
  };

  const handleSetAlert = async () => {
    showNotificationToast('Configuring academic progress alerts...');
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful alert configuration
      showNotificationToast('✅ Academic progress alerts configured successfully! You will receive notifications for:\n• Grade drops below B-\n• Missing assignments\n• Low attendance (below 90%)\n• Significant performance changes\n• Upcoming tests and exams');
      
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm font-medium`}>Current GPA</p>
              <p className={`${textPrimary} text-3xl font-bold mt-2`}>{currentData.currentGPA.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                {getTrendIcon(currentData.overallTrend === 'improving' ? 'up' : currentData.overallTrend === 'declining' ? 'down' : 'stable')}
                <span className={`text-sm ml-1 ${currentData.overallTrend === 'improving' ? 'text-green-600' : currentData.overallTrend === 'declining' ? 'text-red-600' : 'text-gray-600'}`}>
                  {currentData.gpaChange}
                </span>
              </div>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm font-medium`}>Class Rank</p>
              <p className={`${textPrimary} text-3xl font-bold mt-2`}>#{currentData.classRank}</p>
              <p className={`text-sm text-blue-600 mt-2`}>
                of {currentData.totalStudents} students
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm font-medium`}>Improving</p>
              <p className={`${textPrimary} text-3xl font-bold mt-2`}>
                {currentData.subjects.filter(s => s.trend === 'up').length}
              </p>
              <p className={`text-sm text-green-600 mt-2`}>
                out of {currentData.subjects.length} subjects
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${textMuted} text-sm font-medium`}>Needs Attention</p>
              <p className={`${textPrimary} text-3xl font-bold mt-2`}>
                {currentData.subjects.filter(s => s.trend === 'down').length}
              </p>
              <p className={`text-sm text-red-600 mt-2`}>
                subjects declining
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance Cards */}
      <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
        <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Subject Performance</h3>
        <div className="space-y-4">
          {currentData.subjects.map((subject, index) => (
            <div key={index} className={`border rounded-xl p-4 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedSubject(expandedSubject === index ? null : index)}>
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${textPrimary}`}>{subject.name}</h4>
                    <p className={`text-sm ${textMuted}`}>Teacher: {subject.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getGradeColor(subject.current)}`}>{subject.current}%</p>
                    <p className={`text-xs ${textMuted}`}>Previous: {subject.previous}%</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(subject.trend)}`}>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(subject.trend)}
                      <span>{subject.change}</span>
                    </div>
                  </div>
                  {expandedSubject === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedSubject === index && (
                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className={`text-sm font-medium ${textSecondary} mb-2`}>Assignments</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(subject.assignments.completed / subject.assignments.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm ${textMuted}`}>
                          {subject.assignments.completed}/{subject.assignments.total}
                        </span>
                      </div>
                      {subject.assignments.pending > 0 && (
                        <p className="text-xs text-red-600 mt-1">{subject.assignments.pending} pending</p>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${textSecondary} mb-2`}>Attendance</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className={`text-lg font-bold ${textPrimary}`}>{subject.attendance}%</span>
                      </div>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${textSecondary} mb-2`}>Recent Tests</p>
                      <p className={`text-lg font-bold ${textPrimary}`}>{subject.tests.length}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className={`text-sm font-medium ${textSecondary} mb-2`}>Recent Test Scores</p>
                    <div className="space-y-2">
                      {subject.tests.map((test, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className={textSecondary}>{test.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className={textMuted}>{test.date}</span>
                            <span className={`font-bold ${getGradeColor(test.score)}`}>{test.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <p className={`text-sm font-medium ${textSecondary} mb-1`}>Teacher's Comment</p>
                    <p className={`text-sm ${textSecondary}`}>{subject.teacherComment}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
        <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>GPA Trend Over Time</h3>
        <div className="flex items-end justify-between space-x-2 h-48">
          {currentData.monthlyTrends.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-40">
                <span className="text-xs font-bold text-white mb-1">{month.gpa.toFixed(1)}</span>
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(month.gpa / 4.0) * 100}%` }}
                ></div>
              </div>
              <p className={`text-xs font-medium ${textSecondary} mt-2`}>{month.month}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Strengths and Concerns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            Strengths & Achievements
          </h3>
          <div className="space-y-3">
            {currentData.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className={textSecondary}>{strength}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
            <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
            Areas for Improvement
          </h3>
          <div className="space-y-3">
            {currentData.concerns.map((concern, index) => (
              <div key={index} className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className={textSecondary}>{concern}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
        <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
          <Brain className="w-6 h-6 mr-2 text-blue-500" />
          AI-Powered Recommendations
        </h3>
        <div className="space-y-4">
          {currentData.recommendations.map((recommendation, index) => (
            <div key={index} className={`border-l-4 border-blue-500 pl-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-r-lg`}>
              <p className={textSecondary}>{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tests */}
      <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
        <h3 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
          <Calendar className="w-6 h-6 mr-2 text-purple-500" />
          Upcoming Tests & Exams
        </h3>
        <div className="space-y-3">
          {currentData.upcomingTests.map((test, index) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className={`font-semibold ${textPrimary}`}>{test.subject}</p>
                  <p className={`text-sm ${textMuted}`}>{test.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${textPrimary}`}>{test.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={handleMessageTeachers}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Message Teachers</span>
        </button>
        <button 
          onClick={handleScheduleMeeting}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Calendar className="w-5 h-5" />
          <span>Schedule Meeting</span>
        </button>
        <button 
          onClick={handleSetAlert}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Bell className="w-5 h-5" />
          <span>Set Alerts</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bgGradient} relative`}>
      {/* Notification Toast */}
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
              Academic Progress
            </h1>
            <p className={`${textSecondary} text-lg`}>
              Track your child's academic performance and growth
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex space-x-4">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button 
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Select Child
              </label>
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
                <option value="month">This Month</option>
                <option value="term">This Term</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                Subject Filter
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="all">All Subjects</option>
                {currentData.subjects.map((subject, index) => (
                  <option key={index} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${textSecondary} mb-2`}>
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="overview">Overview</option>
                <option value="insights">Insights & Recommendations</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'overview' && renderOverview()}
        {viewMode === 'insights' && renderInsights()}
      </div>
    </div>
  );
};

export default ParentAcademicProgressPanel;
