'use client';

import { useRouter } from 'next/navigation';
import { FaClipboardList, FaUser, FaClipboardCheck } from 'react-icons/fa';
import { CiLogout } from 'react-icons/ci';
import { useEffect, useState } from 'react';
import { logOut } from 'src/Utilities/Conexion';

const SidebarItem = ({ icon: Icon, label, createHref, consultHref, directHref, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (directHref) {
      router.push(directHref);
    }
  };

  return (
    <div className="group">
      <div
        className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-deepblue hover:shadow-lg"
        onClick={handleClick}
      >
        <Icon size="24" />
        <span className="hidden group-hover:inline-block text-lg font-semibold font-sans whitespace-nowrap">{label}</span>
      </div>
      {!directHref && !onClick && (
        <div className="pl-10 mt-2 hidden group-hover:block transition-all duration-300">
          {createHref && (
            <button
              className="block text-sm mb-2 transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-300 hover:from-deepblue hover:to-blue-400 rounded-lg p-2 w-full text-left shadow-sm font-medium"
              onClick={() => router.push(createHref)}
            >
              Crear
            </button>
          )}
          {consultHref && (
            <button
              className="block text-sm transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-300 hover:from-deepblue hover:to-blue-400 rounded-lg p-2 w-full text-left shadow-sm font-medium"
              onClick={() => router.push(consultHref)}
            >
              Consultar
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRol = localStorage.getItem('vc_role_id');
      const storedUsername = localStorage.getItem('vc_username');
      const storedRoleName = localStorage.getItem('vc_role_name');

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
  }, []);

  const handleLogout = async () => {
    const response = await logOut();
    if (response) {
      window.location.reload();
    }
  };

  return (
    <div className="bg-brightBlue p-4 sticky top-0 left-0 flex flex-col h-screen w-16 text-white group transition-all duration-300 hover:w-64 shadow-md overflow-y-auto">
      {/* Logo */}
      <button onClick={() => router.push('/')} className="flex items-center space-x-2 mb-4">
        <span className="font-bold text-lg font-sans">GN</span>
      </button>

      {/* Menú principal */}
      <div className="flex-grow">
        <SidebarItem icon={FaClipboardList} label="Órden de Trabajo" createHref="/pages/create-order" consultHref="/pages/get-order" />
        <div>
          {rol === 1 || rol === 2 || rol === 3 ? (
            <SidebarItem icon={FaClipboardCheck} label="Gestión" directHref="/pages/checking" />
          ) : null}
        </div>
        <div className="py-4 mt-4 border-t border-white">
          <SidebarItem icon={FaUser} label="Clientes" createHref="/pages/create-client" consultHref="/pages/get-client" />
        </div>
      </div>

      {/* Información del Usuario */}
      <div className="mb-4 p-2 rounded-lg bg-blue-600 flex flex-col group-hover:flex hidden items-start">
        <p className="text-sm font-semibold">Bienvenido, {username}</p>
        <p className="text-sm font-light">{roleName}</p>
      </div>

      {/* Botón de Cerrar Sesión */}
      <div className="border-t border-white mt-2 pt-4">
        <SidebarItem icon={CiLogout} label="Cerrar Sesión" onClick={handleLogout} />
      </div>
    </div>
  );
}
