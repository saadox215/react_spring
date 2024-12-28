import './App.css'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/LoginProf/LoginProf';
import Admin from './components/LoginAdmin/LoginAdmin';
import Dashboard from './Dashboard';
import DashProf from './DashPro'
function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profs/login" element={<Login />} />
        <Route path="/admin/login" element={<Admin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/prof/dashboard" element={<DashProf />} />
      </Routes>
    </div>
  );
}

export default App;

