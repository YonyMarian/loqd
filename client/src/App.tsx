import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import About from './pages/About';
import SuggestionBox from './pages/SuggestionBox';
import ChatDetail from './pages/ChatDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/suggestion-box" element={<SuggestionBox />} />
        <Route path="/chat/:chatId" element={<ChatDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
