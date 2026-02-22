import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import RoomsPage from './pages/RoomsPage';
import StudentsPage from './pages/StudentsPage';
import FeesPage from './pages/FeesPage';
import ComplaintsPage from './pages/ComplaintsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/warden" element={<WardenDashboard />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
