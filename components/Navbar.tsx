
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_NAME } from '../constants';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-cyan-400'
    }`;

  return (
    <nav className="bg-black shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-cyan-400 font-bold text-xl">
              {APP_NAME}
            </NavLink>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <NavLink to="/" className={navLinkClasses}>Inicio</NavLink>
              <NavLink to="/exercises" className={navLinkClasses}>Ejercicios</NavLink>
              <NavLink to="/routines" className={navLinkClasses}>Rutinas</NavLink>
              <NavLink to="/profile" className={navLinkClasses}>Perfil</NavLink>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-700 hover:text-white transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;