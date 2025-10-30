import React, { useState, useEffect } from 'react';
import { 
  Users, User, Calendar, Award, TrendingUp, Clock, BookOpen, Phone, Mail, MapPin, 
  GraduationCap, Star, AlertCircle, BarChart3, Eye, Bell, Plus, Heart, Shield,
  MessageSquare, Download, Filter, RefreshCw, Edit, Trash2, CheckCircle, XCircle,
  AlertTriangle, Target, Activity, School, Home, CreditCard, DollarSign, FileText
} from 'lucide-react';

const ParentChildrenPanel = ({ userRole, currentUser, darkMode, setActiveTab }) => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  // Removed add child UX for parent overview
  const [notifications, setNotifications] = useState([]);

  // Load data from backend (no demo data)
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || '';

        // Fetch children
        const resChildren = await fetch(`${baseUrl}/api/parents/children`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null);
        if (resChildren && resChildren.ok) {
          const data = await resChildren.json();
          const list = Array.isArray(data?.children) ? data.children : [];
          setChildren(list);
          setSelectedChild(list[0] || null);
        } else {
          setChildren([]);
          setSelectedChild(null);
        }

        // Fetch notifications
        const resNotifs = await fetch(`${baseUrl}/api/parents/notifications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => null);
        if (resNotifs && resNotifs.ok) {
          const n = await resNotifs.json();
          setNotifications(Array.isArray(n?.notifications) ? n.notifications : []);
        } else {
          setNotifications([]);
        }
      } catch (e) {
        setChildren([]);
        setSelectedChild(null);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600 bg-green-100';
    if (grade >= 80) return 'text-blue-600 bg-blue-100';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return 'text-green-600 bg-green-100';
    if (attendance >= 90) return 'text-blue-600 bg-blue-100';
    if (attendance >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFeeStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Partial': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Children</p>
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {children.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Performance</p>
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(children.reduce((sum, child) => sum + child.averageGrade, 0) / children.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Attendance</p>
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.round(children.reduce((sum, child) => sum + child.attendance, 0) / children.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notifications</p>
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {notifications.filter(n => n.unread).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transport & Medical Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transport</h3>
            </div>
          </div>
          <div className="space-y-2">
            {children.length === 0 ? (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No transport information available</p>
            ) : (
              children.map((c) => (
                <div key={`transport-${c.id}`} className={`p-3 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.name}</p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>{c.transportRoute || 'No route assigned'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChild(c);
                        setActiveView('details');
                      }}
                      className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Shield className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Medical</h3>
            </div>
          </div>
          <div className="space-y-2">
            {children.length === 0 ? (
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>No medical information available</p>
            ) : (
              children.map((c) => (
                <div key={`medical-${c.id}`} className={`p-3 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.name}</p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>{c.medicalInfo || 'No medical notes'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedChild(c);
                        setActiveView('details');
                      }}
                      className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Children Performance Chart */}
      <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Children Performance Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {children.map((child) => (
              <div key={child.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <User className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {child.name}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {child.grade} • {child.class}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Grade</p>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(child.averageGrade)}`}>
                      {child.averageGrade}%
                    </span>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</p>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getAttendanceColor(child.attendance)}`}>
                      {child.attendance}%
                    </span>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fees</p>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getFeeStatusColor(child.feeStatus)}`}>
                      {child.feeStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Notifications
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${notification.unread ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                <div className="flex-1">
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {notification.message}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChildDetails = () => {
    if (!selectedChild) {
      return (
        <div className={`rounded-lg shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Child Selected
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Click on a child from the sidebar to view their details.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Child Profile Header */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <User className={`w-10 h-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedChild.name}
                </h2>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedChild.grade} • {selectedChild.class} • ID: {selectedChild.studentId}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Last Activity: {new Date(selectedChild.lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Age: {selectedChild.age} years
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAttendanceColor(selectedChild.attendance)}`}>
                  {selectedChild.attendance}% Attendance
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedChild.averageGrade)}`}>
                  {selectedChild.averageGrade}% Average
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getFeeStatusColor(selectedChild.feeStatus)}`}>
                  {selectedChild.feeStatus}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subjects</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedChild.subjects.length}
                </p>
              </div>
            </div>
          </div>
          <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming Exams</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedChild.upcomingExams.length}
                </p>
              </div>
            </div>
          </div>
          <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Achievements</p>
                <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedChild.achievements.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Performance */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Subject Performance
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedChild.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {subject.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {subject.teacher} • {subject.room}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.grade)}`}>
                    {subject.grade}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Grades
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {selectedChild.recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {grade.subject}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(grade.date).toLocaleDateString()} • {grade.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.grade)}`}>
                      {grade.grade}%
                    </span>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      out of {grade.maxGrade}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Upcoming Exams
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {selectedChild.upcomingExams.map((exam, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {exam.subject}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(exam.date).toLocaleDateString()} at {exam.time} • {exam.duration}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Room: {exam.room}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transport & Medical Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 border-b border-gray-200">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Transport Details
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Route</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedChild.transportRoute || 'No route assigned'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Home className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pickup/Drop</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Registered home address</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 border-b border-gray-200">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Medical Information
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notes</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedChild.medicalInfo || 'No medical notes on file'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Contact</p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedChild.emergencyContact || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extracurricular Activities */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Extracurricular Activities
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedChild.extracurricularActivities.map((activity, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.name}
                    </h4>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Coach/Teacher: {activity.coach || activity.teacher}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Schedule: {activity.schedule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Achievements
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {selectedChild.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {achievement.type} • {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance History */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Attendance
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {selectedChild.attendanceHistory.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      record.status === 'Present' ? 'bg-green-500' :
                      record.status === 'Late' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      record.status === 'Present' ? 'text-green-600' :
                      record.status === 'Late' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {record.status}
                    </span>
                    {record.time && (
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {record.time}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals & Targets */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Goals & Targets
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {selectedChild.goals.map((goal, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {goal.title}
                    </h4>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact & Emergency Info */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact & Emergency Information
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Emergency Contact</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChild.emergencyContact}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Transport Route</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChild.transportRoute}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Medical Information</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChild.medicalInfo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blood Type</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedChild.bloodType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Ratings - Parent feedback */}
        <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Rate Teachers</h3>
            <button
              onClick={() => setActiveTab && setActiveTab('teacher-ratings')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Open Ratings Page
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {selectedChild.subjects.slice(0, 3).map((subject, idx) => (
                <div key={`rate-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{subject.teacher}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{subject.name}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <button key={i} className={`w-6 h-6 rounded-full ${i < 4 ? 'bg-yellow-300' : 'bg-gray-300'}`}></button>
                    ))}
                  </div>
                </div>
              ))}
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Use the Teacher Ratings page for full feedback and comments</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading children information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg shadow-sm p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Children's Overview
              </h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage and monitor your children's academic progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {children.length} Child{children.length !== 1 ? 'ren' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="relative p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Children List Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Children
                  </h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setActiveView('overview')}
                      className={`p-1 rounded ${activeView === 'overview' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Overview"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveView('details')}
                      className={`p-1 rounded ${activeView === 'details' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => {
                      setSelectedChild(child);
                      setActiveView('details');
                    }}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedChild?.id === child.id
                        ? darkMode
                          ? 'bg-blue-900 border-blue-700'
                          : 'bg-blue-50 border-blue-200'
                        : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-gray-50 hover:bg-gray-100'
                    } border`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        <User className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {child.name}
                        </h4>
                        <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {child.grade} • {child.class}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(child.attendance)}`}>
                            {child.attendance}%
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(child.averageGrade)}`}>
                            {child.averageGrade}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeView === 'overview' ? renderOverview() : renderChildDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentChildrenPanel;