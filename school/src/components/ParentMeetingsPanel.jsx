import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Plus, Edit, Trash2, CheckCircle, AlertCircle, Video } from 'lucide-react';

const ParentMeetingsPanel = ({ userRole, currentUser }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSendMessageForm, setShowSendMessageForm] = useState(false);
  const [showTeacherAvailabilityForm, setShowTeacherAvailabilityForm] = useState(false);
  const [showEmergencyContactForm, setShowEmergencyContactForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    childId: '',
    teacherId: '',
    subject: '',
    date: '',
    time: '',
    type: 'in-person',
    reason: '',
    priority: 'normal'
  });

  // Children for booking (start empty)
  const children = [];

  // Teachers (start empty)
  const teachers = [];

  // Meetings (start empty)
  const [meetings, setMeetings] = useState([]);

  const [pastMeetings] = useState([]);

  const handleBookMeeting = (e) => {
    e.preventDefault();
    const newMeeting = {
      id: meetings.length + 1,
      child: children.find(c => c.id === parseInt(bookingForm.childId))?.name,
      teacher: teachers.find(t => t.id === parseInt(bookingForm.teacherId))?.name,
      subject: teachers.find(t => t.id === parseInt(bookingForm.teacherId))?.subject,
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
      location: bookingForm.type === 'virtual' ? 'Virtual Meeting' : 'TBD',
      reason: bookingForm.reason,
      status: 'pending',
      priority: bookingForm.priority,
      notes: '',
      meetingLink: bookingForm.type === 'virtual' ? 'Will be provided before meeting' : null
    };

    setMeetings([...meetings, newMeeting]);
    setShowBookingForm(false);
    setBookingForm({
      childId: '',
      teacherId: '',
      subject: '',
      date: '',
      time: '',
      type: 'in-person',
      reason: '',
      priority: 'normal'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUpcomingMeetings = () => (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {meeting.child} - {meeting.subject}
              </h4>
              <p className="text-gray-600">with {meeting.teacher}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(meeting.priority)}`}>
                {meeting.priority} priority
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(meeting.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{meeting.time}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{meeting.location}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                {meeting.type === 'virtual' ? (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    <span>Virtual Meeting</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    <span>In-Person</span>
                  </>
                )}
              </div>
              {meeting.meetingLink && (
                <a 
                  href={meeting.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Video className="w-4 h-4 mr-1" />
                  Join Meeting
                </a>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Meeting Purpose:</h5>
            <p className="text-gray-600 text-sm">{meeting.reason}</p>
          </div>

          {meeting.notes && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Teacher's Notes:</h5>
              <p className="text-gray-600 text-sm">{meeting.notes}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedMeeting(meeting)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              View Details
            </button>
            {meeting.status === 'pending' && (
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                Reschedule
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPastMeetings = () => (
    <div className="space-y-4">
      {pastMeetings.map((meeting) => (
        <div key={meeting.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {meeting.child} - {meeting.subject}
              </h4>
              <p className="text-gray-600">with {meeting.teacher}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
              {meeting.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < meeting.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(meeting.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>{meeting.time}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{meeting.location}</span>
              </div>
            </div>
          </div>

          {meeting.notes && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Meeting Notes:</h5>
              <p className="text-gray-600 text-sm">{meeting.notes}</p>
            </div>
          )}

          {meeting.outcome && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Outcome & Action Items:</h5>
              <p className="text-gray-600 text-sm">{meeting.outcome}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderBookingForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold">📅 Book Parent-Teacher Meeting</h3>
          <button
            onClick={() => setShowBookingForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <form id="booking-form" onSubmit={handleBookMeeting} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child</label>
            <select
              value={bookingForm.childId}
              onChange={(e) => setBookingForm({...bookingForm, childId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Child</option>
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.name} - {child.class}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select
              value={bookingForm.teacherId}
              onChange={(e) => setBookingForm({...bookingForm, teacherId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.subject}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={bookingForm.time}
                onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
            <select
              value={bookingForm.type}
              onChange={(e) => setBookingForm({...bookingForm, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="in-person">In-Person</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={bookingForm.priority}
              onChange={(e) => setBookingForm({...bookingForm, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Meeting</label>
            <textarea
              value={bookingForm.reason}
              onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Please describe what you'd like to discuss..."
              required
            />
          </div>

          </form>
        </div>
        
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="booking-form"
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Book Meeting
            </button>
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
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Parent-Teacher Meetings
          </h3>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Meeting
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'upcoming', label: 'Upcoming Meetings', count: meetings.length },
              { id: 'past', label: 'Past Meetings', count: pastMeetings.length }
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
          {activeTab === 'upcoming' && renderUpcomingMeetings()}
          {activeTab === 'past' && renderPastMeetings()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setShowTeacherAvailabilityForm(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <h5 className="font-medium">View Teacher Availability</h5>
            <p className="text-sm text-gray-600">Check when teachers are available for meetings</p>
          </button>
          <button 
            onClick={() => setShowEmergencyContactForm(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Phone className="w-6 h-6 text-green-600 mb-2" />
            <h5 className="font-medium">Emergency Contact</h5>
            <p className="text-sm text-gray-600">Contact teachers for urgent matters</p>
          </button>
          <button 
            onClick={() => setShowSendMessageForm(true)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
          >
            <Mail className="w-6 h-6 text-purple-600 mb-2" />
            <h5 className="font-medium">Send Message</h5>
            <p className="text-sm text-gray-600">Send a message to your child's teachers</p>
          </button>
        </div>
      </div>

      {showBookingForm && renderBookingForm()}
      
      {/* Send Message Form */}
      {showSendMessageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                💬 Send Message to Teachers
              </h3>
              <button
                onClick={() => setShowSendMessageForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <form id="send-message-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                
                alert(`✅ Message Sent Successfully!\n\nRecipients: ${data.recipients}\nMessage Type: ${data.messageType}\nSubject: ${data.subject}\nPriority: ${data.priority}\nFollow-up Requested: ${data.followUp ? 'Yes' : 'No'}\n\nYour message has been sent to the selected recipients. You will receive a response soon.`);
                setShowSendMessageForm(false);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Select Recipients *
                  </label>
                  <select name="recipients" className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                    <option value="">Select Recipients</option>
                    <option value="all">All Teachers</option>
                    <option value="homeroom">Homeroom Teacher</option>
                    <option value="subject">Subject Teachers</option>
                    <option value="principal">Principal</option>
                    <option value="specific">Specific Teacher</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Message Type *
                  </label>
                  <select name="messageType" className="w-full p-3 rounded-lg border bg-white border-gray-300" required>
                    <option value="">Select Type</option>
                    <option value="general">General Inquiry</option>
                    <option value="academic">Academic Concern</option>
                    <option value="behavioral">Behavioral Issue</option>
                    <option value="medical">Medical Information</option>
                    <option value="schedule">Schedule Change</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    placeholder="Brief subject line"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    className="w-full p-3 rounded-lg border bg-white border-gray-300"
                    placeholder="Type your message here..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Priority Level
                  </label>
                  <select name="priority" className="w-full p-3 rounded-lg border bg-white border-gray-300">
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="followUp"
                    id="follow-up"
                    className="mr-2"
                  />
                  <label htmlFor="follow-up" className="text-sm text-gray-700">
                    Request follow-up response within 24 hours
                  </label>
                </div>
              </form>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSendMessageForm(false)}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="send-message-form"
                  className="flex-1 py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Availability Form */}
      {showTeacherAvailabilityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">📅 Teacher Availability Schedule</h3>
              <button
                onClick={() => setShowTeacherAvailabilityForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* General Availability */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">General Availability Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-blue-800">Monday - Friday</p>
                    <p className="text-blue-700">3:00 PM - 5:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Saturday</p>
                    <p className="text-blue-700">9:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Teacher Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Ms. Johnson - Mathematics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wednesday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Friday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-yellow-600">Limited</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Mr. Smith - English</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tuesday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thursday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday</span>
                      <span className="font-medium text-red-600">Unavailable</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Dr. Brown - Science</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wednesday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thursday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Friday</span>
                      <span className="font-medium text-yellow-600">Limited</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Ms. Davis - History</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tuesday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Friday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-green-600">Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wednesday</span>
                      <span className="font-medium text-red-600">Unavailable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">📋 Booking Instructions</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Book meetings at least 24 hours in advance</li>
                  <li>• Select a time slot that works for both you and the teacher</li>
                  <li>• Provide a clear reason for the meeting</li>
                  <li>• Choose between in-person or virtual meeting options</li>
                  <li>• You will receive a confirmation email once the teacher approves</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTeacherAvailabilityForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowTeacherAvailabilityForm(false);
                    setShowBookingForm(true);
                  }}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Book Meeting Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact Form */}
      {showEmergencyContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">🚨 Emergency Contact</h3>
              <button
                onClick={() => setShowEmergencyContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Emergency Contact Information */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-3">Emergency Contact Numbers</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-red-800">School Main Office</span>
                    <a href="tel:+5551234567" className="font-medium text-red-600 hover:text-red-800">(555) 123-4567</a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-800">Principal</span>
                    <a href="tel:+5551234568" className="font-medium text-red-600 hover:text-red-800">(555) 123-4568</a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-800">Vice Principal</span>
                    <a href="tel:+5551234569" className="font-medium text-red-600 hover:text-red-800">(555) 123-4569</a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-800">After Hours Emergency</span>
                    <a href="tel:+5551234570" className="font-medium text-red-600 hover:text-red-800">(555) 123-4570</a>
                  </div>
                </div>
              </div>

              {/* Emergency Hours */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-3">Emergency Hours</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-yellow-800">School Hours</p>
                    <p className="text-yellow-700">7:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800">After Hours</p>
                    <p className="text-yellow-700">24/7 Emergency Hotline</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Send Emergency Message</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData.entries());
                  
                  alert(`🚨 Emergency Message Sent!\n\nRecipient: ${data.recipient}\nUrgency Level: ${data.urgency}\nSubject: ${data.subject}\nMessage: ${data.message}\n\nYour emergency message has been sent. You should also call the emergency number for immediate assistance.`);
                  setShowEmergencyContactForm(false);
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient *</label>
                    <select name="recipient" className="w-full p-3 border border-gray-300 rounded-lg" required>
                      <option value="">Select Recipient</option>
                      <option value="principal">Principal</option>
                      <option value="vice-principal">Vice Principal</option>
                      <option value="homeroom-teacher">Homeroom Teacher</option>
                      <option value="school-nurse">School Nurse</option>
                      <option value="security">Security Office</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
                    <select name="urgency" className="w-full p-3 border border-gray-300 rounded-lg" required>
                      <option value="">Select Urgency</option>
                      <option value="low">Low - General concern</option>
                      <option value="medium">Medium - Needs attention today</option>
                      <option value="high">High - Urgent matter</option>
                      <option value="critical">Critical - Immediate attention required</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Brief subject line"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Describe the emergency situation..."
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEmergencyContactForm(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Send Emergency Message
                    </button>
                  </div>
                </form>
              </div>

              {/* Emergency Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📞 Emergency Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• For immediate assistance, call the emergency numbers above</li>
                  <li>• Use this form for non-urgent emergency communications</li>
                  <li>• Always follow up with a phone call for critical matters</li>
                  <li>• Provide as much detail as possible about the situation</li>
                  <li>• Include your contact information for immediate response</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentMeetingsPanel;
