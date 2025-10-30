import React, { useState } from 'react';
import { GraduationCap, TrendingUp, Briefcase, DollarSign, Award, AlertCircle, CheckCircle, Brain } from 'lucide-react';

const SubjectSelectionAI = ({ user }) => {
  const [oLevelData, setOLevelData] = useState({
    currentGrades: {},
    interests: [],
    careerGoals: []
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeOLevel = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/subject-ai/o-level/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: user.id,
          ...oLevelData
        })
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Brain className="w-10 h-10" />
          <h2 className="text-3xl font-bold">AI Subject Selection Assistant</h2>
        </div>
        <p className="text-blue-100">
          Get personalized O-Level subject recommendations based on Uganda's curriculum, your performance, and career goals
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• AI analyzes your current performance in all subjects</li>
              <li>• Considers your interests and career aspirations</li>
              <li>• Recommends optional subjects aligned with Uganda curriculum</li>
              <li>• Provides difficulty ratings and career relevance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Your Current Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 
                'History', 'Geography', 'Economics', 'Commerce', 'Accounting',
                'Literature', 'Fine Art', 'Music', 'Drama', 'Computer Studies',
                'Agriculture', 'Food & Nutrition', 'Technical Drawing', 'Woodwork', 'Metalwork',
                'Religious Education', 'Physical Education', 'French', 'German', 'Arabic'
              ].map(subject => (
                <div key={subject}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Score"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setOLevelData(prev => ({
                      ...prev,
                      currentGrades: { ...prev.currentGrades, [subject]: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Career Interests</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                'Engineering', 'Medicine', 'Law', 'Business', 'Education', 'Technology',
                'Agriculture', 'Architecture', 'Art & Design', 'Music', 'Drama', 'Sports',
                'Journalism', 'Tourism', 'Banking', 'Accounting', 'Nursing', 'Pharmacy',
                'Computer Science', 'Environmental Science', 'Psychology', 'Social Work',
                'Military', 'Police', 'Fire Service', 'Aviation', 'Maritime', 'Research'
              ].map(career => (
                <label key={career} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOLevelData(prev => ({ ...prev, careerGoals: [...prev.careerGoals, career] }));
                      } else {
                        setOLevelData(prev => ({ ...prev, careerGoals: prev.careerGoals.filter(c => c !== career) }));
                      }
                    }}
                  />
                  <span className="text-sm">{career}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={analyzeOLevel}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
          >
            {loading ? 'Analyzing...' : 'Get AI Recommendations'}
          </button>
        </div>

        {/* Recommendations Display */}
        {recommendations && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">AI Recommendations</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <p className="font-semibold">Analysis Complete!</p>
              </div>
              <p className="text-sm text-green-700 mt-2">
                Based on your performance and goals, here are your personalized recommendations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectSelectionAI;