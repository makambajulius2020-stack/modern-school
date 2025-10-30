import React, { useEffect, useState } from 'react';

const HostelsPanel = ({ userRole }) => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [filters, setFilters] = useState({ gender: 'all', search: '' });
  const [hostelForm, setHostelForm] = useState({ name: '', gender: 'mixed', capacity: 0, warden_id: '' });
  const [roomForm, setRoomForm] = useState({ hostel_id: '', room_number: '', bed_count: 4 });
  const [allocForm, setAllocForm] = useState({ room_id: '', student_id: '', start_date: '', end_date: '' });

  const token = localStorage.getItem('token') || '';

  const fetchData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const [hRes, rRes, aRes] = await Promise.all([
        fetch(`${baseUrl}/api/hostels`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/allocations`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const hData = await hRes.json();
      const rData = await rRes.json();
      const aData = await aRes.json();
      if (hData.success) setHostels(hData.items);
      if (rData.success) setRooms(rData.items);
      if (aData.success) setAllocations(aData.items);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  // Calculate totals
  const totals = {
    hostels: hostels.length,
    rooms: rooms.length,
    beds: rooms.reduce((sum, room) => sum + (room.bed_count || 0), 0),
    occupied: allocations.filter(a => a.status === 'active').length,
    occupancy: rooms.length > 0 ? Math.round((allocations.filter(a => a.status === 'active').length / rooms.reduce((sum, room) => sum + (room.bed_count || 0), 0)) * 100) : 0
  };

  // Filter hostels
  const filteredHostels = hostels.filter(hostel => {
    const matchesGender = filters.gender === 'all' || hostel.gender === filters.gender;
    const matchesSearch = hostel.name.toLowerCase().includes(filters.search.toLowerCase());
    return matchesGender && matchesSearch;
  });

  const createHostel = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/hostels`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...hostelForm, capacity: Number(hostelForm.capacity) })
      });
      const data = await res.json();
      if (data.success) { setHostelForm({ name: '', gender: 'mixed', capacity: 0, warden_id: '' }); fetchData(); }
    } catch (e) { console.error(e); }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/rooms`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...roomForm, bed_count: Number(roomForm.bed_count) })
      });
      const data = await res.json();
      if (data.success) { setRoomForm({ hostel_id: '', room_number: '', bed_count: 4 }); fetchData(); }
    } catch (e) { console.error(e); }
  };

  const allocate = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/allocations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(allocForm)
      });
      const data = await res.json();
      if (data.success) { setAllocForm({ room_id: '', student_id: '', start_date: '', end_date: '' }); fetchData(); }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-xs text-gray-500">Hostels</div><div className="text-xl font-bold">{totals.hostels}</div></div>
        <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-xs text-gray-500">Rooms</div><div className="text-xl font-bold">{totals.rooms}</div></div>
        <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-xs text-gray-500">Beds</div><div className="text-xl font-bold">{totals.beds}</div></div>
        <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-xs text-gray-500">Occupied</div><div className="text-xl font-bold text-blue-600">{totals.occupied}</div></div>
        <div className="bg-white rounded-xl shadow p-4 text-center"><div className="text-xs text-gray-500">Occupancy</div><div className="text-xl font-bold text-purple-600">{totals.occupancy}%</div></div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Create Hostel</h3>
        <form onSubmit={createHostel} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded p-2" placeholder="Name" value={hostelForm.name} onChange={e=>setHostelForm({...hostelForm,name:e.target.value})} required />
          <select className="border rounded p-2" value={hostelForm.gender} onChange={e=>setHostelForm({...hostelForm,gender:e.target.value})}>
            <option>male</option><option>female</option><option>mixed</option>
          </select>
          <input className="border rounded p-2" type="number" placeholder="Capacity" value={hostelForm.capacity} onChange={e=>setHostelForm({...hostelForm,capacity:e.target.value})} />
          <input className="border rounded p-2" placeholder="Warden User ID" value={hostelForm.warden_id} onChange={e=>setHostelForm({...hostelForm,warden_id:e.target.value})} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-4">Create</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Create Room</h3>
        <form onSubmit={createRoom} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded p-2" placeholder="Hostel ID" value={roomForm.hostel_id} onChange={e=>setRoomForm({...roomForm,hostel_id:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Room Number" value={roomForm.room_number} onChange={e=>setRoomForm({...roomForm,room_number:e.target.value})} required />
          <input className="border rounded p-2" type="number" placeholder="Beds" value={roomForm.bed_count} onChange={e=>setRoomForm({...roomForm,bed_count:e.target.value})} />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Add Room</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Allocate Student</h3>
        <form onSubmit={allocate} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="border rounded p-2" placeholder="Room ID" value={allocForm.room_id} onChange={e=>setAllocForm({...allocForm,room_id:e.target.value})} required />
          <input className="border rounded p-2" placeholder="Student User ID" value={allocForm.student_id} onChange={e=>setAllocForm({...allocForm,student_id:e.target.value})} required />
          <input className="border rounded p-2" type="date" value={allocForm.start_date} onChange={e=>setAllocForm({...allocForm,start_date:e.target.value})} required />
          <input className="border rounded p-2" type="date" value={allocForm.end_date} onChange={e=>setAllocForm({...allocForm,end_date:e.target.value})} />
          <button className="bg-purple-600 text-white px-4 py-2 rounded">Allocate</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Hostels</h3>
          <div className="flex gap-2">
            <select className="border rounded p-2 text-sm" value={filters.gender} onChange={e=>setFilters({...filters,gender:e.target.value})}>
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="mixed">Mixed</option>
            </select>
            <input className="border rounded p-2 text-sm" placeholder="Search by name..." value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredHostels.map(h => (
            <div key={h.id} className="border rounded p-4">
              <div className="font-semibold">{h.name}</div>
              <div className="text-xs text-gray-500 mb-2">Gender: {h.gender} • Rooms: {h.room_count}</div>
              <div className="text-sm">Beds: <span className="font-medium">{h.beds}</span> • Occupied: <span className="font-medium">{h.occupied}</span></div>
              <div className="mt-2 h-2 bg-gray-100 rounded">
                <div className="h-2 bg-purple-500 rounded" style={{ width: `${h.occupancy}%` }} title={`Occupancy ${h.occupancy}%`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Allocations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-2">Room</th>
                <th className="p-2">Student</th>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.room_id}</td>
                  <td className="p-2">{a.student_id}</td>
                  <td className="p-2">{a.start_date}</td>
                  <td className="p-2">{a.end_date || '-'}</td>
                  <td className="p-2">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HostelsPanel;
