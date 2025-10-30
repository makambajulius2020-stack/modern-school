import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, DollarSign, Users, Download, Calendar, FileText, Filter } from 'lucide-react';

const ReportsPanel = ({ userRole, currentUser }) => {
  const [activeTab, setActiveTab] = useState('academic');
  const [dateRange, setDateRange] = useState('this-month');
  const [showCustomReportForm, setShowCustomReportForm] = useState(false);
  const [showScheduleReportForm, setShowScheduleReportForm] = useState(false);
  const [showBulkExportForm, setShowBulkExportForm] = useState(false);
  const isAdmin = userRole === 'admin';

  const academicReports = [];

  const attendanceReports = [];

  const financialReports = [];

  // Derived header stats (no demo values)
  const totalReports = academicReports.length + attendanceReports.length + financialReports.length;
  const thisMonthReports = 0; // replace with real count when dates are available
  const totalDataPoints = 0; // replace with real aggregation when wired to backend
  const automatedRate = 0; // percentage 0-100, replace when automation metrics exist

  const performanceMetrics = {
    academic: {
      totalStudents: 1245,
      averageGrade: 'B+',
      passRate: '87%',
      improvement: '+5.2%'
    },
    attendance: {
      averageAttendance: '92%',
      onTimeRate: '89%',
      absenteeism: '8%',
      trend: '+2.1%'
    },
    financial: {
      collectionRate: '78%',
      totalCollected: 'UGX 2.4B',
      outstanding: 'UGX 650M',
      efficiency: '+12%'
    }
  };

  const getReportsByTab = () => {
    switch (activeTab) {
      case 'academic':
      case 'performance':
        return academicReports;
      case 'attendance':
        return attendanceReports;
      case 'financial':
        return isAdmin ? financialReports : academicReports;
      default:
        return academicReports;
    }
  };

  const getCurrentMetrics = () => {
    switch (activeTab) {
      case 'academic':
      case 'performance':
        return performanceMetrics.academic;
      case 'attendance':
        return performanceMetrics.attendance;
      case 'financial':
        return isAdmin ? performanceMetrics.financial : performanceMetrics.academic;
      default:
        return performanceMetrics.academic;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Reports Generated</p>
              <p className="text-2xl font-bold text-blue-800">{totalReports}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">This Month</p>
              <p className="text-2xl font-bold text-green-800">{thisMonthReports}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Data Points</p>
              <p className="text-2xl font-bold text-purple-800">{totalDataPoints}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Automated</p>
              <p className="text-2xl font-bold text-yellow-800">{automatedRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'academic', label: 'Academic Reports', icon: BarChart3 },
              { id: 'attendance', label: 'Attendance Reports', icon: Clock },
              ...(isAdmin ? [{ id: 'financial', label: 'Financial Reports', icon: DollarSign }] : []),
              { id: 'performance', label: 'Performance Analytics', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="this-term">This Term</option>
                  <option value="this-year">This Year</option>
                </select>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </button>
          </div>

          {/* Current Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"></div>

          {/* Reports List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold capitalize">{activeTab} Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getReportsByTab().length === 0 ? (
                <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg col-span-2">No reports</div>
              ) : null}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-6 mt-8">
            <h4 className="font-medium mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setShowCustomReportForm(true)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                <h5 className="font-medium">Custom Report</h5>
                <p className="text-sm text-gray-600">Create a custom report with specific parameters</p>
              </button>
              <button 
                onClick={() => setShowScheduleReportForm(true)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <Calendar className="w-6 h-6 text-green-600 mb-2" />
                <h5 className="font-medium">Schedule Report</h5>
                <p className="text-sm text-gray-600">Set up automated report generation</p>
              </button>
              <button 
                onClick={() => setShowBulkExportForm(true)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <Download className="w-6 h-6 text-purple-600 mb-2" />
                <h5 className="font-medium">Bulk Export</h5>
                <p className="text-sm text-gray-600">Export multiple reports at once</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Report Form */}
      {showCustomReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                📊 Custom Report Builder
              </h3>
              <button
                onClick={() => setShowCustomReportForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <form id="custom-report-form" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Report Type *
                    </label>
                    <select className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                      <option value="">Select Report Type</option>
                      <option value="academic">Academic Performance Analysis</option>
                      <option value="attendance">Attendance Patterns</option>
                      <option value="financial">Financial Summary</option>
                      <option value="student-progress">Student Progress Tracking</option>
                      <option value="teacher-performance">Teacher Performance Metrics</option>
                      <option value="behavioral">Behavioral Analysis</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Date Range *
                    </label>
                    <select className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                      <option value="">Select Date Range</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="term">This Term</option>
                      <option value="year">This Year</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Filter by Class/Grade
                  </label>
                  <select className="w-full p-3 rounded-lg border bg-white border-gray-300">
                    <option value="">All Classes</option>
                    <option value="S1">Senior 1</option>
                    <option value="S2">Senior 2</option>
                    <option value="S3">Senior 3</option>
                    <option value="S4">Senior 4</option>
                    <option value="S5">Senior 5</option>
                    <option value="S6">Senior 6</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Data Visualization Type
                  </label>
                  <select className="w-full p-3 rounded-lg border bg-white border-gray-300">
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="table">Data Table</option>
                    <option value="mixed">Mixed Charts</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Export Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Excel</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">CSV</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">JSON</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    placeholder="Any specific requirements or notes for the report..."
                  />
                </div>
              </form>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCustomReportForm(false)}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="custom-report-form"
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Report Form */}
      {showScheduleReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                📅 Schedule Report Automation
              </h3>
              <button
                onClick={() => setShowScheduleReportForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <form id="schedule-report-form" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Report Type *
                  </label>
                  <select className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                    <option value="">Select Report Type</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Report</option>
                    <option value="monthly">Monthly Analytics</option>
                    <option value="term">Term-end Report</option>
                    <option value="custom">Custom Report</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Frequency *
                  </label>
                  <select className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                    <option value="">Select Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="custom">Custom Interval</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Delivery Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">Email delivery</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Dashboard notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">File downloads</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">API endpoints</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Recipients *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Administrators</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Teachers</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Parents</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">External stakeholders</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email Addresses
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    placeholder="Enter email addresses (one per line)"
                  />
                </div>
              </form>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleReportForm(false)}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="schedule-report-form"
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Export Form */}
      {showBulkExportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                📤 Bulk Export & Notifications
              </h3>
              <button
                onClick={() => setShowBulkExportForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <form id="bulk-export-form" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Export Type *
                  </label>
                  <select className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                    <option value="">Select Export Type</option>
                    <option value="all-reports">All Reports</option>
                    <option value="academic">Academic Reports Only</option>
                    <option value="attendance">Attendance Reports Only</option>
                    <option value="financial">Financial Reports Only</option>
                    <option value="custom">Custom Selection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Date Range *
                  </label>
                  <select className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                    <option value="">Select Date Range</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="term">This Term</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Export Format *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-2" />
                      <span className="text-sm text-gray-700">ZIP Archive</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Individual Files</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Cloud Storage</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Email Attachment</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Notification Recipients
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">All users</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Administrators only</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Teachers only</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">Custom list</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Notification Message
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    placeholder="Custom message to include with notifications..."
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="send-notifications"
                    defaultChecked
                    className="mr-2"
                  />
                  <label htmlFor="send-notifications" className="text-sm text-gray-700">
                    Send notifications when export is complete
                  </label>
                </div>
              </form>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBulkExportForm(false)}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="bulk-export-form"
                  className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Start Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPanel;
