import React, { useState } from 'react';
import { Brain, Send, X, BookOpen, Calculator, Microscope, Globe, History, Palette, Music, MessageSquare, User, Clock, Star } from 'lucide-react';
import apiService from '../services/api';

const AITutorForm = ({ userRole, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [studyGoal, setStudyGoal] = useState('');

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'blue' },
    { id: 'science', name: 'Science', icon: Microscope, color: 'green' },
    { id: 'english', name: 'English', icon: BookOpen, color: 'purple' },
    { id: 'history', name: 'History', icon: History, color: 'orange' },
    { id: 'geography', name: 'Geography', icon: Globe, color: 'teal' },
    { id: 'art', name: 'Art', icon: Palette, color: 'pink' },
    { id: 'music', name: 'Music', icon: Music, color: 'indigo' }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some knowledge' },
    { value: 'advanced', label: 'Advanced', description: 'Strong foundation' }
  ];

  const studyGoals = [
    { value: 'homework', label: 'Homework Help', description: 'Get help with assignments' },
    { value: 'exam-prep', label: 'Exam Preparation', description: 'Prepare for upcoming tests' },
    { value: 'concept-explanation', label: 'Concept Explanation', description: 'Understand difficult topics' },
    { value: 'practice-problems', label: 'Practice Problems', description: 'Work through exercises' },
    { value: 'study-strategy', label: 'Study Strategy', description: 'Improve study methods' }
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageText = currentMessage;
    setCurrentMessage('');

    // Add loading message
    const loadingMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: 'Thinking...',
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages(prev => [...prev, loadingMessage]);

    try {
      // Check if it's a conversational message first
      const lowerMessage = messageText.toLowerCase();
      const isConversational = lowerMessage.includes('hello') || 
                              lowerMessage.includes('hi') || 
                              lowerMessage.includes('how are you') || 
                              lowerMessage.includes('thank') ||
                              lowerMessage.includes('bye') ||
                              lowerMessage.includes('goodbye');

      if (isConversational) {
        // Handle conversational messages
        const conversationalResponse = getConversationalResponse(messageText, userRole);
        setChatMessages(prev => {
          const withoutLoading = prev.filter(msg => !msg.isLoading);
          const aiMessage = {
            id: Date.now() + 2,
            type: 'ai',
            content: conversationalResponse,
            timestamp: new Date(),
            isLoading: false
          };
          return [...withoutLoading, aiMessage];
        });
        return;
      }

      // Determine the appropriate API call based on user role and message content
      let apiResponse;
      
      if (userRole === 'student') {
        // For students, generate a language lesson based on their question
        const lessonData = {
          language: 'English',
          level: 'intermediate',
          topic: extractTopicFromMessage(messageText),
          lessonType: 'general',
          studentId: 1
        };
        apiResponse = await apiService.generateLanguageLesson(lessonData);
      } else if (userRole === 'teacher') {
        // For teachers, generate assignment scaffold
        const scaffoldData = {
          assignment: messageText,
          gradeLevel: 'Grade 5',
          subject: extractSubjectFromMessage(messageText)
        };
        apiResponse = await apiService.generateAssignmentScaffold(scaffoldData);
      } else {
        // For parents, generate career assessment
        const careerData = {
          interests: [extractTopicFromMessage(messageText)],
          subjects: ['Mathematics', 'English'],
          skills: ['Problem solving', 'Communication'],
          gradeLevel: 'Grade 5',
          studentId: 1
        };
        apiResponse = await apiService.generateCareerAssessment(careerData);
      }

      // Remove loading message and add real response
      setChatMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const aiMessage = {
          id: Date.now() + 2,
          type: 'ai',
          content: formatAIResponse(apiResponse, userRole),
          timestamp: new Date(),
          isLoading: false
        };
        return [...withoutLoading, aiMessage];
      });

    } catch (error) {
      console.error('AI API Error:', error);
      
      // Remove loading message and add error response
      setChatMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        const errorMessage = {
          id: Date.now() + 2,
          type: 'ai',
          content: 'I apologize, but I\'m having trouble connecting to the AI service right now. Please try again later.',
          timestamp: new Date(),
          isLoading: false
        };
        return [...withoutLoading, errorMessage];
      });
    }
  };

  // Helper function for conversational responses
  const getConversationalResponse = (message, role) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      const greetings = {
        student: "Hello! 👋 I'm your AI tutor. I'm here to help you learn and understand new concepts. What subject would you like to explore today?",
        teacher: "Hello! 👋 I'm your AI teaching assistant. I can help you create lesson plans, assignments, and teaching materials. What would you like to work on?",
        parent: "Hello! 👋 I'm your AI educational advisor. I can help you understand your child's learning needs and provide guidance. How can I assist you today?"
      };
      return greetings[role] || greetings.student;
    }
    
    if (lowerMessage.includes('how are you')) {
      return "I'm doing great! 😊 I'm excited to help you with your studies. I have access to lots of educational content and can create personalized lessons, assignments, and assessments. What would you like to learn about?";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're very welcome! 😊 I'm happy to help. Feel free to ask me anything else about your studies or if you need help with any subject.";
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! 👋 It was great helping you today. Come back anytime you need assistance with your studies. Have a wonderful day!";
    }
    
    // Default conversational response
    return "I'm here to help you learn! 😊 You can ask me about any subject, request lesson plans, or get help with assignments. What would you like to explore?";
  };

  // Helper functions
  const extractTopicFromMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('math') || lowerMessage.includes('algebra') || lowerMessage.includes('calculus')) return 'mathematics';
    if (lowerMessage.includes('science') || lowerMessage.includes('biology') || lowerMessage.includes('chemistry')) return 'science';
    if (lowerMessage.includes('english') || lowerMessage.includes('literature') || lowerMessage.includes('writing')) return 'english';
    if (lowerMessage.includes('history') || lowerMessage.includes('social studies')) return 'history';
    if (lowerMessage.includes('art') || lowerMessage.includes('drawing') || lowerMessage.includes('painting')) return 'art';
    if (lowerMessage.includes('music') || lowerMessage.includes('singing') || lowerMessage.includes('instrument')) return 'music';
    return 'general studies';
  };

  const extractSubjectFromMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('math') || lowerMessage.includes('algebra')) return 'Mathematics';
    if (lowerMessage.includes('science') || lowerMessage.includes('biology')) return 'Science';
    if (lowerMessage.includes('english') || lowerMessage.includes('literature')) return 'English';
    if (lowerMessage.includes('history')) return 'History';
    return 'General';
  };

  const formatAIResponse = (apiResponse, userRole) => {
    if (!apiResponse || !apiResponse.data) {
      return 'I apologize, but I couldn\'t generate a proper response. Please try again.';
    }

    const data = apiResponse.data;
    
    if (userRole === 'student' && data.title) {
      return `📚 ${data.title}\n\n🎯 Learning Objectives:\n${data.objectives?.map(obj => `• ${obj}`).join('\n') || '• Understanding key concepts'}\n\n⏰ Duration: ${data.duration}\n\n🎯 Activities:\n${data.activities?.map(activity => `• ${activity.title} (${activity.duration})`).join('\n') || '• Interactive learning activities'}`;
    }
    
    if (userRole === 'teacher' && data.steps) {
      return `📝 Assignment Scaffold: ${data.assignment}\n\n📋 Steps:\n${data.steps.map(step => `${step.step}. ${step.title} - ${step.description} (${step.timeEstimate})`).join('\n')}\n\n⏰ Total Time: ${data.totalTime}`;
    }
    
    if (userRole === 'parent' && data.recommendations) {
      return `🎓 Career Assessment Results\n\n💼 Recommended Careers:\n${data.recommendations.map(rec => `• ${rec.career} (${rec.match}% match)`).join('\n')}\n\n📚 Education Paths:\n${data.educationPaths?.map(path => `• ${path.path}: ${path.description}`).join('\n') || '• Various educational opportunities available'}`;
    }
    
    return 'I\'ve generated some helpful content for you. Please check the details above.';
  };

  const handleQuickStart = async (subject, difficulty, goal) => {
    setSelectedSubject(subject);
    setDifficultyLevel(difficulty);
    setStudyGoal(goal);
    setActiveTab('chat');
    
    // Add loading message
    const loadingMessage = {
      id: Date.now(),
      type: 'ai',
      content: 'Generating personalized content for you...',
      timestamp: new Date(),
      isLoading: true
    };
    setChatMessages([loadingMessage]);

    try {
      let apiResponse;
      
      if (userRole === 'student') {
        const lessonData = {
          language: 'English',
          level: difficulty.toLowerCase(),
          topic: subject.toLowerCase(),
          lessonType: goal.toLowerCase().replace(' ', '_'),
          studentId: 1
        };
        apiResponse = await apiService.generateLanguageLesson(lessonData);
      } else if (userRole === 'teacher') {
        const scaffoldData = {
          assignment: `${subject} - ${goal}`,
          gradeLevel: 'Grade 5',
          subject: subject
        };
        apiResponse = await apiService.generateAssignmentScaffold(scaffoldData);
      } else {
        const careerData = {
          interests: [subject.toLowerCase()],
          subjects: [subject],
          skills: ['Problem solving', 'Communication'],
          gradeLevel: 'Grade 5',
          studentId: 1
        };
        apiResponse = await apiService.generateCareerAssessment(careerData);
      }

      // Replace loading message with real response
      const welcomeMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: formatAIResponse(apiResponse, userRole),
        timestamp: new Date(),
        isLoading: false
      };
      setChatMessages([welcomeMessage]);

    } catch (error) {
      console.error('Quick Start API Error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Welcome! I'm your AI tutor. I see you want help with ${subject} at ${difficulty} level for ${goal}. However, I'm having trouble connecting to the AI service right now. Please try asking me a specific question.`,
        timestamp: new Date(),
        isLoading: false
      };
      setChatMessages([errorMessage]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-600" />
              AI Tutor Assistant
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {userRole === 'student' && 'Get personalized help with your studies'}
            {userRole === 'parent' && 'Support your child\'s learning journey'}
            {userRole === 'teacher' && 'Enhance your teaching with AI assistance'}
          </p>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Sidebar - Quick Start */}
          <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Quick Start</h4>
                <div className="space-y-3">
                  {subjects.map(subject => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <subject.icon className={`w-4 h-4 text-${subject.color}-600`} />
                        <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {difficultyLevels.map(level => (
                          <div key={level.value} className="space-y-1">
                            <div className="text-xs text-gray-600">{level.label}</div>
                            <div className="ml-2 space-y-1">
                              {studyGoals.map(goal => (
                                <button
                                  key={goal.value}
                                  onClick={() => handleQuickStart(subject.name, level.label, goal.label)}
                                  className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded"
                                >
                                  {goal.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Start a conversation with your AI tutor</p>
                  <p className="text-sm text-gray-400">Select a subject and goal from the sidebar, or type your question below</p>
                </div>
              ) : (
                chatMessages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.type === 'ai' && <Brain className="w-4 h-4 mt-0.5 text-purple-600" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          {message.isLoading && (
                            <div className="flex items-center space-x-1 mt-2">
                              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          )}
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your studies..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorForm;
