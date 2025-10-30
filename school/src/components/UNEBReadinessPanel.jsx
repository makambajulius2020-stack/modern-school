import React, { useState } from 'react';
import { 
  Target, Award, TrendingUp, AlertTriangle, CheckCircle, 
  Brain, BookOpen, Clock, BarChart3, Star, Zap, Eye,
  Calendar, FileText, Users, MessageSquare, Download
} from 'lucide-react';

const UNEBReadinessPanel = ({ userRole, currentUser, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const readinessData = {
    overallReadiness: 0,
    predictedGrade: '-',
    confidenceLevel: 0,
    examDate: '',
    daysRemaining: 0,
    mockTestsCompleted: 0,
    totalMockTests: 0,
    studyHoursLogged: 0,
    targetStudyHours: 0,
    weakAreas: [],
    strongAreas: [],
    upcomingMocks: [],
    studyPlan: { dailyTarget: 0, weeklyTarget: 0, currentStreak: 0, dailyHours: 0, weeklyTests: 0, completedTopics: 0, totalTopics: 0, practiceTests: 0, targetTests: 0 },
    subjects: [],
    mockExams: []
  };

  const getReadinessColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 65) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'text-green-600';
    if (grade.includes('B')) return 'text-blue-600';
    if (grade.includes('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Readiness Dashboard */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{readinessData.overallReadiness}%</div>
            <div className="text-blue-100">UNEB Readiness</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{readinessData.predictedGrade}</div>
            <div className="text-blue-100">Predicted Grade</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{readinessData.daysRemaining}</div>
            <div className="text-blue-100">Days Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{readinessData.confidenceLevel}%</div>
            <div className="text-blue-100">Confidence Level</div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-lg text-blue-100">UNEB Examinations: {readinessData.examDate}</p>
        </div>
      </div>

      {/* Subject Readiness */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Subject Readiness Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {readinessData.subjects.map((subject, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">{subject.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm font-bold rounded ${getReadinessColor(subject.readiness)}`}>
                    {subject.readiness}%
                  </span>
                  <span className={`text-lg font-bold ${getGradeColor(subject.predictedGrade)}`}>
                    {subject.predictedGrade}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Topics Completed:</span>
                  <span className="font-medium">{subject.topicsCompleted}/{subject.totalTopics}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(subject.topicsCompleted / subject.totalTopics) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Mock Score:</span>
                  <span className="font-medium">{subject.lastMockScore}%</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target Score:</span>
                  <span className="font-medium text-green-600">{subject.targetScore}%</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">AI Recommendation</span>
                </div>
                <p className="text-sm text-yellow-700">{subject.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Study Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Daily Study Hours</span>
              <span className="text-2xl font-bold text-blue-600">{readinessData.studyPlan.dailyHours}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Weekly Practice Tests</span>
              <span className="text-2xl font-bold text-green-600">{readinessData.studyPlan.weeklyTests}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Topics Mastered</span>
                <span>{readinessData.studyPlan.completedTopics}/{readinessData.studyPlan.totalTopics}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(readinessData.studyPlan.completedTopics / readinessData.studyPlan.totalTopics) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Practice Tests</span>
                <span>{readinessData.studyPlan.practiceTests}/{readinessData.studyPlan.targetTests}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(readinessData.studyPlan.practiceTests / readinessData.studyPlan.targetTests) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Mock Exam Trends</h3>
          <div className="space-y-4">
            {readinessData.mockExams.map((mock, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{mock.name}</div>
                  <div className="text-sm text-gray-600">{mock.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{mock.overall}%</div>
                  <div className="text-xs text-gray-500">Overall</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubjectAnalysis = () => (
    <div className="space-y-6">
      {readinessData.subjects.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-10 text-center border border-gray-200">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Subject Analysis Available</h3>
          <p className="text-gray-600">Start practicing past papers or complete mock tests to see subject insights here.</p>
        </div>
      )}
      {readinessData.subjects.map((subject, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 text-lg font-bold rounded ${getReadinessColor(subject.readiness)}`}>
                {subject.readiness}% Ready
              </span>
              <span className={`text-2xl font-bold ${getGradeColor(subject.predictedGrade)}`}>
                {subject.predictedGrade}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-green-800">Strengths</h4>
              <div className="space-y-2">
                {subject.strengths.map((strength, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-red-800">Areas for Improvement</h4>
              <div className="space-y-2">
                {subject.weaknesses.map((weakness, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">{weakness}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Performance Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Practice Tests:</span>
                  <span className="font-medium">{subject.practiceTests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span className="font-medium">{subject.averageScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Mock:</span>
                  <span className="font-medium">{subject.lastMockScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Target:</span>
                  <span className="font-medium text-green-600">{subject.targetScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">AI-Powered Recommendation</h4>
            </div>
            <p className="text-blue-800">{subject.recommendation}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStudyPlan = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Personalized Study Plan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Daily Schedule</h4>
            <div className="space-y-3">
              {/* Daily schedule will be loaded from backend */}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Weekly Goals</h4>
            <div className="space-y-4">
              {/* Weekly goals will be loaded from backend */}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">AI Study Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI recommendations will be loaded from backend */}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-white' : ''}`}>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>UNEB Readiness Assessment</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI-powered analysis of your examination preparedness</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'subjects', label: 'Subject Analysis', icon: BookOpen },
              { id: 'plan', label: 'Study Plan', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'subjects' && renderSubjectAnalysis()}
      {activeTab === 'plan' && renderStudyPlan()}
    </div>
  );
};

export default UNEBReadinessPanel;
