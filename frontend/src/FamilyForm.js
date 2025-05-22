import React, { useState } from 'react';

function FamilyForm() {
  const [count, setCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const patientName = localStorage.getItem('patientName');

  const handleCountChange = (e) => {
    const num = parseInt(e.target.value, 10) || 0;
    setCount(num);
    setMembers(Array(num).fill({ name: '', phone: '' }));
  };

  const handleMemberChange = (i, field, value) => {
    const updated = [...members];
    updated[i] = { ...updated[i], [field]: value };
    setMembers(updated);
  };

  const handleFamilySubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/family', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName, family: members })
    });
    setSubmitted(true);
  };

  if (submitted) return <h3 className="mt-4">Family members notified successfully.</h3>;

  return (
    <div className="container mt-5">
      <h2>Family Info for {patientName}</h2>
      <form onSubmit={handleFamilySubmit}>
        <label>Number of direct family members:</label>
        <input type="number" className="form-control mb-3" onChange={handleCountChange} required />

        {members.map((member, i) => (
          <div key={i} className="mb-3">
            <input
              type="text"
              placeholder="Member Name"
              className="form-control mb-1"
              onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="form-control"
              onChange={(e) => handleMemberChange(i, 'phone', e.target.value)}
              required
            />
          </div>
        ))}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default FamilyForm;
