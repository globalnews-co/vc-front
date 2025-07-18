'use client';

import { useRouter } from 'next/navigation';
import { FaClipboardList, FaUser, FaClipboardCheck, FaSignOutAlt, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { logOut } from 'src/Utilities/Conexion';

const SidebarItem = ({ icon: Icon, label, createHref, consultHref, directHref, onClick, isOpen, active }) => {
  const router = useRouter();
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (directHref) {
      router.push(directHref);
    } else {
      setIsSubmenuOpen(!isSubmenuOpen);
    }
  };

  return (
    <div className="group mb-3">
      <div
        className={`flex items-center justify-between rounded-lg transition-all duration-200 p-3 cursor-pointer ${
          active ? 'bg-blue-600' : 'hover:bg-blue-600'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8">
            <Icon size={20} className="text-white" />
          </div>
          {isOpen && (
            <span className="text-sm font-medium whitespace-nowrap text-white">{label}</span>
          )}
        </div>
        {isOpen && !directHref && !onClick && (
          <FaChevronRight 
            size={14} 
            className={`text-white transition-transform duration-200 ${isSubmenuOpen ? 'rotate-90' : ''}`} 
          />
        )}
      </div>
      {isOpen && !directHref && !onClick && (
        <div 
          className={`mt-1 ml-4 pl-4 border-l border-blue-300 overflow-hidden transition-all duration-300 ease-in-out ${
            isSubmenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {createHref && (
            <button
              className="flex items-center w-full text-sm mb-2 hover:bg-blue-400 rounded-lg py-2 px-3 text-left text-white transition-colors duration-200"
              onClick={() => router.push(createHref)}
            >
              <span className="text-sm">Crear</span>
            </button>
          )}
          {consultHref && (
            <button
              className="flex items-center w-full text-sm hover:bg-blue-400 rounded-lg py-2 px-3 text-left text-white transition-colors duration-200"
              onClick={() => router.push(consultHref)}
            >
              <span className="text-sm">Consultar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function Sidebar() {
  const router = useRouter();
  const [rol, setRol] = useState(null);
  const [username, setUsername] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRol = localStorage.getItem('vc_role_id');
      const storedUsername = localStorage.getItem('vc_nombre');
      const storedRoleName = localStorage.getItem('vc_role_name');
      
      // Determinar la página actual para establecer el item activo
      const path = window.location.pathname;
      if (path.includes('order')) {
        setActiveItem('orden');
      } else if (path.includes('checking')) {
        setActiveItem('gestion');
      } else if (path.includes('client')) {
        setActiveItem('clientes');
      }

      if (storedRol) {
        setRol(JSON.parse(storedRol));
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedRoleName) {
        setRoleName(storedRoleName);
      }
    }

    // Agregar evento para detectar clics fuera del sidebar
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    // Agregar el listener de eventos
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Agregamos isOpen como dependencia para que el efecto se actualice cuando cambia

  const handleLogout = async () => {
    const response = await logOut();
    if (response) {
      window.location.reload();
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Manejador para abrir el sidebar cuando está contraído
  const handleSidebarClick = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div 
      ref={sidebarRef}
      onClick={handleSidebarClick}
      className={`bg-blue-500 sticky top-0 left-0 flex flex-col h-screen text-white transition-all duration-300 ease-in-out shadow-xl relative ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Botón para expandir/contraer */}
      <button 
        className="absolute -right-3 top-20 bg-white text-blue-500 rounded-full p-1 shadow-md z-10 hover:bg-blue-50 transition-colors duration-200"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-blue-400/30">
        <div className="flex items-center space-x-2">
          <span className="text-white text-xl font-bold w-10 h-10 flex items-center justify-center">GN</span>
        </div>
      </div>

      {/* Menú principal */}
      <div className="flex-grow px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300">
        <SidebarItem 
          icon={FaClipboardList} 
          label="Órden de Trabajo" 
          createHref="/pages/create-order" 
          consultHref="/pages/get-order"
          isOpen={isOpen}
          active={activeItem === 'orden'}
        />
        
        {rol === 1 || rol === 2 || rol === 3 ? (
          <SidebarItem 
            icon={FaClipboardCheck} 
            label="Gestión" 
            directHref="/pages/checking"
            isOpen={isOpen}
            active={activeItem === 'gestion'}
          />
        ) : null}
        
        <div className="my-4 border-t border-blue-300/30"></div>
        
        <SidebarItem 
          icon={FaUser} 
          label="Clientes" 
          createHref="/pages/create-client" 
          consultHref="/pages/get-client"
          isOpen={isOpen}
          active={activeItem === 'clientes'}
        />
      </div>

      {/* Información del Usuario */}
      <div className="mt-auto border-t border-blue-300/30 pt-3 px-3 pb-4">
        <div className={`bg-blue-600/20 p-3 rounded-lg mb-4 ${!isOpen && 'text-center'}`}>
          {isOpen ? (
            <>
              <p className="text-sm font-medium truncate">{username || 'comercial_user'}</p>
              <p className="text-xs text-blue-200 truncate">{roleName || 'Comercial'}</p>
            </>
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm font-bold">{username ? username.charAt(0).toUpperCase() : 'C'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Botón de Cerrar Sesión */}
        <button
          className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} w-full p-3 text-white hover:bg-blue-400 rounded-lg transition-colors duration-200`}
          onClick={handleLogout}
        >
          <FaSignOutAlt size={16} />
          {isOpen && <span className="text-sm">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}
