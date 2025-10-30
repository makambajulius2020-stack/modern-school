import React, { useState } from 'react';
import { Phone, Mail, MapPin, User, Plus, Edit, Trash2, AlertTriangle, Shield, Clock } from 'lucide-react';

const EmergencyContactsPanel = ({ userRole, currentUser }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    priority: 'primary',
    isAuthorized: true
  });

  // User emergency contacts (start empty; populate from backend or user input)
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // School emergency contacts (start empty; populate from backend if available)
  const schoolContacts = [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingContact) {
      setEmergencyContacts(emergencyContacts.map(contact => 
        contact.id === editingContact.id 
          ? { ...contactForm, id: editingContact.id, lastUpdated: new Date().toISOString().split('T')[0] }
          : contact
      ));
      setEditingContact(null);
    } else {
      const newContact = {
        ...contactForm,
        id: emergencyContacts.length + 1,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setEmergencyContacts([...emergencyContacts, newContact]);
    }
    setShowAddForm(false);
    setContactForm({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      priority: 'primary',
      isAuthorized: true
    });
  };

  const handleEdit = (contact) => {
    setContactForm(contact);
    setEditingContact(contact);
    setShowAddForm(true);
  };

  const handleDelete = (contactId) => {
    if (window.confirm('Are you sure you want to delete this emergency contact?')) {
      setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== contactId));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'primary': return 'bg-red-100 text-red-800';
      case 'secondary': return 'bg-yellow-100 text-yellow-800';
      case 'medical': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'administrative': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'security': return 'bg-orange-100 text-orange-800';
      case 'academic': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <Phone className="w-5 h-5 mr-2 text-red-600" />
              Emergency Contacts
            </h3>
            <p className="text-gray-600 mt-1">Manage emergency contacts for your children</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-800">Emergency Protocol</h4>
            <p className="text-red-700 text-sm mt-1">
              In case of emergency, the school will contact emergency contacts in priority order. 
              Please ensure all information is current and accurate.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Emergency Contacts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Emergency Contacts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-gray-900">{contact.name}</h5>
                  <p className="text-gray-600 text-sm">{contact.relationship}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(contact.priority)}`}>
                    {contact.priority}
                  </span>
                  {contact.isAuthorized && (
                    <Shield className="w-4 h-4 text-green-500" title="Authorized for pickup" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <span>{contact.address}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Last updated: {new Date(contact.lastUpdated).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* School Emergency Contacts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-600" />
          School Emergency Contacts
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schoolContacts.map((contact) => (
            <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-gray-900">{contact.name}</h5>
                  <p className="text-gray-600 text-sm">{contact.role}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(contact.type)}`}>
                  {contact.type}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${contact.phone}`} className="hover:text-blue-600">
                    {contact.phone}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <span>{contact.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{contact.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Emergency Procedures</h4>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h5 className="font-medium text-red-800 mb-2">Medical Emergency</h5>
            <p className="text-red-700 text-sm">
              1. School nurse will provide immediate care<br/>
              2. Emergency services will be called if necessary<br/>
              3. Primary emergency contact will be notified immediately<br/>
              4. Student will be transported to nearest medical facility if required
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h5 className="font-medium text-orange-800 mb-2">School Closure/Emergency</h5>
            <p className="text-orange-700 text-sm">
              1. Parents will be notified via SMS and email<br/>
              2. Students will remain supervised until pickup<br/>
              3. Only authorized contacts can pick up students<br/>
              4. Valid ID required for student release
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Student Illness</h5>
            <p className="text-blue-700 text-sm">
              1. Student will be assessed by school nurse<br/>
              2. Parents will be contacted for pickup if necessary<br/>
              3. Student will rest in medical center until pickup<br/>
              4. Return to school requires medical clearance if applicable
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Contact Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <select
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm({...contactForm, relationship: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Relationship</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Family Friend">Family Friend</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+256 700 123 456"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={contactForm.address}
                  onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                <select
                  value={contactForm.priority}
                  onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="medical">Medical</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="authorized"
                  checked={contactForm.isAuthorized}
                  onChange={(e) => setContactForm({...contactForm, isAuthorized: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="authorized" className="text-sm text-gray-700">
                  Authorized to pick up student from school
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingContact(null);
                    setContactForm({
                      name: '',
                      relationship: '',
                      phone: '',
                      email: '',
                      address: '',
                      priority: 'primary',
                      isAuthorized: true
                    });
                  }}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsPanel;
