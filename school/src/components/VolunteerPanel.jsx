import React, { useState } from 'react';
import { Users, Calendar, Clock, MapPin, Heart, Award, Plus, CheckCircle, AlertCircle, Star } from 'lucide-react';

const VolunteerPanel = ({ userRole, currentUser }) => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showParentCommitteeForm, setShowParentCommitteeForm] = useState(false);
  const [showEventPlanningForm, setShowEventPlanningForm] = useState(false);
  const [showFundraisingForm, setShowFundraisingForm] = useState(false);

  // Volunteer opportunities (start empty)
  const [opportunities, setOpportunities] = useState([]);

  // User's volunteer history (start empty)
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  const handleSignUp = (opportunityId) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, volunteersSignedUp: opp.volunteersSignedUp + 1 }
        : opp
    ));
    alert('Successfully signed up for volunteer opportunity!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Academic': return 'bg-blue-100 text-blue-800';
      case 'Educational Support': return 'bg-green-100 text-green-800';
      case 'Events': return 'bg-purple-100 text-purple-800';
      case 'Career Development': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOpportunities = () => (
    <div className="space-y-6">
      {opportunities.map((opportunity) => (
        <div key={opportunity.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{opportunity.title}</h4>
              <p className="text-gray-600 mt-1">{opportunity.description}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(opportunity.category)}`}>
                {opportunity.category}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(opportunity.status)}`}>
                {opportunity.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{opportunity.date === 'Ongoing' ? 'Ongoing' : new Date(opportunity.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{opportunity.time}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{opportunity.location}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{opportunity.volunteersSignedUp}/{opportunity.volunteersNeeded} volunteers</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Heart className="w-4 h-4 mr-2" />
                <span>Commitment: {opportunity.commitment}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Volunteers Needed</span>
              <span>{opportunity.volunteersSignedUp}/{opportunity.volunteersNeeded}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  opportunity.volunteersSignedUp >= opportunity.volunteersNeeded ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${(opportunity.volunteersSignedUp / opportunity.volunteersNeeded) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Skills Required */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Skills/Requirements:</h5>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Benefits:</h5>
            <div className="flex flex-wrap gap-2">
              {opportunity.benefits.map((benefit, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Coordinator */}
          <div className="mb-4 text-sm text-gray-600">
            <span className="font-medium">Coordinator:</span> {opportunity.coordinator} ({opportunity.coordinatorEmail})
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedOpportunity(opportunity)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              View Details
            </button>
            {opportunity.status === 'open' && (
              <button
                onClick={() => handleSignUp(opportunity.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {volunteerHistory.map((activity) => (
        <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
              <p className="text-gray-600">Coordinator: {activity.coordinator}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {activity.status}
              </span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < activity.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(activity.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{activity.hours} hours volunteered</span>
              </div>
            </div>
          </div>

          {activity.feedback && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Coordinator Feedback:</h5>
              <p className="text-gray-700 text-sm">{activity.feedback}</p>
            </div>
          )}
        </div>
      ))}

      {/* Volunteer Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Your Volunteer Impact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {volunteerHistory.reduce((total, activity) => total + activity.hours, 0)}
            </div>
            <div className="text-sm text-blue-700">Total Hours</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{volunteerHistory.length}</div>
            <div className="text-sm text-green-700">Activities Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {(volunteerHistory.reduce((total, activity) => total + activity.rating, 0) / volunteerHistory.length).toFixed(1)}
            </div>
            <div className="text-sm text-yellow-700">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-600" />
              Volunteer Opportunities
            </h3>
            <p className="text-gray-600 mt-1">Make a difference in your child's school community</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {volunteerHistory.reduce((total, activity) => total + activity.hours, 0)}
            </div>
            <div className="text-sm text-gray-600">Hours Volunteered</div>
          </div>
        </div>
      </div>

      {/* Impact Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold mb-2">Your Volunteer Impact Matters!</h4>
            <p className="text-blue-100">
              Every hour you volunteer helps create a better learning environment for all students.
            </p>
          </div>
          <Award className="w-16 h-16 text-yellow-300" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'opportunities', label: 'Available Opportunities', count: opportunities.filter(o => o.status === 'open').length },
              { id: 'history', label: 'My Volunteer History', count: volunteerHistory.length }
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
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'opportunities' && renderOpportunities()}
          {activeTab === 'history' && renderHistory()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Get Involved</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowParentCommitteeForm(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h5 className="font-medium">Join Parent Committee</h5>
            <p className="text-sm text-gray-600">Participate in school governance and decision making</p>
          </button>
          <button 
            onClick={() => setShowEventPlanningForm(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Calendar className="w-6 h-6 text-green-600 mb-2" />
            <h5 className="font-medium">Event Planning</h5>
            <p className="text-sm text-gray-600">Help organize school events and activities</p>
          </button>
          <button 
            onClick={() => setShowFundraisingForm(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Heart className="w-6 h-6 text-red-600 mb-2" />
            <h5 className="font-medium">Fundraising</h5>
            <p className="text-sm text-gray-600">Support school improvement projects</p>
          </button>
        </div>
      </div>

      {/* Volunteer Guidelines */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Volunteer Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Before You Volunteer:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete volunteer application form</li>
              <li>• Provide valid identification</li>
              <li>• Attend orientation session if required</li>
              <li>• Review school policies and procedures</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Volunteer Expectations:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Arrive on time and prepared</li>
              <li>• Follow school dress code</li>
              <li>• Maintain student confidentiality</li>
              <li>• Report to designated coordinator</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">{selectedOpportunity.title}</h3>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">{selectedOpportunity.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900">Date & Time</h5>
                  <p className="text-gray-600">{selectedOpportunity.date} at {selectedOpportunity.time}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Location</h5>
                  <p className="text-gray-600">{selectedOpportunity.location}</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Required Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedOpportunity.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Benefits</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedOpportunity.benefits.map((benefit, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h5 className="font-medium text-gray-900">Contact</h5>
                <p className="text-gray-600">{selectedOpportunity.coordinator}</p>
                <p className="text-gray-600">{selectedOpportunity.coordinatorEmail}</p>
              </div>

              {selectedOpportunity.status === 'open' && (
                <button
                  onClick={() => {
                    handleSignUp(selectedOpportunity.id);
                    setSelectedOpportunity(null);
                  }}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700"
                >
                  Sign Up for This Opportunity
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Parent Committee Form */}
      {showParentCommitteeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">📋 Join Parent Committee</h3>
              <button
                onClick={() => setShowParentCommitteeForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              
              alert(`✅ Parent Committee Application Submitted!\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nExperience: ${data.experience}\nInterests: ${data.interests}\n\nThank you for your interest! You will receive a confirmation email with meeting details.`);
              setShowParentCommitteeForm(false);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+256 700 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child's Class</label>
                  <select name="childClass" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Class</option>
                    <option value="P1">Primary 1</option>
                    <option value="P2">Primary 2</option>
                    <option value="P3">Primary 3</option>
                    <option value="P4">Primary 4</option>
                    <option value="P5">Primary 5</option>
                    <option value="P6">Primary 6</option>
                    <option value="P7">Primary 7</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Experience</label>
                <textarea
                  name="experience"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe any relevant experience in education, governance, or community service..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Academic Policy', 'Budget & Finance', 'School Events', 'Student Welfare', 'Teacher Support', 'Facilities Management'].map(area => (
                    <label key={area} className="flex items-center">
                      <input type="checkbox" name="interests" value={area} className="mr-2" />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Flexible'].map(time => (
                    <label key={time} className="flex items-center">
                      <input type="checkbox" name="availability" value={time} className="mr-2" />
                      <span className="text-sm text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowParentCommitteeForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Planning Form */}
      {showEventPlanningForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">🎉 Event Planning Volunteer</h3>
              <button
                onClick={() => setShowEventPlanningForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              
              alert(`✅ Event Planning Application Submitted!\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nEvent Type: ${data.eventType}\nExperience: ${data.experience}\n\nThank you for your interest! The Events Coordinator will contact you soon.`);
              setShowEventPlanningForm(false);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+256 700 000 000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type Interest *</label>
                <select name="eventType" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Event Type</option>
                  <option value="fundraising">Fundraising Events</option>
                  <option value="sports">Sports Day Organization</option>
                  <option value="cultural">Cultural Festival</option>
                  <option value="graduation">Graduation Ceremony</option>
                  <option value="social">Parent-Teacher Social Events</option>
                  <option value="academic">Academic Competitions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Planning Experience</label>
                <textarea
                  name="experience"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe any experience in event planning, organization, or coordination..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Strengths</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Organization', 'Communication', 'Creativity', 'Budget Management', 'Team Leadership', 'Marketing'].map(skill => (
                    <label key={skill} className="flex items-center">
                      <input type="checkbox" name="skills" value={skill} className="mr-2" />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEventPlanningForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fundraising Form */}
      {showFundraisingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">💰 Fundraising Volunteer</h3>
              <button
                onClick={() => setShowFundraisingForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = Object.fromEntries(formData.entries());
              
              alert(`✅ Fundraising Application Submitted!\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCampaign Interest: ${data.campaign}\nContribution Type: ${data.contributionType}\n\nThank you for your support! The Development Office will contact you soon.`);
              setShowFundraisingForm(false);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+256 700 000 000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Interest *</label>
                <select name="campaign" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Campaign</option>
                  <option value="library">Library Renovation Fund</option>
                  <option value="computer">Computer Lab Upgrade</option>
                  <option value="sports">Sports Equipment Fund</option>
                  <option value="scholarship">Scholarship Program</option>
                  <option value="teacher">Teacher Training Fund</option>
                  <option value="general">General School Fund</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Direct Donation', 'Organize Events', 'Sponsor Projects', 'Volunteer Time', 'Corporate Partnership', 'In-Kind Donations'].map(type => (
                    <label key={type} className="flex items-center">
                      <input type="checkbox" name="contributionType" value={type} className="mr-2" />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                <textarea
                  name="additionalInfo"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information about your fundraising experience or ideas..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFundraisingForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerPanel;
