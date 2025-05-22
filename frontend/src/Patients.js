import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API = 'http://localhost:8000/patients';

function App() {
  const [form, setForm] = useState({ name: '', phone: '', date: '', disease: '' });
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setPatients(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${editingId}` : API;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
     if (form.disease.toLowerCase() === 'glaucoma') {
    localStorage.setItem('patientName', form.name);
    window.location.href = '/family';
    return;
  }


    setForm({ name: '', phone: '', date: '', disease: '' });
    setEditingId(null);
    fetchPatients();
  };

  const handleEdit = (patient) => {
    setForm(patient);
    setEditingId(patient.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchPatients();
  };

  return (
    <div className="container mt-5">
      <h2>Patient Manager</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="text" name="name" placeholder="Name" className="form-control mb-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type="text" name="phone" placeholder="Phone" className="form-control mb-2" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
        <input type="date" name="date" className="form-control mb-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
        <input type="text" name="disease" placeholder="Disease" className="form-control mb-2" value={form.disease} onChange={e => setForm({ ...form, disease: e.target.value })} required />
        <button className="btn btn-primary">{editingId ? 'Update' : 'Add'} Patient</button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Disease</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.phone}</td>
              <td>{p.date}</td>
              <td>{p.disease}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
