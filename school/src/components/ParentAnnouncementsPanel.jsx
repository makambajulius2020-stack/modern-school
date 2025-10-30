import React, { useState, useEffect } from 'react';
import { 
  Bell, Eye, Calendar, Clock, AlertCircle, CheckCircle, 
  Filter, Search, Pin, Download, Share2, X, ChevronDown,
  Megaphone, BookOpen, DollarSign, Trophy, Briefcase, Home
} from 'lucide-react';

const ParentAnnouncementsPanel = ({ userRole = 'parent', currentUser, darkMode = false }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState('all');

  const cardBg = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const bgPrimary = darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/ai-teaching/announcements?target_audience=parents');
      // const data = await response.json();
      // setAnnouncements(data.data || []);
      setAnnouncements([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
      setLoading(false);
    }
  };

  const handleAcknowledge = async (announcementId) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/ai-teaching/announcements/${announcementId}/acknowledge`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     user_id: currentUser?.id,
      //     user_type: 'parent',
      //     user_name: currentUser?.name
      //   })
      // });
      
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === announcementId 
            ? { ...ann, acknowledged: true, acknowledgments: ann.acknowledgments + 1 }
            : ann
        )
      );
    } catch (error) {
      console.error('Error acknowledging announcement:', error);
    }
  };

  const handleViewAnnouncement = async (announcement) => {
    setSelectedAnnouncement(announcement);
    
    if (!announcement.viewed) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/ai-teaching/announcements/${announcement.id}/view`, {
        //   method: 'POST'
        // });
        
        setAnnouncements(prev => 
          prev.map(ann => 
            ann.id === announcement.id 
              ? { ...ann, viewed: true, views: ann.views + 1 }
              : ann
          )
        );
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'academic': return <BookOpen className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'fee': return <DollarSign className="w-4 h-4" />;
      case 'exam': return <Trophy className="w-4 h-4" />;
      case 'holiday': return <Home className="w-4 h-4" />;
      default: return <Megaphone className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'fee': return 'bg-green-100 text-green-800';
      case 'exam': return 'bg-yellow-100 text-yellow-800';
      case 'holiday': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || announcement.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    const matchesAcknowledged = acknowledgedFilter === 'all' || 
                               (acknowledgedFilter === 'acknowledged' && announcement.acknowledged) ||
                               (acknowledgedFilter === 'unacknowledged' && !announcement.acknowledged);
    return matchesSearch && matchesCategory && matchesPriority && matchesAcknowledged;
  });

  const pinnedAnnouncements = filteredAnnouncements.filter(ann => ann.is_pinned);
  const regularAnnouncements = filteredAnnouncements.filter(ann => !ann.is_pinned);

  if (loading) {
    return (
      <div className={`min-h-screen ${bgPrimary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl lg:text-4xl font-bold ${textPrimary}`}>
                School Announcements
              </h1>
              <p className={`${textSecondary} text-lg`}>
                Stay updated with important school information
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Total Announcements</p>
                <p className={`${textPrimary} text-2xl font-bold mt-2`}>{announcements.length}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Unread</p>
                <p className={`${textPrimary} text-2xl font-bold mt-2`}>
                  {announcements.filter(ann => !ann.viewed).length}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Requires Action</p>
                <p className={`${textPrimary} text-2xl font-bold mt-2`}>
                  {announcements.filter(ann => ann.requires_acknowledgment && !ann.acknowledged).length}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl shadow-xl p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textMuted} text-sm font-medium`}>Acknowledged</p>
                <p className={`${textPrimary} text-2xl font-bold mt-2`}>
                  {announcements.filter(ann => ann.acknowledged).length}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}
                />
              </div>
            </div>
            
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="event">Events</option>
                <option value="urgent">Urgent</option>
                <option value="general">General</option>
                <option value="fee">Fees</option>
                <option value="exam">Exams</option>
                <option value="holiday">Holidays</option>
              </select>
            </div>

            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'}`}
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => setAcknowledgedFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                acknowledgedFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setAcknowledgedFilter('unacknowledged')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                acknowledgedFilter === 'unacknowledged'
                  ? 'bg-blue-600 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Needs Acknowledgment
            </button>
            <button
              onClick={() => setAcknowledgedFilter('acknowledged')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                acknowledgedFilter === 'acknowledged'
                  ? 'bg-blue-600 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Acknowledged
            </button>
          </div>
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${textPrimary} mb-4 flex items-center`}>
              <Pin className="w-5 h-5 mr-2 text-blue-600" />
              Pinned Announcements
            </h2>
            <div className="space-y-4">
              {pinnedAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  darkMode={darkMode}
                  cardBg={cardBg}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  textMuted={textMuted}
                  getPriorityColor={getPriorityColor}
                  getCategoryIcon={getCategoryIcon}
                  getCategoryColor={getCategoryColor}
                  onView={handleViewAnnouncement}
                  onAcknowledge={handleAcknowledge}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div className="space-y-4">
          {regularAnnouncements.length > 0 ? (
            regularAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                darkMode={darkMode}
                cardBg={cardBg}
                textPrimary={textPrimary}
                textSecondary={textSecondary}
                textMuted={textMuted}
                getPriorityColor={getPriorityColor}
                getCategoryIcon={getCategoryIcon}
                getCategoryColor={getCategoryColor}
                onView={handleViewAnnouncement}
                onAcknowledge={handleAcknowledge}
              />
            ))
          ) : (
            <div className={`${cardBg} rounded-2xl shadow-xl p-12 text-center`}>
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>No Announcements</h3>
              <p className={`${textSecondary}`}>
                {announcements.length === 0 
                  ? "There are no announcements at this time."
                  : "No announcements match your current filters."}
              </p>
            </div>
          )}
        </div>

        {/* Announcement Detail Modal */}
        {selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`${cardBg} rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                        {selectedAnnouncement.priority.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedAnnouncement.category)}`}>
                        {getCategoryIcon(selectedAnnouncement.category)}
                        <span className="ml-1">{selectedAnnouncement.category}</span>
                      </span>
                      {selectedAnnouncement.is_pinned && (
                        <Pin className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
                      {selectedAnnouncement.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`${textMuted} flex items-center`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(selectedAnnouncement.created_at).toLocaleDateString()}
                      </span>
                      <span className={`${textMuted}`}>
                        By {selectedAnnouncement.author_name}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAnnouncement(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className={`${textSecondary} mb-6 whitespace-pre-wrap`}>
                  {selectedAnnouncement.content}
                </div>

                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                  <div className="mb-6">
                    <h3 className={`font-medium ${textPrimary} mb-3`}>Attachments</h3>
                    <div className="space-y-2">
                      {selectedAnnouncement.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className={`${textSecondary} text-sm`}>
                            {file.name} ({file.size})
                          </span>
                          <button className="text-blue-600 hover:text-blue-700">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-6 text-sm">
                    <span className={`${textMuted} flex items-center`}>
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedAnnouncement.views} views
                    </span>
                    <span className={`${textMuted} flex items-center`}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {selectedAnnouncement.acknowledgments} acknowledged
                    </span>
                  </div>
                  
                  {selectedAnnouncement.requires_acknowledgment && !selectedAnnouncement.acknowledged && (
                    <button
                      onClick={() => {
                        handleAcknowledge(selectedAnnouncement.id);
                        setSelectedAnnouncement({ ...selectedAnnouncement, acknowledged: true });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                  
                  {selectedAnnouncement.acknowledged && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Acknowledged</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Announcement Card Component
const AnnouncementCard = ({ 
  announcement, 
  darkMode, 
  cardBg, 
  textPrimary, 
  textSecondary, 
  textMuted,
  getPriorityColor,
  getCategoryIcon,
  getCategoryColor,
  onView,
  onAcknowledge
}) => {
  const isUnread = !announcement.viewed;
  const needsAcknowledgment = announcement.requires_acknowledgment && !announcement.acknowledged;

  return (
    <div 
      className={`${cardBg} rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer ${
        isUnread ? 'border-l-4 border-blue-600' : ''
      }`}
      onClick={() => onView(announcement)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {announcement.is_pinned && (
              <Pin className="w-4 h-4 text-blue-600" />
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
              {announcement.priority.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getCategoryColor(announcement.category)}`}>
              {getCategoryIcon(announcement.category)}
              <span className="ml-1 capitalize">{announcement.category}</span>
            </span>
            {isUnread && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                NEW
              </span>
            )}
          </div>
          
          <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>
            {announcement.title}
          </h3>
          
          <p className={`${textSecondary} mb-3 line-clamp-2`}>
            {announcement.content}
          </p>

          <div className="flex items-center space-x-6 text-sm">
            <span className={`${textMuted} flex items-center`}>
              <Clock className="w-4 h-4 mr-1" />
              {new Date(announcement.created_at).toLocaleDateString()}
            </span>
            <span className={`${textMuted}`}>
              By {announcement.author_name}
            </span>
            <span className={`${textMuted} flex items-center`}>
              <Eye className="w-4 h-4 mr-1" />
              {announcement.views}
            </span>
          </div>
        </div>

        <div className="ml-4 flex flex-col items-end space-y-2">
          {needsAcknowledgment && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAcknowledge(announcement.id);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledge</span>
            </button>
          )}
          
          {announcement.acknowledged && (
            <div className="flex items-center space-x-1 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledged</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentAnnouncementsPanel;
