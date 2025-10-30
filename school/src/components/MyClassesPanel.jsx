import React, { useState } from 'react';
import { 
  Users, BookOpen, Clock, Calendar, MessageSquare, FileText, 
  TrendingUp, Award, AlertTriangle, CheckCircle, Eye, Plus,
  Search, Filter, Download, Upload, BarChart3, Target
} from 'lucide-react';

const MyClassesPanel = ({ userRole, currentUser, activeTab }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeView, setActiveView] = useState(activeTab === 'class-schedules' ? 'schedules' : 'overview');

  const classes = [];

  const getPerformanceColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment': return FileText;
      case 'test': return Award;
      case 'lab': return BookOpen;
      case 'attendance': return Users;
      default: return FileText;
    }
  };

  const renderClassSchedules = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
        Class Schedules
      </h3>
      
      {/* Schedule Navigation */}
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveView('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'overview' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Class Overview
        </button>
        <button 
          onClick={() => setActiveView('schedules')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'schedules' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Schedules
        </button>
      </div>

      {/* Schedule Content */}
      <div className="space-y-4">
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium mb-2">No Schedule Data Available</h4>
          <p className="text-sm">Class schedules will be displayed here once they are configured.</p>
        </div>
      </div>
    </div>
  );


  const renderClassOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
            <p className="text-gray-600">Manage your classes and view performance</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Class
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
            <p className="text-gray-600 mb-4">You don't have any classes assigned yet.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Class
            </button>
          </div>
        ) : classes.map((classItem, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{classItem.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{classItem.subject}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="w-3 h-3 mr-1" />
                  {classItem.students} students
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(classItem.trend)}`}>
                {classItem.trend === 'up' ? '↗' : classItem.trend === 'down' ? '↘' : '→'} {classItem.performance}%
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Room</span>
                <span className="font-medium">{classItem.room}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Schedule</span>
                <span className="font-medium">{classItem.schedule}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Next Class</span>
                <span className="font-medium">{classItem.nextClass}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedClass(classItem)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
              <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClassDetails = () => {
    if (!selectedClass) return null;

    return (
      <div className="space-y-6">
        {/* Class Header */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedClass.name}</h2>
              <p className="text-gray-600">{selectedClass.subject} • {selectedClass.level} • {selectedClass.room}</p>
            </div>
            <button 
              onClick={() => setSelectedClass(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{selectedClass.students}</div>
              <div className="text-sm text-blue-700">Students</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{selectedClass.performance.average}%</div>
              <div className="text-sm text-green-700">Class Average</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{selectedClass.performance.attendance}%</div>
              <div className="text-sm text-purple-700">Attendance</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">{selectedClass.performance.lastTest}%</div>
              <div className="text-sm text-orange-700">Last Test</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Class Schedule
            </h3>
            <div className="space-y-3">
              {selectedClass.schedule.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{session.day}</span>
                  <span className="text-gray-600">{session.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {selectedClass.upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-600">{event.type}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{event.date}</div>
                    <div className="text-xs text-gray-600">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {selectedClass.recentActivity.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 rounded-full p-2">
                      <ActivityIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.submitted && (
                      <div className="text-sm font-medium text-gray-900">
                        {activity.submitted}/{activity.total} submitted
                      </div>
                    )}
                    {activity.average && (
                      <div className="text-sm text-gray-600">Average: {activity.average}%</div>
                    )}
                    {activity.present && (
                      <div className="text-sm font-medium text-gray-900">
                        {activity.present}/{activity.total} present
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-blue-800">Mark Attendance</span>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
              <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-800">Create Assignment</span>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-purple-800">Grade Work</span>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
              <MessageSquare className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-orange-800">Message Class</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {activeView === 'schedules' ? renderClassSchedules() : (selectedClass ? renderClassDetails() : renderClassOverview())}
    </div>
  );
};

export default MyClassesPanel;
