import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, BarChart3, Award, Target, Star, 
  Calendar, Clock, Eye, Download, AlertTriangle,
  CheckCircle, Brain, Zap, Users, BookOpen, FileText
} from 'lucide-react';

const MyPerformancePanel = ({ userRole, currentUser, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('term');
  const [grades, setGrades] = useState([]);
  const [gradesSummary, setGradesSummary] = useState(null);
  const [gradesLoading, setGradesLoading] = useState(true);

  const performanceData = {
    overview: { currentGPA: 0, classRank: 0, totalStudents: 0, improvement: 0, attendanceRate: 0 },
    subjects: [],
    assessments: [],
    goals: []
  };

  useEffect(() => {
    if (activeTab === 'grades') {
      fetchGrades();
    }
  }, [activeTab]);

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${baseUrl}/api/grades/?term=${selectedPeriod}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setGrades(data.grades || []);
        setGradesSummary(data.summary || null);
      } else {
        setGrades([]);
        setGradesSummary(null);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
      setGradesSummary(null);
    } finally {
      setGradesLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-blue-600 transform rotate-90" />;
  };

  const getGradeColorClass = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'A-': return 'text-green-600 bg-green-100';
      case 'B+': return 'text-blue-600 bg-blue-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'B-': return 'text-yellow-600 bg-yellow-100';
      case 'C+': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const renderGrades = () => (
    <div className="space-y-6">
      {/* Term Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Grade History</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Current Term</option>
            <option value="previous">Previous Term</option>
            <option value="year">Academic Year</option>
          </select>
        </div>

        {/* Grades Summary */}
        {gradesSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{gradesSummary.averageGrade || 'N/A'}</div>
              <div className="text-sm text-gray-600">Average Grade</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{gradesSummary.highestGrade || 'N/A'}</div>
              <div className="text-sm text-gray-600">Highest Grade</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{gradesSummary.totalSubjects || 0}</div>
              <div className="text-sm text-gray-600">Subjects</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{gradesSummary.improvement || '0'}%</div>
              <div className="text-sm text-gray-600">Improvement</div>
            </div>
          </div>
        )}

        {/* Grades List */}
        {gradesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading grades...</p>
          </div>
        ) : grades.length > 0 ? (
          <div className="space-y-3">
            {grades.map((grade, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{grade.subject}</div>
                    <div className="text-sm text-gray-600">{grade.assessment} • {grade.date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold px-3 py-1 rounded-full ${getGradeColorClass(grade.grade)}`}>
                      {grade.grade}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Score: {grade.score}%
                    </div>
                  </div>
                  {grade.trend && (
                    <div className="flex items-center">
                      {grade.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : grade.trend === 'down' ? (
                        <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-blue-600 transform rotate-90" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No grades available</p>
            <p className="text-sm text-gray-400">Your grades will appear here once they are recorded</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{performanceData.overview.currentGPA}</div>
          <div className="text-sm text-gray-600">Current GPA</div>
          <div className="text-xs text-green-600 mt-1">+{performanceData.overview.improvement}% this term</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{performanceData.overview.classRank}</div>
          <div className="text-sm text-gray-600">Class Rank</div>
          <div className="text-xs text-gray-500 mt-1">of {performanceData.overview.totalStudents} students</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{performanceData.overview.attendanceRate}%</div>
          <div className="text-sm text-gray-600">Attendance</div>
          <div className="text-xs text-purple-600 mt-1">Excellent</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2"></div>
          <div className="text-sm text-gray-600">Predicted Grade</div>
          <div className="text-xs text-orange-600 mt-1">UNEB </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">0</div>
          <div className="text-sm text-gray-600">UNEB Readiness</div>
          <div className="text-xs text-red-600 mt-1"></div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Subject Performance</h3>
        <div className="space-y-4">
          {performanceData.subjects.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{subject.name}</div>
                  <div className="text-sm text-gray-600">Rank #{subject.rank} • Class Avg: {subject.classAverage}%</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                    {subject.currentGrade}%
                  </div>
                  <div className="text-xs text-gray-500">
                    Previous: {subject.previousGrade}%
                  </div>
                </div>
                {getTrendIcon(subject.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Assessments */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Assessments</h3>
        <div className="space-y-3">
          {performanceData.assessments.map((assessment, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{assessment.name}</div>
                <div className="text-sm text-gray-600">{assessment.date}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${getGradeColor((assessment.score / assessment.maxScore) * 100)}`}>
                    {assessment.score}/{assessment.maxScore}
                  </div>
                  <div className="text-xs text-gray-500">Rank #{assessment.rank}</div>
                </div>
                <div className="text-sm text-gray-600">
                  Avg: {assessment.average}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Academic Goals Progress</h3>
        <div className="space-y-6">
          {performanceData.goals.map((goal, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{goal.subject}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Current: {goal.current}%</span>
                  <span className="text-sm text-blue-600">Target: {goal.target}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full relative"
                  style={{ width: `${goal.progress}%` }}
                >
                  <div className="absolute right-0 top-0 h-3 w-1 bg-green-600 rounded-r-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{goal.progress}% to goal</span>
                <span>{goal.target - goal.current} points needed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Focus Area</span>
            </div>
            <p className="text-sm text-blue-800">Increase Physics study time by 30% to reach your target of 85%</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Strength</span>
            </div>
            <p className="text-sm text-green-800">Maintain excellent Biology performance - you're on track for 95%</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-white' : ''}`}>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Performance</h1>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Track your academic progress and achievements</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'grades', label: 'My Grades', icon: Award },
              { id: 'goals', label: 'Goals & Progress', icon: Target },
              { id: 'analytics', label: 'Detailed Analytics', icon: TrendingUp }
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
      {activeTab === 'grades' && renderGrades()}
      {activeTab === 'goals' && renderGoals()}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Analytics</h3>
          <p className="text-gray-600">Advanced performance analytics coming soon</p>
        </div>
      )}
    </div>
  );
};

export default MyPerformancePanel;
