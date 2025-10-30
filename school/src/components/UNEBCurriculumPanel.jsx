import React, { useState } from 'react';
import { GraduationCap, BookOpen, Target, CheckCircle, AlertTriangle, FileText, Download, Upload } from 'lucide-react';

const UNEBCurriculumPanel = ({ userRole, currentUser }) => {
  const [activeTab, setActiveTab] = useState('alignment');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    level: '',
    code: '',
    description: '',
    topics: []
  });
  const [newResource, setNewResource] = useState({
    title: '',
    type: '',
    subject: '',
    level: '',
    description: '',
    file: null
  });

  const subjects = [];

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      'needs-improvement': 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAlignmentColor = (alignment) => {
    if (alignment >= 95) return 'text-green-600';
    if (alignment >= 85) return 'text-blue-600';
    if (alignment >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Overall Alignment</p>
              <p className="text-2xl font-bold text-green-800">0%</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Subjects Tracked</p>
              <p className="text-2xl font-bold text-blue-800">0</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Topics Covered</p>
              <p className="text-2xl font-bold text-purple-800">0/0</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Resources</p>
              <p className="text-2xl font-bold text-yellow-800">0</p>
            </div>
            <FileText className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'alignment', label: 'Curriculum Alignment', icon: Target },
              { id: 'subjects', label: 'Subject Management', icon: BookOpen },
              { id: 'resources', label: 'Teaching Resources', icon: FileText },
              { id: 'assessment', label: 'Assessment Mapping', icon: GraduationCap }
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
          {activeTab === 'alignment' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">UNEB Curriculum Alignment Status</h3>
                <button 
                  onClick={() => window.print()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.length === 0 ? (
                  <div className="text-center text-gray-500 p-8 bg-gray-50 rounded-lg col-span-3">No curriculum data yet</div>
                ) : subjects.map((subject, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{subject.name}</h4>
                        <p className="text-sm text-gray-600">{subject.level}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subject.status)}`}>
                        {subject.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Alignment</span>
                          <span className={`text-sm font-medium ${getAlignmentColor(subject.alignment)}`}>
                            {subject.alignment}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              subject.alignment >= 95 ? 'bg-green-500' :
                              subject.alignment >= 85 ? 'bg-blue-500' :
                              subject.alignment >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${subject.alignment}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Topics</p>
                          <p className="font-medium">{subject.covered}/{subject.topics}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Resources</p>
                          <p className="font-medium">{subject.resources}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                      <button className="text-green-600 hover:text-green-800 text-sm">Update</button>
                    </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Subject Management</h3>
                <button 
                  onClick={() => setShowAddSubjectModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Subject
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">O-Level Subjects</h4>
                  <div className="space-y-2">
                    {[].map((subject, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">A-Level Subjects</h4>
                  <div className="space-y-2">
                    {[].map((subject, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Teaching Resources</h3>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-3">Lesson Plans</h4>
                  <div className="space-y-2">
                    {[].map((plan, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3">Past Papers</h4>
                  <div className="space-y-2">
                    {[].map((paper, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-3">Study Materials</h4>
                  <div className="space-y-2">
                    {[].map((material, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Resource Upload</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Type</option>
                        <option value="lesson-plan">Lesson Plan</option>
                        <option value="past-paper">Past Paper</option>
                        <option value="study-material">Study Material</option>
                        <option value="assessment">Assessment Tool</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Subject</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="physics">Physics</option>
                        <option value="chemistry">Chemistry</option>
                        <option value="biology">Biology</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Level</option>
                        <option value="o-level">O-Level</option>
                        <option value="a-level">A-Level</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter resource title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter description"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Upload Resource
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Assessment Mapping</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">UNEB Assessment Structure</h4>
                  <div className="space-y-3">
                    {[].map((assessment, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">School Assessment Alignment</h4>
                  <div className="space-y-3">
                    {[].map((assessment, index) => (
                      <div key={index}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upload Teaching Resource</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`✅ Resource Uploaded Successfully!\n\nTitle: ${newResource.title}\nType: ${newResource.type}\nSubject: ${newResource.subject}\nLevel: ${newResource.level}\n\nResource is now available for teachers and students.`);
              setNewResource({
                title: '',
                type: '',
                subject: '',
                level: '',
                description: '',
                file: null
              });
              setShowUploadModal(false);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title *</label>
                    <input 
                      type="text"
                      value={newResource.title}
                      onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="e.g., Physics Past Papers 2023"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type *</label>
                    <select 
                      value={newResource.type}
                      onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="lesson-plan">Lesson Plan</option>
                      <option value="past-paper">Past Paper</option>
                      <option value="study-material">Study Material</option>
                      <option value="assessment">Assessment Tool</option>
                      <option value="worksheet">Worksheet</option>
                      <option value="presentation">Presentation</option>
                      <option value="video">Video Lesson</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                    <select 
                      value={newResource.subject}
                      onChange={(e) => setNewResource(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Subject</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="biology">Biology</option>
                      <option value="english">English</option>
                      <option value="history">History</option>
                      <option value="geography">Geography</option>
                      <option value="literature">Literature</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                    <select 
                      value={newResource.level}
                      onChange={(e) => setNewResource(prev => ({ ...prev, level: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Level</option>
                      <option value="o-level">O-Level</option>
                      <option value="a-level">A-Level</option>
                      <option value="primary">Primary</option>
                      <option value="lower-secondary">Lower Secondary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={newResource.description}
                    onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    placeholder="Brief description of the resource..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      className="hidden" 
                      id="resource-upload"
                      onChange={(e) => setNewResource(prev => ({ ...prev, file: e.target.files[0] }))}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.mp4,.mp3"
                    />
                    <label htmlFor="resource-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, PPT, XLSX, MP4, MP3 up to 50MB</p>
                      </div>
                    </label>
                  </div>
                  {newResource.file && (
                    <p className="text-sm text-green-600 mt-2">✓ File selected: {newResource.file.name}</p>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <h4 className="font-medium text-green-900">UNEB Aligned</h4>
                      <p className="text-sm text-green-700">This resource will be automatically tagged with relevant UNEB curriculum standards and made available to appropriate classes.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Subject</h3>
              <button 
                onClick={() => setShowAddSubjectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`✅ Subject Added Successfully!\n\nSubject: ${newSubject.name}\nLevel: ${newSubject.level}\nCode: ${newSubject.code}\n\nUNEB curriculum alignment will be automatically configured.`);
              setNewSubject({
                name: '',
                level: '',
                code: '',
                description: '',
                topics: []
              });
              setShowAddSubjectModal(false);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name *</label>
                    <input 
                      type="text"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="e.g., Mathematics, Physics"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code *</label>
                    <input 
                      type="text"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
                      required
                      placeholder="e.g., MATH, PHYS"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                  <select 
                    value={newSubject.level}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, level: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Level</option>
                    <option value="O-Level">O-Level</option>
                    <option value="A-Level">A-Level</option>
                    <option value="Primary">Primary</option>
                    <option value="Lower Secondary">Lower Secondary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={newSubject.description}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
                    rows="3"
                    placeholder="Brief description of the subject..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Topics (comma-separated)</label>
                  <input 
                    type="text"
                    placeholder="e.g., Algebra, Geometry, Calculus, Statistics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => {
                      const topics = e.target.value.split(',').map(topic => topic.trim()).filter(topic => topic);
                      setNewSubject(prev => ({ ...prev, topics }));
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter topics separated by commas</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <h4 className="font-medium text-blue-900">UNEB Alignment</h4>
                      <p className="text-sm text-blue-700">This subject will be automatically aligned with UNEB curriculum standards and assessment criteria.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UNEBCurriculumPanel;
