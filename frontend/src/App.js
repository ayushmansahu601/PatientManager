import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Patients from './Patients';
import FamilyForm from './FamilyForm';

export default function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Patients />} />
        <Route path="/family" element={<FamilyForm />} />
      </Routes>
    </Router>
  );
}
