import React, { useState, useEffect } from 'react';
import { 
  Bus, Plus, Edit, Trash2, Users, MapPin, Clock, DollarSign, 
  Settings, BarChart3, AlertTriangle, CheckCircle, X, Save,
  Calendar, Phone, Mail, Compass, Zap, Wrench, Eye
} from 'lucide-react';

const TransportManagementPanel = ({ userRole, currentUser, darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
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
      const response = await fetch(`${baseUrl}/api/transport/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDashboard(data.dashboard || {});
      }
    } catch (error) {
      console.error('Error loading transport dashboard:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const [vehiclesRes, driversRes, routesRes, assignmentsRes, tripsRes, maintenanceRes] = await Promise.all([
        fetch(`${baseUrl}/api/transport/vehicles`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/transport/drivers`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/transport/routes`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/transport/student-assignments`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/transport/trips`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/transport/maintenance`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (vehiclesRes.ok) {
        const data = await vehiclesRes.json();
        setVehicles(data.vehicles || []);
      }
      if (driversRes.ok) {
        const data = await driversRes.json();
        setDrivers(data.drivers || []);
      }
      if (routesRes.ok) {
        const data = await routesRes.json();
        setRoutes(data.routes || []);
      }
      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments || []);
      }
      if (tripsRes.ok) {
        const data = await tripsRes.json();
        setTrips(data.trips || []);
      }
      if (maintenanceRes.ok) {
        const data = await maintenanceRes.json();
        setMaintenance(data.maintenance || []);
      }
    } catch (error) {
      console.error('Error loading transport data:', error);
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
      vehicle: {
        vehicle_number: '',
        vehicle_type: 'bus',
        capacity: 30,
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        fuel_type: 'diesel',
        status: 'active'
      },
      driver: {
        license_number: '',
        license_class: 'D',
        experience_years: 0,
        employment_type: 'full_time',
        status: 'active',
        availability: 'available'
      },
      route: {
        route_name: '',
        route_number: '',
        start_location: '',
        end_location: '',
        pickup_time: '07:00',
        dropoff_time: '16:00',
        operating_days: 'mon-fri',
        max_capacity: 30,
        monthly_fee: 0,
        status: 'active'
      },
      assignment: {
        pickup_location: '',
        dropoff_location: '',
        pickup_contact: '',
        emergency_contact: '',
        status: 'active',
        monthly_fee: 0,
        payment_status: 'pending'
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
        ? `${baseUrl}/api/transport/${modalType}s/${selectedItem.id}`
        : `${baseUrl}/api/transport/${modalType}s`;
      
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
      const response = await fetch(`${baseUrl}/api/transport/${type}s/${id}`, {
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
        <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Access Restricted</h3>
        <p className="text-gray-500">Transport Management is only available to administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bus className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transport Management</h1>
              <p className="text-gray-600">Manage vehicles, drivers, routes, and student transport</p>
            </div>
          </div>
          
          <button
            onClick={() => openModal('vehicle')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Vehicles</p>
                <p className="text-2xl font-bold text-blue-800">{dashboard.vehicles?.total || 0}</p>
                <p className="text-xs text-blue-600">{dashboard.vehicles?.active || 0} active</p>
              </div>
              <Bus className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Drivers</p>
                <p className="text-2xl font-bold text-green-800">{dashboard.drivers?.active || 0}</p>
                <p className="text-xs text-green-600">{dashboard.drivers?.available || 0} available</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Active Routes</p>
                <p className="text-2xl font-bold text-purple-800">{dashboard.routes?.active || 0}</p>
                <p className="text-xs text-purple-600">{dashboard.routes?.utilization_rate || 0}% utilization</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Today's Trips</p>
                <p className="text-2xl font-bold text-orange-800">{dashboard.trips?.today_total || 0}</p>
                <p className="text-xs text-orange-600">{dashboard.trips?.completion_rate || 0}% completed</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'vehicles', label: 'Vehicles', icon: Bus },
              { id: 'drivers', label: 'Drivers', icon: Users },
              { id: 'routes', label: 'Routes', icon: MapPin },
              { id: 'assignments', label: 'Assignments', icon: Users },
              { id: 'trips', label: 'Trips', icon: Clock },
              { id: 'maintenance', label: 'Maintenance', icon: Wrench }
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Trips */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
                  <div className="space-y-3">
                    {trips.slice(0, 5).map((trip, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{trip.route?.route_name}</p>
                          <p className="text-xs text-gray-500">{trip.trip_date}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trip.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maintenance Alerts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Maintenance Alerts</h3>
                  <div className="space-y-3">
                    {maintenance.filter(m => m.status === 'scheduled').slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{item.vehicle?.vehicle_number}</p>
                          <p className="text-xs text-gray-500">{item.service_type}</p>
                        </div>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vehicle Fleet</h3>
                <button
                  onClick={() => openModal('vehicle')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Bus className="w-6 h-6 text-blue-600" />
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{vehicle.vehicle_number}</h4>
                    <p className="text-sm text-gray-600 mb-2">{vehicle.make} {vehicle.model}</p>
                    <p className="text-sm text-gray-600 mb-2">Capacity: {vehicle.capacity} passengers</p>
                    <p className="text-sm text-gray-600 mb-2">License: {vehicle.license_plate}</p>
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => openModal('vehicle', vehicle)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('vehicle', vehicle.id)}
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

          {/* Drivers Tab */}
          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Driver Management</h3>
                <button
                  onClick={() => openModal('driver')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Driver
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drivers.map((driver) => (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{driver.user?.name}</p>
                            <p className="text-sm text-gray-500">{driver.user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {driver.license_number} ({driver.license_class})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {driver.experience_years} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {driver.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openModal('driver', driver)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete('driver', driver.id)}
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

          {/* Routes Tab */}
          {activeTab === 'routes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Transport Routes</h3>
                <button
                  onClick={() => openModal('route')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Route
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {routes.map((route) => (
                  <div key={route.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        route.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {route.status}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{route.route_name}</h4>
                    <p className="text-sm text-gray-600 mb-2">Route #{route.route_number}</p>
                    <p className="text-sm text-gray-600 mb-2">{route.start_location} → {route.end_location}</p>
                    <p className="text-sm text-gray-600 mb-2">Pickup: {route.pickup_time} | Dropoff: {route.dropoff_time}</p>
                    <p className="text-sm text-gray-600 mb-2">Capacity: {route.current_enrollment}/{route.max_capacity}</p>
                    <p className="text-sm text-gray-600 mb-2">Fee: UGX {route.monthly_fee?.toLocaleString()}</p>
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => openModal('route', route)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 inline mr-1" />
                        Edit
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50">
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab === 'assignments' && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Student transport assignments will be displayed here</p>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Transport trips will be displayed here</p>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Vehicle maintenance records will be displayed here</p>
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
              {modalType === 'vehicle' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.vehicle_number || ''}
                        onChange={(e) => setFormData({...formData, vehicle_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                      <select
                        required
                        value={formData.vehicle_type || ''}
                        onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="bus">Bus</option>
                        <option value="van">Van</option>
                        <option value="car">Car</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                      <input
                        type="number"
                        required
                        value={formData.capacity || ''}
                        onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Plate *</label>
                      <input
                        type="text"
                        required
                        value={formData.license_plate || ''}
                        onChange={(e) => setFormData({...formData, license_plate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'driver' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.license_number || ''}
                        onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Class *</label>
                      <select
                        required
                        value={formData.license_class || ''}
                        onChange={(e) => setFormData({...formData, license_class: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="B">Class B</option>
                        <option value="C">Class C</option>
                        <option value="D">Class D</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'route' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.route_name || ''}
                        onChange={(e) => setFormData({...formData, route_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route Number *</label>
                      <input
                        type="text"
                        required
                        value={formData.route_number || ''}
                        onChange={(e) => setFormData({...formData, route_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.start_location || ''}
                        onChange={(e) => setFormData({...formData, start_location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Location *</label>
                      <input
                        type="text"
                        required
                        value={formData.end_location || ''}
                        onChange={(e) => setFormData({...formData, end_location: e.target.value})}
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

export default TransportManagementPanel;
