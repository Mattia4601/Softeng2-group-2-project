import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/customer/ServicesPage';
import TicketPage from './pages/customer/TicketPage';
import './App.css';
import CounterPage from "./pages/CounterPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/customer/ticket" element={<TicketPage />} />
        <Route path="/counter-dashboard" element={<CounterPage />} />
      </Routes>
    </Router>
  )
}

export default App
