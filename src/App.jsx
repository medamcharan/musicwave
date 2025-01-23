import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Albums from './pages/Albums';
import Singers from './pages/Singers';
import Sidebar from './components/Sidebar';
import PlayerControls from './components/PlayerControls';
import './App.css';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/singers" element={<Singers />} />
            </Routes>
          </div>
          <PlayerControls />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;