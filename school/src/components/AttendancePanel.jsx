import React, { useState, useEffect } from 'react';
import { Clock, Users, AlertTriangle, CheckCircle, Smartphone, CreditCard } from 'lucide-react';
import apiService from '../services/api';

const AttendancePanel = ({ userRole, currentUser }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAttendance();
        if (response.success && response.data && response.data.length > 0) {
          const attendanceRecords = response.data;
          const todayRecords = attendanceRecords.filter(record => {
            const recordDate = new Date(record.date).toDateString();
            const today = new Date().toDateString();
            return recordDate === today;
          });
          
          const presentCount = todayRecords.filter(r => r.status === 'present').length;
          const absentCount = todayRecords.filter(r => r.status === 'absent').length;
          const totalStudents = presentCount + absentCount || attendanceRecords.length;
          
          setAttendanceData({
            todayPresent: presentCount,
            todayAbsent: absentCount,
            totalStudents: totalStudents,
            attendanceRate: totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0,
            recentScans: attendanceRecords.slice(0, 10).map(record => ({
              id: record.id,
              name: record.student_name,
              time: new Date(record.check_in_time || record.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }),
              method: record.method || 'Biometric',
              status: record.status
            }))
          });
        } else {
          // No data from database - show empty state
          setAttendanceData({
            todayPresent: 0,
            todayAbsent: 0,
            totalStudents: 0,
            attendanceRate: 0,
            recentScans: []
          });
        }
      } catch (error) {
        console.error('Failed to connect to Python backend:', error);
        setAttendanceData({
          todayPresent: 0,
          todayAbsent: 0,
          totalStudents: 0,
          attendanceRate: 0,
          recentScans: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Track and manage student attendance with real-time data</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{attendanceData?.todayPresent || 0}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{attendanceData?.todayAbsent || 0}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{attendanceData?.totalStudents || 0}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-purple-600">{attendanceData?.attendanceRate || 0}%</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>


      {/* Recent Scans */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {attendanceData?.recentScans?.map((scan) => (
            <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  scan.status === 'present' ? 'bg-green-500' : 
                  scan.status === 'late' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{scan.name}</p>
                  <p className="text-sm text-gray-500">{scan.method} • {scan.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                scan.status === 'present' ? 'bg-green-100 text-green-800' :
                scan.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {scan.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendancePanel;
