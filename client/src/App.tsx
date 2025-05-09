<<<<<<< HEAD
import Landing from './pages/Landing'
import UploadCal from './components/upload_cal';

import './App.css'

function App() {
  return (
    <>
      <UploadCal />
      <Landing />
    </>
  )
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/account" element={<Account />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
>>>>>>> master
}

export default App;