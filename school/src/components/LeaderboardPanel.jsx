import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users, Target, BookOpen, FileText, Calendar, Zap, Crown, Flame } from 'lucide-react';

const LeaderboardPanel = ({ userRole, currentUser, darkMode = false }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current_term');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [selectedClass, setSelectedClass] = useState('all');

  // Remove demo data: fetch from backend

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const params = new URLSearchParams({
          period: selectedPeriod,
          category: selectedCategory,
          class: selectedClass,
        });
        const response = await fetch(`${baseUrl}/api/leaderboard?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const payload = await response.json();
          setLeaderboardData(Array.isArray(payload?.data) ? payload.data : []);
        } else {
          setLeaderboardData([]);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setLeaderboardData([]);
      } finally {
      setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedPeriod, selectedCategory, selectedClass]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-orange-500" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">{rank}</span>;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <span className="w-4 h-4 text-gray-400">—</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const cardBg = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  if (loading) {
    return (
      <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${textPrimary}`}>School Leaderboard</h1>
              <p className={`${textSecondary}`}>Track student performance and achievements</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="current_term">Current Term</option>
              <option value="last_month">Last Month</option>
              <option value="last_semester">Last Semester</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="overall">Overall Performance</option>
              <option value="tests">Test Scores</option>
              <option value="assignments">Assignments</option>
              <option value="attendance">Attendance</option>
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="all">All Classes</option>
              <option value="S4A">S4A</option>
              <option value="S4B">S4B</option>
              <option value="S4C">S4C</option>
            </select>
          </div>
        </div>

        {/* Leaderboard */}
        <div className={`${cardBg} rounded-xl shadow-lg p-6 border`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              {selectedCategory === 'overall' ? 'Overall Performance' : 
               selectedCategory === 'tests' ? 'Test Scores' :
               selectedCategory === 'assignments' ? 'Assignment Scores' :
               'Attendance Records'}
            </h2>
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className={`text-sm ${textMuted}`}>Live Rankings</span>
            </div>
          </div>

          <div className="space-y-4">
            {leaderboardData.map((student, index) => (
              <div
                key={student.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                  darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                } ${student.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : ''}`}
              >
                {/* Rank */}
                <div className="flex-shrink-0">
                  {getRankIcon(student.rank)}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {student.avatar}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className={`font-semibold ${textPrimary} truncate`}>{student.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(student.totalScore || student.score)}`}>
                      {student.totalScore || student.score} points
                    </span>
                    {getTrendIcon(student.trend)}
                  </div>
                  <p className={`text-sm ${textMuted}`}>{student.class}</p>
                  
                  {/* Detailed Stats for Overall */}
                  {selectedCategory === 'overall' && (
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-blue-500" />
                        <span className={`text-xs ${textMuted}`}>{student.tests.completed} tests</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-green-500" />
                        <span className={`text-xs ${textMuted}`}>{student.assignments.completed} assignments</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-purple-500" />
                        <span className={`text-xs ${textMuted}`}>{student.projects.completed} projects</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <span className={`text-xs ${textMuted}`}>{student.attendance}% attendance</span>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  {student.badges && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {student.badges.slice(0, 3).map((badge, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 text-xs rounded-full ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                      {student.badges.length > 3 && (
                        <span className={`text-xs ${textMuted}`}>+{student.badges.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Performance Score */}
                <div className="text-right">
                  <div className={`text-2xl font-bold ${textPrimary}`}>
                    {selectedCategory === 'overall' ? student.totalScore :
                     selectedCategory === 'tests' ? student.tests :
                     selectedCategory === 'assignments' ? student.assignments :
                     student.attendance}
                  </div>
                  <div className={`text-sm ${textMuted}`}>
                    {selectedCategory === 'overall' ? 'Total Points' :
                     selectedCategory === 'tests' ? 'Tests' :
                     selectedCategory === 'assignments' ? 'Assignments' :
                     'Attendance %'}
                  </div>
                  {student.streak && (
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className={`text-xs text-yellow-600`}>{student.streak} day streak</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{leaderboardData.length}</div>
                <div className="text-sm text-blue-700">Total Students</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(leaderboardData.reduce((sum, s) => sum + (s.totalScore || s.score), 0) / leaderboardData.length)}
                </div>
                <div className="text-sm text-green-700">Average Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {leaderboardData.filter(s => s.trend === 'up').length}
                </div>
                <div className="text-sm text-purple-700">Improving</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.max(...leaderboardData.map(s => s.streak || 0))}
                </div>
                <div className="text-sm text-orange-700">Best Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPanel;
