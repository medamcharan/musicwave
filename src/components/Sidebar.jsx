import { NavLink } from 'react-router-dom';
import { FaHome, FaHeart, FaCompactDisc, FaUser } from 'react-icons/fa';
import '../assets/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* MusicWave Logo */}
      <h2 className="musicwave-logo">MusicWave</h2>

      {/* Navigation Links */}
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaHome />
          <span>𝘏𝘰𝘮𝘦
          </span>
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaHeart />
          <span> 𝘍𝘢𝘷𝘰𝘳𝘪𝘵𝘦𝘴</span>
        </NavLink>
        <NavLink to="/albums" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaCompactDisc />
          <span>𝘈𝘭𝘣𝘶𝘮𝘴
          </span>
        </NavLink>
        <NavLink to="/singers" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaUser />
          <span>𝘚𝘪𝘯𝘨𝘦𝘳𝘴
          </span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;