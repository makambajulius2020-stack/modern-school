import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Plus, Edit, Trash2, Users, Calendar, AlertTriangle, 
  CheckCircle, X, Save, Eye, FileText, Shield, Activity, Clock,
  Heart, Pill, Syringe, Thermometer, Droplets, User, Phone, Mail
} from 'lucide-react';

const MedicalManagementPanel = ({ userRole, currentUser, darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (userRole === 'admin') {
      loadDashboard();
      loadData();
    }
  }, [userRole]);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/medical/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboard(data.dashboard || {});
      }
    } catch (error) {
      console.error('Error loading medical dashboard:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const [recordsRes, vaccinationsRes, checkupsRes, incidentsRes, prescriptionsRes, alertsRes, staffRes] = await Promise.all([
        fetch(`${baseUrl}/api/medical/records`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/medical/vaccinations`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/medical/checkups`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/medical/incidents`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/medical/prescriptions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/medical/alerts`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/medical/staff`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (recordsRes.ok) {
        const data = await recordsRes.json();
        setRecords(data.records || []);
      }
      if (vaccinationsRes.ok) {
        const data = await vaccinationsRes.json();
        setVaccinations(data.vaccinations || []);
      }
      if (checkupsRes.ok) {
        const data = await checkupsRes.json();
        setCheckups(data.checkups || []);
      }
      if (incidentsRes.ok) {
        const data = await incidentsRes.json();
        setIncidents(data.incidents || []);
      }
      if (prescriptionsRes.ok) {
        const data = await prescriptionsRes.json();
        setPrescriptions(data.prescriptions || []);
      }
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.alerts || []);
      }
      if (staffRes.ok) {
        const data = await staffRes.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error('Error loading medical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item ? { ...item } : getDefaultFormData(type));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
  };

  const getDefaultFormData = (type) => {
    const defaults = {
      record: {
        blood_group: '',
        height_cm: 0,
        weight_kg: 0,
        allergies: [],
        chronic_conditions: [],
        status: 'active'
      },
      vaccination: {
        vaccine_name: '',
        vaccine_type: 'routine',
        vaccination_date: new Date().toISOString().split('T')[0],
        status: 'completed'
      },
      checkup: {
        checkup_type: 'annual',
        checkup_date: new Date().toISOString().split('T')[0],
        provider_name: '',
        status: 'completed'
      },
      incident: {
        incident_type: 'injury',
        severity: 'minor',
        incident_date: new Date().toISOString(),
        status: 'open'
      },
      prescription: {
        medication_name: '',
        dosage: '',
        frequency: 'daily',
        status: 'active'
      },
      alert: {
        alert_type: 'allergy',
        severity: 'medium',
        status: 'active',
        created_date: new Date().toISOString().split('T')[0]
      },
      staff: {
        license_type: 'RN',
        employment_type: 'full_time',
        status: 'active',
        availability: 'available'
      }
    };
    return defaults[type] || {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const url = selectedItem 
        ? `${baseUrl}/api/medical/${modalType}s/${selectedItem.id}`
        : `${baseUrl}/api/medical/${modalType}s`;
      
      const method = selectedItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`✅ ${modalType} ${selectedItem ? 'updated' : 'created'} successfully!`);
        closeModal();
        loadData();
        loadDashboard();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('❌ Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/medical/${type}s/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert(`✅ ${type} deleted successfully!`);
        loadData();
        loadDashboard();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('❌ Error deleting data');
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Access Restricted</h3>
        <p className="text-gray-500">Medical Management is only available to administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Stethoscope className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medical Management</h1>
              <p className="text-gray-600">Manage student health records, vaccinations, and medical staff</p>
            </div>
          </div>
          
          <button
            onClick={() => openModal('record')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Medical Records</p>
                <p className="text-2xl font-bold text-blue-800">{dashboard.records?.total || 0}</p>
                <p className="text-xs text-blue-600">{dashboard.records?.active || 0} active</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Vaccinations</p>
                <p className="text-2xl font-bold text-green-800">{dashboard.vaccinations?.completed || 0}</p>
                <p className="text-xs text-green-600">{dashboard.vaccinations?.completion_rate || 0}% completion</p>
              </div>
              <Syringe className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">This Month Checkups</p>
                <p className="text-2xl font-bold text-purple-800">{dashboard.checkups?.this_month || 0}</p>
                <p className="text-xs text-purple-600">{dashboard.checkups?.upcoming || 0} upcoming</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Active Alerts</p>
                <p className="text-2xl font-bold text-red-800">{dashboard.alerts?.active || 0}</p>
                <p className="text-xs text-red-600">{dashboard.alerts?.emergency || 0} emergency</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto scrollbar-hide px-6">
            <div className="flex space-x-6 min-w-max">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'records', label: 'Medical Records', icon: FileText },
                { id: 'vaccinations', label: 'Vaccinations', icon: Syringe },
                { id: 'checkups', label: 'Checkups', icon: Calendar },
                { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
                { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
                { id: 'alerts', label: 'Alerts', icon: Shield },
                { id: 'staff', label: 'Medical Staff', icon: Users }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Incidents */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Medical Incidents</h3>
                  <div className="space-y-3">
                    {incidents.slice(0, 5).map((incident, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{incident.incident_type}</p>
                          <p className="text-xs text-gray-500">{incident.incident_date}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          incident.severity === 'major' ? 'bg-orange-100 text-orange-800' :
                          incident.severity === 'minor' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Alerts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Active Medical Alerts</h3>
                  <div className="space-y-3">
                    {alerts.filter(a => a.status === 'active').slice(0, 5).map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{alert.title}</p>
                          <p className="text-xs text-gray-500">{alert.alert_type}</p>
                        </div>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'records' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Student Medical Records</h3>
                <button
                  onClick={() => openModal('record')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Record
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allergies</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emergency Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{record.student?.name}</p>
                            <p className="text-sm text-gray-500">{record.student?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.blood_group || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.allergies ? JSON.parse(record.allergies).length : 0} allergies
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div>
                            <p className="font-medium">{record.emergency_contact_name}</p>
                            <p className="text-xs">{record.emergency_contact_phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            record.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal('record', record)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            <Eye className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete('record', record.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vaccinations Tab */}
          {activeTab === 'vaccinations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vaccination Records</h3>
                <button
                  onClick={() => openModal('vaccination')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vaccination
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaccinations.map((vaccination) => (
                  <div key={vaccination.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Syringe className="w-6 h-6 text-green-600" />
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        vaccination.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vaccination.status}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{vaccination.vaccine_name}</h4>
                    <p className="text-sm text-gray-600 mb-2">Type: {vaccination.vaccine_type}</p>
                    <p className="text-sm text-gray-600 mb-2">Date: {vaccination.vaccination_date}</p>
                    <p className="text-sm text-gray-600 mb-2">Administered by: {vaccination.administered_by}</p>
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => openModal('vaccination', vaccination)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('vaccination', vaccination.id)}
                        className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'checkups' && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Medical checkups will be displayed here</p>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Medical incidents will be displayed here</p>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Prescriptions will be displayed here</p>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Medical alerts will be displayed here</p>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Medical staff will be displayed here</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'record' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select
                        value={formData.blood_group || ''}
                        onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={formData.height_cm || ''}
                        onChange={(e) => setFormData({...formData, height_cm: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={formData.weight_kg || ''}
                        onChange={(e) => setFormData({...formData, weight_kg: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={formData.emergency_contact_name || ''}
                        onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'vaccination' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.vaccine_name || ''}
                        onChange={(e) => setFormData({...formData, vaccine_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Type</label>
                      <select
                        value={formData.vaccine_type || ''}
                        onChange={(e) => setFormData({...formData, vaccine_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="routine">Routine</option>
                        <option value="travel">Travel</option>
                        <option value="seasonal">Seasonal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.vaccination_date || ''}
                        onChange={(e) => setFormData({...formData, vaccination_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Administered By</label>
                      <input
                        type="text"
                        value={formData.administered_by || ''}
                        onChange={(e) => setFormData({...formData, administered_by: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {loading ? 'Saving...' : (selectedItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalManagementPanel;
